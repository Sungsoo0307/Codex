#!/usr/bin/env -S node --import tsx
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import {
  findChromeExecutableLinux,
  findChromeExecutableMac,
  findChromeExecutableWindows,
} from "../src/browser/chrome.executables.js";

type Args = {
  brand: string;
  outputDir: string;
  headful: boolean;
  timeoutMs: number;
  settleMs: number;
};

type ProbeTarget = {
  id: string;
  url: string;
};

type ProbeResult = {
  id: string;
  url: string;
  finalUrl: string;
  statusCode: number | null;
  title: string;
  blocked: boolean;
  blockedReason: string;
  lines: string[];
  screenshotPath: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function parseArgs(argv: string[]): Args {
  const args: Args = {
    brand: "닥터지",
    outputDir: "tmp/naver-probe",
    headful: false,
    timeoutMs: 20_000,
    settleMs: 1_500,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--brand" && argv[i + 1]) {
      args.brand = argv[++i];
      continue;
    }
    if (arg === "--output-dir" && argv[i + 1]) {
      args.outputDir = argv[++i];
      continue;
    }
    if (arg === "--timeout-ms" && argv[i + 1]) {
      args.timeoutMs = Number.parseInt(argv[++i] ?? "", 10) || args.timeoutMs;
      continue;
    }
    if (arg === "--settle-ms" && argv[i + 1]) {
      args.settleMs = Number.parseInt(argv[++i] ?? "", 10) || args.settleMs;
      continue;
    }
    if (arg === "--headful") {
      args.headful = true;
      continue;
    }
    if (arg === "--help") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node --import tsx scripts/naver-crawlability-probe.ts [options]

Options:
  --brand <name>         Brand keyword to probe (default: 닥터지)
  --output-dir <path>    Output directory (default: tmp/naver-probe)
  --timeout-ms <n>       Navigation timeout (default: 20000)
  --settle-ms <n>        Wait after navigation (default: 1500)
  --headful              Launch a visible browser
`);
}

function resolveExecutablePath(): string | undefined {
  const envCandidate = [
    process.env.OPENCLAW_BROWSER_EXECUTABLE_PATH,
    process.env.BROWSER_EXECUTABLE_PATH,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  ]
    .map((value) => value?.trim())
    .find(Boolean);
  if (envCandidate) {
    return envCandidate;
  }
  if (process.platform === "darwin") {
    return findChromeExecutableMac()?.path;
  }
  if (process.platform === "linux") {
    return findChromeExecutableLinux()?.path;
  }
  if (process.platform === "win32") {
    return findChromeExecutableWindows()?.path;
  }
  return undefined;
}

function buildTargets(brand: string): ProbeTarget[] {
  return [
    {
      id: "shopping_home",
      url: "https://shopping.naver.com/ns/home",
    },
    {
      id: "shopping_search",
      url: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(brand)}`,
    },
    {
      id: "naver_search_live_site",
      url: `https://search.naver.com/search.naver?query=${encodeURIComponent(`${brand} site:shoppinglive.naver.com`)}`,
    },
    {
      id: "naver_search_shortclip_site",
      url: `https://search.naver.com/search.naver?query=${encodeURIComponent(`${brand} site:shoppinglive.naver.com/shortclip`)}`,
    },
    {
      id: "shoppinglive_home",
      url: "https://shoppinglive.naver.com/home",
    },
  ];
}

async function extractLines(page: import("playwright-core").Page): Promise<string[]> {
  return await page.evaluate(() => {
    const root =
      document.querySelector("main") ||
      document.querySelector('[role="main"]') ||
      document.querySelector("#content") ||
      document.body;
    return (root?.textContent ?? "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 20);
  });
}

function detectBlocked(
  statusCode: number | null,
  lines: string[],
): { blocked: boolean; reason: string } {
  const joined = lines.join(" ");
  if (statusCode === 405 || joined.includes("보안 확인을 완료해 주세요")) {
    return { blocked: true, reason: "security_verification" };
  }
  if (statusCode && statusCode >= 400) {
    return { blocked: true, reason: `http_${statusCode}` };
  }
  if (joined.includes("접근이 제한")) {
    return { blocked: true, reason: "access_limited" };
  }
  return { blocked: false, reason: "" };
}

async function probeTarget(
  page: import("playwright-core").Page,
  target: ProbeTarget,
  outputDir: string,
  args: Args,
): Promise<ProbeResult> {
  let statusCode: number | null = null;
  let finalUrl = target.url;
  try {
    const response = await page.goto(target.url, {
      waitUntil: "domcontentloaded",
      timeout: args.timeoutMs,
    });
    statusCode = response?.status() ?? null;
    await page.waitForTimeout(args.settleMs);
    finalUrl = page.url();
  } catch {
    // Keep whatever page content is available.
  }

  const title = await page.title().catch(() => "");
  const lines = await extractLines(page).catch(() => []);
  const blockedState = detectBlocked(statusCode, lines);
  const screenshotPath = path.join(outputDir, `${target.id}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

  return {
    id: target.id,
    url: target.url,
    finalUrl,
    statusCode,
    title,
    blocked: blockedState.blocked,
    blockedReason: blockedState.reason,
    lines,
    screenshotPath,
  };
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const outputDir = path.resolve(args.outputDir);
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({
    headless: !args.headful,
    ...(resolveExecutablePath() ? { executablePath: resolveExecutablePath() } : {}),
    args: ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    locale: "ko-KR",
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 1400 },
  });

  const page = await context.newPage();
  const results: ProbeResult[] = [];

  try {
    for (const target of buildTargets(args.brand)) {
      const result = await probeTarget(page, target, outputDir, args);
      results.push(result);
      console.log(
        `${target.id}: status=${result.statusCode ?? "n/a"} blocked=${result.blocked ? "yes" : "no"} ${result.blockedReason}`,
      );
    }
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  const resultPath = path.join(outputDir, "probe-results.json");
  await fs.writeFile(resultPath, JSON.stringify({ brand: args.brand, results }, null, 2), "utf8");
  console.log(`Wrote probe results to ${resultPath}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

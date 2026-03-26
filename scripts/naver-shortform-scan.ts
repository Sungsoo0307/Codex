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
import {
  buildSearchTasks,
  csvStringify,
  parseBrandList,
  summarizeBrand,
  summarizeForCsv,
  summarizeScan,
  type PageScanResult,
} from "./lib/naver-shortform-signals.ts";

type Args = {
  brandsPath?: string;
  brandColumn: string;
  outputPath: string;
  delayMs: number;
  settleMs: number;
  headful: boolean;
  limit?: number;
  timeoutMs: number;
};

type ScrapedMainContent = {
  lines: string[];
  links: Array<{ href: string; text: string }>;
  title: string;
};

const DEFAULT_OUTPUT = "tmp/naver-shortform-signals.csv";
const DEFAULT_DELAY_MS = 900;
const DEFAULT_SETTLE_MS = 1_800;
const DEFAULT_TIMEOUT_MS = 20_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function parseArgs(argv: string[]): Args {
  const args: Args = {
    brandColumn: "brand",
    outputPath: DEFAULT_OUTPUT,
    delayMs: DEFAULT_DELAY_MS,
    settleMs: DEFAULT_SETTLE_MS,
    headful: false,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--brands" && argv[i + 1]) {
      args.brandsPath = argv[++i];
      continue;
    }
    if (arg === "--brand-column" && argv[i + 1]) {
      args.brandColumn = argv[++i];
      continue;
    }
    if (arg === "--output" && argv[i + 1]) {
      args.outputPath = argv[++i];
      continue;
    }
    if (arg === "--delay-ms" && argv[i + 1]) {
      args.delayMs = Number.parseInt(argv[++i] ?? "", 10) || DEFAULT_DELAY_MS;
      continue;
    }
    if (arg === "--settle-ms" && argv[i + 1]) {
      args.settleMs = Number.parseInt(argv[++i] ?? "", 10) || DEFAULT_SETTLE_MS;
      continue;
    }
    if (arg === "--timeout-ms" && argv[i + 1]) {
      args.timeoutMs = Number.parseInt(argv[++i] ?? "", 10) || DEFAULT_TIMEOUT_MS;
      continue;
    }
    if (arg === "--limit" && argv[i + 1]) {
      const parsed = Number.parseInt(argv[++i] ?? "", 10);
      args.limit = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
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
  node --import tsx scripts/naver-shortform-scan.ts --brands <brands.txt|brands.csv> [options]

Options:
  --brand-column <name>   CSV column name to read (default: brand)
  --output <path>         CSV output path (default: ${DEFAULT_OUTPUT})
  --limit <n>             Only scan the first n brands
  --delay-ms <n>          Delay between page visits (default: ${DEFAULT_DELAY_MS})
  --settle-ms <n>         Wait time after navigation (default: ${DEFAULT_SETTLE_MS})
  --timeout-ms <n>        Navigation timeout (default: ${DEFAULT_TIMEOUT_MS})
  --headful               Launch a visible browser for debugging

Notes:
  - Output CSV is Google Sheets friendly.
  - Current signal = shopping search result evidence.
  - Historical signal = Naver web search evidence.
  - "stopped_suspect" means current public signal is missing, not guaranteed stop.
`);
}

async function loadBrands(args: Args): Promise<string[]> {
  if (!args.brandsPath) {
    throw new Error("Missing --brands. Provide a txt or csv file with brand names.");
  }
  const raw = await fs.readFile(args.brandsPath, "utf8");
  const brands = parseBrandList(raw, args.brandColumn);
  if (brands.length === 0) {
    throw new Error(`No brands found in ${args.brandsPath}`);
  }
  return args.limit ? brands.slice(0, args.limit) : brands;
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

async function scrapeMainContent(
  page: import("playwright-core").Page,
): Promise<ScrapedMainContent> {
  return await page.evaluate(() => {
    const candidates = [
      document.querySelector("#main_pack"),
      document.querySelector("main"),
      document.querySelector('[role="main"]'),
      document.querySelector("#container"),
      document.querySelector("#__next"),
      document.body,
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);

    const root =
      candidates.find((node) => node.innerText.trim().length > 200) ||
      candidates.find((node) => node.innerText.trim().length > 0) ||
      document.body;

    const lines = root.innerText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 600);

    const links = Array.from(root.querySelectorAll("a[href]"))
      .map((anchor) => ({
        href: anchor.href,
        text: anchor.textContent?.replace(/\s+/g, " ").trim() ?? "",
      }))
      .filter((item) => item.href && item.text)
      .slice(0, 200);

    return {
      lines,
      links,
      title: document.title,
    };
  });
}

async function scanTask(
  page: import("playwright-core").Page,
  brand: string,
  task: ReturnType<typeof buildSearchTasks>[number],
  args: Args,
): Promise<PageScanResult> {
  let finalUrl = task.url;
  let statusCode: number | null = null;

  try {
    const response = await page.goto(task.url, {
      waitUntil: "domcontentloaded",
      timeout: args.timeoutMs,
    });
    statusCode = response?.status() ?? null;
    await page.waitForTimeout(args.settleMs);
    finalUrl = page.url();
    const content = await scrapeMainContent(page);
    return summarizeScan({
      brand,
      bucket: task.bucket,
      label: task.label,
      query: task.query,
      url: task.url,
      finalUrl,
      title: content.title,
      statusCode,
      lines: content.lines,
      links: content.links,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      brand,
      bucket: task.bucket,
      label: task.label,
      query: task.query,
      url: task.url,
      finalUrl,
      title: "",
      statusCode,
      keywordCategories: [],
      evidenceLines: [],
      relevantLinks: [],
      note: `error:${message}`,
    };
  }
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const brands = await loadBrands(args);
  const checkedAt = new Date().toISOString();
  const executablePath = resolveExecutablePath();
  const browser = await chromium.launch({
    headless: !args.headful,
    ...(executablePath ? { executablePath } : {}),
    args: ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    locale: "ko-KR",
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 1400 },
  });

  const summaries = [];
  const scans: PageScanResult[] = [];

  try {
    for (const brand of brands) {
      const page = await context.newPage();
      const brandScans: PageScanResult[] = [];
      for (const task of buildSearchTasks(brand)) {
        const result = await scanTask(page, brand, task, args);
        brandScans.push(result);
        scans.push(result);
        await page.waitForTimeout(args.delayMs);
      }
      await page.close().catch(() => {});
      const summary = summarizeBrand(brand, brandScans, checkedAt);
      summaries.push(summary);
      console.log(
        `${summary.brand}: ${summary.status} current=${summary.currentScore} historical=${summary.historicalScore}`,
      );
    }
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  const csvRows = summaries.map((summary) => summarizeForCsv(summary));
  const outputPath = path.resolve(args.outputPath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, csvStringify(csvRows), "utf8");

  const jsonPath = outputPath.replace(/\.csv$/i, ".json");
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        checkedAt,
        brands,
        summaries,
        scans,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote ${summaries.length} rows to ${outputPath}`);
  console.log(`Wrote raw evidence to ${jsonPath}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli, parseArgs };

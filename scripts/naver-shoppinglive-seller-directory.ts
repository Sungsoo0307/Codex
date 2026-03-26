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
  outputPath: string;
  targetRowsPerCategory: number;
  maxReplaysPerCategory: number;
  maxScrollPasses: number;
  settleMs: number;
  timeoutMs: number;
  headful: boolean;
  categoryCodes?: string[];
};

type CategorySpec = {
  code: string;
  name: string;
  url: string;
};

type CrawlProgressEvent =
  | { phase: "start"; totalCategories: number }
  | {
      phase: "category_start";
      categoryCode: string;
      categoryName: string;
      categoryIndex: number;
      totalCategories: number;
    }
  | {
      phase: "category_skip";
      categoryCode: string;
      categoryName: string;
      categoryIndex: number;
      totalCategories: number;
      existingRows: number;
      targetRows: number;
    }
  | {
      phase: "category_complete";
      categoryCode: string;
      categoryName: string;
      categoryIndex: number;
      totalCategories: number;
      existingRows: number;
      replaySeeds: number;
      addedRows: number;
      totalRows: number;
      targetRows: number;
      noSourceCount: number;
      provisionalDuplicateCount: number;
      finalDuplicateCount: number;
      identityErrorCount: number;
    }
  | { phase: "write" }
  | { phase: "done"; totalRows: number };

type RunHooks = {
  onProgress?: (event: CrawlProgressEvent) => void;
};

type ReplaySeed = {
  categoryCode: string;
  categoryName: string;
  replayUrl: string;
  listTitle: string;
  listViews: number;
};

type ReplayDirectorySource = {
  categoryCode: string;
  categoryName: string;
  replayUrl: string;
  replayTitle: string;
  replayViews: number;
  marketName: string;
  shoppingliveSellerName: string;
  storeUrl: string;
};

type StoreIdentity = {
  profileUrl: string;
  businessName: string;
  sellerName: string;
  hadError?: boolean;
};

export type DirectoryRow = {
  category: string;
  market_name: string;
  seller_name: string;
  business_name: string;
  crawled_at: string;
  shoppinglive_seller_name: string;
  replay_title: string;
  replay_views: number;
  replay_url: string;
  store_url: string;
  profile_url: string;
};

const DIRECTORY_HEADERS: Array<keyof DirectoryRow> = [
  "category",
  "market_name",
  "seller_name",
  "business_name",
  "crawled_at",
  "shoppinglive_seller_name",
  "replay_title",
  "replay_views",
  "replay_url",
  "store_url",
  "profile_url",
];

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const CATEGORIES: CategorySpec[] = [
  { code: "dc:1", name: "뷰티", url: "https://shoppinglive.naver.com/categories/dc:1" },
  { code: "dc:2", name: "푸드", url: "https://shoppinglive.naver.com/categories/dc:2" },
  { code: "dc:3", name: "패션", url: "https://shoppinglive.naver.com/categories/dc:3" },
  { code: "dc:4", name: "라이프", url: "https://shoppinglive.naver.com/categories/dc:4" },
  { code: "dc:5", name: "여행/체험", url: "https://shoppinglive.naver.com/categories/dc:5" },
  { code: "dc:6", name: "키즈", url: "https://shoppinglive.naver.com/categories/dc:6" },
  { code: "dc:7", name: "테크", url: "https://shoppinglive.naver.com/categories/dc:7" },
  { code: "dc:8", name: "취미레저", url: "https://shoppinglive.naver.com/categories/dc:8" },
  { code: "dc:9", name: "문화생활", url: "https://shoppinglive.naver.com/categories/dc:9" },
];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    outputPath: "tmp/naver-shoppinglive-seller-directory.csv",
    targetRowsPerCategory: 50,
    maxReplaysPerCategory: 120,
    maxScrollPasses: 40,
    settleMs: 1_500,
    timeoutMs: 20_000,
    headful: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--output" && argv[i + 1]) {
      args.outputPath = argv[++i];
      continue;
    }
    if (arg === "--target-rows-per-category" && argv[i + 1]) {
      args.targetRowsPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.targetRowsPerCategory;
      continue;
    }
    if (arg === "--max-replays-per-category" && argv[i + 1]) {
      args.maxReplaysPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.maxReplaysPerCategory;
      continue;
    }
    if (arg === "--max-scroll-passes" && argv[i + 1]) {
      args.maxScrollPasses = Number.parseInt(argv[++i] ?? "", 10) || args.maxScrollPasses;
      continue;
    }
    if (arg === "--categories" && argv[i + 1]) {
      args.categoryCodes = String(argv[++i])
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      continue;
    }
    if (arg === "--settle-ms" && argv[i + 1]) {
      args.settleMs = Number.parseInt(argv[++i] ?? "", 10) || args.settleMs;
      continue;
    }
    if (arg === "--timeout-ms" && argv[i + 1]) {
      args.timeoutMs = Number.parseInt(argv[++i] ?? "", 10) || args.timeoutMs;
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
  node --import tsx scripts/naver-shoppinglive-seller-directory.ts [options]

Options:
  --output <path>                   CSV output path (default: tmp/naver-shoppinglive-seller-directory.csv)
  --categories <codes>              Comma-separated category codes, e.g. dc:1,dc:2
  --target-rows-per-category <n>    Target unique rows per category (default: 50)
  --max-replays-per-category <n>    Maximum replay seeds per category (default: 120)
  --max-scroll-passes <n>           Maximum category scroll passes (default: 40)
  --headful                         Launch visible browser

Notes:
  - This script collects only category, market name, seller name, and business name.
  - It does not collect phone numbers or email addresses.
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

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function parseKoreanCount(raw: string): number {
  const value = raw.replace(/,/g, "").trim();
  if (!value) {
    return 0;
  }
  if (value.endsWith("만")) {
    return Math.round(Number.parseFloat(value.replace("만", "")) * 10_000);
  }
  if (value.endsWith("천")) {
    return Math.round(Number.parseFloat(value.replace("천", "")) * 1_000);
  }
  return Number.parseInt(value, 10) || 0;
}

function parseReplayAnchor(text: string) {
  const normalized = normalizeText(text);
  const match = normalized.match(/다시보기\s*([0-9.,만천]+)\s*시청(.*)$/);
  return {
    views: parseKoreanCount(match?.[1] ?? ""),
    title: normalizeText(match?.[2] ?? normalized),
  };
}

function canonicalUrl(raw: string): string {
  try {
    const parsed = new URL(raw);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return raw;
  }
}

function normalizeProfileUrl(raw: string): string {
  try {
    const parsed = new URL(raw);
    if (parsed.hostname === "brand.naver.com" && parsed.pathname.endsWith("/profile")) {
      parsed.search = "";
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function gotoForExtraction(
  page: import("playwright-core").Page,
  url: string,
  args: Args,
  label: string,
): Promise<import("playwright-core").Response | null> {
  try {
    return await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: args.timeoutMs,
    });
  } catch (error) {
    console.warn(`${label}: goto timeout/failure for ${url} :: ${formatErrorMessage(error)}`);
  }

  try {
    return await page.goto(url, {
      waitUntil: "commit",
      timeout: Math.min(args.timeoutMs, 5_000),
    });
  } catch (fallbackError) {
    console.warn(
      `${label}: fallback goto failed for ${url} :: ${formatErrorMessage(fallbackError)}`,
    );
    return null;
  }
}

function extractReplayId(replayUrl: string): number {
  const match = replayUrl.match(/\/replays\/(\d+)/);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

async function collectReplaySeeds(
  page: import("playwright-core").Page,
  category: CategorySpec,
  args: Args,
): Promise<ReplaySeed[]> {
  await page.goto(category.url, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);

  const replays = new Map<string, ReplaySeed>();
  for (let pass = 0; pass < args.maxScrollPasses; pass += 1) {
    const anchors = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map((anchor) => ({
        text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: anchor.href,
      })),
    );

    for (const anchor of anchors) {
      if (!anchor.href.includes("view.shoppinglive.naver.com/replays/")) {
        continue;
      }
      if (!anchor.text.includes("다시보기")) {
        continue;
      }
      const replayUrl = canonicalUrl(anchor.href);
      if (replays.has(replayUrl)) {
        continue;
      }
      const parsed = parseReplayAnchor(anchor.text);
      replays.set(replayUrl, {
        categoryCode: category.code,
        categoryName: category.name,
        replayUrl,
        listViews: parsed.views,
        listTitle: parsed.title,
      });
      if (replays.size >= args.maxReplaysPerCategory) {
        break;
      }
    }

    if (replays.size >= args.maxReplaysPerCategory) {
      break;
    }

    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(800);
  }

  return [...replays.values()].slice(0, args.maxReplaysPerCategory);
}

async function fetchReplayDirectorySource(
  page: import("playwright-core").Page,
  seed: ReplaySeed,
  args: Args,
): Promise<ReplayDirectorySource | null> {
  const replayId = extractReplayId(seed.replayUrl);
  if (!replayId) {
    return null;
  }

  await page.goto(seed.replayUrl, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);

  const payload = await page.evaluate(
    async ({ currentReplayId }) => {
      const slSessionId =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const [broadcastResponse, couponsResponse] = await Promise.all([
        fetch(
          `https://apis.naver.com/live_commerce_web/viewer_api_web/v1/broadcast/${currentReplayId}?needTimeMachine=true&slSessionId=${slSessionId}`,
          { credentials: "include" },
        ),
        fetch(
          `https://apis.naver.com/live_commerce_web/viewer_api_web/v2/broadcast/${currentReplayId}/coupons?slSessionId=${slSessionId}`,
          { credentials: "include" },
        ),
      ]);

      if (!broadcastResponse.ok) {
        return null;
      }

      const broadcast = (await broadcastResponse.json()) as {
        title?: string;
        nickname?: string;
        shoppingProducts?: Array<{
          mallName?: string;
          productEndUrl?: string;
          name?: string;
        }>;
      };

      const coupons = couponsResponse.ok
        ? ((await couponsResponse.json()) as {
            channel?: {
              nickname?: string;
              broadcasterServiceHomeEndUrl?: string;
            };
          })
        : null;

      return {
        replayTitle: broadcast.title ?? "",
        shoppingliveSellerName: broadcast.nickname ?? coupons?.channel?.nickname ?? "",
        marketName:
          broadcast.shoppingProducts?.[0]?.mallName ??
          coupons?.channel?.nickname ??
          broadcast.nickname ??
          "",
        storeUrl: coupons?.channel?.broadcasterServiceHomeEndUrl ?? "",
      };
    },
    { currentReplayId: replayId },
  );

  if (!payload?.marketName) {
    return null;
  }

  return {
    categoryCode: seed.categoryCode,
    categoryName: seed.categoryName,
    replayUrl: seed.replayUrl,
    replayTitle: normalizeText(payload.replayTitle || seed.listTitle),
    replayViews: seed.listViews,
    marketName: normalizeText(payload.marketName),
    shoppingliveSellerName: normalizeText(payload.shoppingliveSellerName),
    storeUrl: normalizeText(payload.storeUrl),
  };
}

function extractSellerIdentity(lines: string[]): { businessName: string; sellerName: string } {
  const normalizedLines = lines.map((line) => normalizeText(line));
  const labeledLine = normalizedLines.find(
    (line) => line.includes("판매자정보상호명") && line.includes("대표자"),
  );
  if (!labeledLine) {
    return { businessName: "", sellerName: "" };
  }

  const match = labeledLine.match(/판매자정보상호명(.+?)대표자(.+?)(상세정보 확인|$)/);
  if (!match) {
    return { businessName: "", sellerName: "" };
  }

  return {
    businessName: normalizeText(match[1] ?? ""),
    sellerName: normalizeText(match[2] ?? ""),
  };
}

async function fetchStoreIdentity(
  page: import("playwright-core").Page,
  storeUrl: string,
  args: Args,
): Promise<StoreIdentity> {
  if (!storeUrl) {
    return { profileUrl: "", businessName: "", sellerName: "" };
  }

  const storeResponse = await gotoForExtraction(page, storeUrl, args, "store");
  if (!storeResponse) {
    return { profileUrl: "", businessName: "", sellerName: "", hadError: true };
  }
  if (storeResponse.status() >= 400) {
    console.warn(`store: HTTP ${storeResponse.status()} for ${storeUrl}`);
  }
  await page.waitForTimeout(args.settleMs);

  const storeSnapshot = await page.evaluate(() => ({
    profileUrl:
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
        .map((anchor) => ({
          text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
          href: anchor.href,
        }))
        .find((anchor) => anchor.text === "판매자 정보")?.href ?? "",
    lines: (document.body.innerText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean),
  }));

  const fromStore = extractSellerIdentity(storeSnapshot.lines);
  if (fromStore.businessName && fromStore.sellerName) {
    return {
      profileUrl: normalizeProfileUrl(storeSnapshot.profileUrl),
      businessName: fromStore.businessName,
      sellerName: fromStore.sellerName,
    };
  }

  if (!storeSnapshot.profileUrl) {
    return { profileUrl: "", businessName: "", sellerName: "" };
  }

  const profileUrl = normalizeProfileUrl(storeSnapshot.profileUrl);
  const profileResponse = await gotoForExtraction(page, profileUrl, args, "profile");
  if (!profileResponse) {
    return { profileUrl, businessName: "", sellerName: "", hadError: true };
  }
  if (profileResponse.status() >= 400) {
    console.warn(`profile: HTTP ${profileResponse.status()} for ${profileUrl}`);
  }
  await page.waitForTimeout(args.settleMs);

  const profileLines = await page.evaluate(() =>
    (document.body.innerText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean),
  );
  const fromProfile = extractSellerIdentity(profileLines);
  return {
    profileUrl,
    businessName: fromProfile.businessName,
    sellerName: fromProfile.sellerName,
    hadError: profileResponse.status() >= 400,
  };
}

function toCsv(rows: DirectoryRow[]): string {
  const escaped = (value: string | number) => {
    const raw = String(value);
    if (!/[",\n]/.test(raw)) {
      return raw;
    }
    return `"${raw.replace(/"/g, '""')}"`;
  };

  return [
    DIRECTORY_HEADERS.join(","),
    ...rows.map((row) => DIRECTORY_HEADERS.map((header) => escaped(row[header])).join(",")),
  ].join("\n");
}

function readStringField(row: Record<string, unknown>, key: string, fallback = ""): string {
  const value = row[key];
  return typeof value === "string" ? value : fallback;
}

function normalizeExistingRow(row: Record<string, unknown>, generatedAt = ""): DirectoryRow {
  return {
    category: normalizeText(readStringField(row, "category")),
    market_name: normalizeText(readStringField(row, "market_name")),
    seller_name: normalizeText(readStringField(row, "seller_name")),
    business_name: normalizeText(readStringField(row, "business_name")),
    crawled_at: normalizeText(readStringField(row, "crawled_at", generatedAt)),
    shoppinglive_seller_name: normalizeText(readStringField(row, "shoppinglive_seller_name")),
    replay_title: normalizeText(readStringField(row, "replay_title")),
    replay_views: Number(row.replay_views ?? 0) || 0,
    replay_url: normalizeText(readStringField(row, "replay_url")),
    store_url: normalizeText(readStringField(row, "store_url")),
    profile_url: normalizeText(readStringField(row, "profile_url")),
  };
}

function buildDirectoryKey(
  row: Pick<DirectoryRow, "category" | "market_name" | "store_url" | "profile_url">,
) {
  return [row.category, row.market_name, row.store_url, row.profile_url].join("|");
}

async function loadExistingRows(outputPath: string): Promise<DirectoryRow[]> {
  const jsonPath = outputPath.replace(/\.csv$/i, ".json");
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(raw) as {
      generatedAt?: string;
      rows?: Array<Record<string, unknown>>;
    };
    return (parsed.rows ?? []).map((row) => normalizeExistingRow(row, parsed.generatedAt ?? ""));
  } catch {
    return [];
  }
}

async function runDirectory(args: Args, hooks: RunHooks = {}) {
  const categories = CATEGORIES.filter((category) =>
    args.categoryCodes?.length ? args.categoryCodes.includes(category.code) : true,
  );
  hooks.onProgress?.({ phase: "start", totalCategories: categories.length });
  const outputPath = path.resolve(args.outputPath);
  const existingRows = await loadExistingRows(outputPath);
  const rows: DirectoryRow[] = [...existingRows];
  const dedupe = new Set(existingRows.map((row) => buildDirectoryKey(row)));
  const existingRowsByCategory = existingRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});

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

  const listPage = await context.newPage();
  const replayPage = await context.newPage();
  const storePage = await context.newPage();
  const storeIdentityCache = new Map<string, StoreIdentity>();

  try {
    for (const [index, category] of categories.entries()) {
      const existingCount = existingRowsByCategory[category.name] ?? 0;
      hooks.onProgress?.({
        phase: "category_start",
        categoryCode: category.code,
        categoryName: category.name,
        categoryIndex: index + 1,
        totalCategories: categories.length,
      });
      if (existingCount >= args.targetRowsPerCategory) {
        console.log(
          `${category.name}: existing_rows=${existingCount} target=${args.targetRowsPerCategory} skip`,
        );
        hooks.onProgress?.({
          phase: "category_skip",
          categoryCode: category.code,
          categoryName: category.name,
          categoryIndex: index + 1,
          totalCategories: categories.length,
          existingRows: existingCount,
          targetRows: args.targetRowsPerCategory,
        });
        continue;
      }
      const seeds = await collectReplaySeeds(listPage, category, args);
      let added = 0;
      let noSourceCount = 0;
      let provisionalDuplicateCount = 0;
      let finalDuplicateCount = 0;
      let identityErrorCount = 0;
      for (const seed of seeds) {
        if (existingCount + added >= args.targetRowsPerCategory) {
          break;
        }
        const source = await fetchReplayDirectorySource(replayPage, seed, args);
        if (!source) {
          noSourceCount += 1;
          continue;
        }

        const provisionalKey = buildDirectoryKey({
          category: source.categoryName,
          market_name: source.marketName,
          store_url: source.storeUrl,
          profile_url: "",
        });
        if (dedupe.has(provisionalKey)) {
          provisionalDuplicateCount += 1;
          continue;
        }

        let identity = storeIdentityCache.get(source.storeUrl);
        if (!identity) {
          identity = await fetchStoreIdentity(storePage, source.storeUrl, args);
          storeIdentityCache.set(source.storeUrl, identity);
        }
        if (identity.hadError) {
          identityErrorCount += 1;
        }

        const row: DirectoryRow = {
          category: source.categoryName,
          market_name: source.marketName,
          seller_name: identity.sellerName,
          business_name: identity.businessName,
          crawled_at: new Date().toISOString(),
          shoppinglive_seller_name: source.shoppingliveSellerName,
          replay_title: source.replayTitle,
          replay_views: source.replayViews,
          replay_url: source.replayUrl,
          store_url: source.storeUrl,
          profile_url: identity.profileUrl,
        };

        const dedupeKey = buildDirectoryKey(row);
        if (dedupe.has(dedupeKey)) {
          finalDuplicateCount += 1;
          continue;
        }
        dedupe.add(dedupeKey);
        rows.push(row);
        added += 1;
      }

      console.log(
        `${category.name}: existing_rows=${existingCount} replay_seeds=${seeds.length} added_rows=${added} total_rows=${existingCount + added} target=${args.targetRowsPerCategory}`,
      );
      hooks.onProgress?.({
        phase: "category_complete",
        categoryCode: category.code,
        categoryName: category.name,
        categoryIndex: index + 1,
        totalCategories: categories.length,
        existingRows: existingCount,
        replaySeeds: seeds.length,
        addedRows: added,
        totalRows: existingCount + added,
        targetRows: args.targetRowsPerCategory,
        noSourceCount,
        provisionalDuplicateCount,
        finalDuplicateCount,
        identityErrorCount,
      });
    }
  } finally {
    await storePage.close().catch(() => {});
    await replayPage.close().catch(() => {});
    await listPage.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  hooks.onProgress?.({ phase: "write" });
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${toCsv(rows)}\n`, "utf8");

  const jsonPath = outputPath.replace(/\.csv$/i, ".json");
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        args,
        rows,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote seller directory to ${outputPath}`);
  console.log(`Wrote raw data to ${jsonPath}`);
  hooks.onProgress?.({ phase: "done", totalRows: rows.length });
}

async function runCli(argv: string[], hooks: RunHooks = {}) {
  const args = parseArgs(argv);
  await runDirectory(args, hooks);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { CATEGORIES, DIRECTORY_HEADERS, runCli, runDirectory, toCsv };

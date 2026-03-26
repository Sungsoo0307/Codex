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
  perCategory: number;
  stopDays: number;
  startGapDays: number;
  minReplayViews: number;
  minHistoricalViews: number;
  minCorporateScore: number;
  maxShortclipsPerCategory: number;
  maxReplaysPerCategory: number;
  maxLatestClipsPerChannel: number;
  headful: boolean;
  timeoutMs: number;
  settleMs: number;
  categoryCodes?: string[];
};

type CategorySpec = {
  code: string;
  name: string;
  url: string;
};

type CategoryShortclipSeed = {
  categoryCode: string;
  categoryName: string;
  clipUrl: string;
  listViews: number;
  listTitle: string;
};

type CategoryReplaySeed = {
  categoryCode: string;
  categoryName: string;
  replayUrl: string;
  listViews: number;
  listTitle: string;
};

type ShortclipDetail = {
  shortclipId: number;
  title: string;
  expectedExposeAt: string;
  channelId: number;
  channelName: string;
  channelShortclipUrl: string;
  brandName: string;
  smartStore: boolean;
  products: Array<{ name: string; stock: number }>;
};

type ChannelClipHistory = {
  totalClipCount: number;
  clips: Array<{ clipUrl: string; listViews: number; detail: ShortclipDetail | null }>;
};

type CorporateSignal = {
  score: number;
  sellerType: "corporate_like" | "marketplace_like" | "unclear";
  signals: string[];
};

type BrandHistoryAggregate = {
  categoryCode: string;
  categoryName: string;
  brandName: string;
  brandKey: string;
  channelId: number;
  channelName: string;
  channelShortclipUrl: string;
  corporate: CorporateSignal;
  seenSeedClipCount: number;
  seenSeedViews: number;
  latestClipAt?: string;
  daysSinceLatestClip?: number;
  totalChannelClipCount: number;
  latestClipTitles: string[];
  latestClipUrls: string[];
};

type ReplayCandidate = {
  categoryCode: string;
  categoryName: string;
  replayUrl: string;
  replayId: number;
  listTitle: string;
  listViews: number;
  brandName: string;
  channelId: number;
  channelName: string;
  channelShortclipUrl: string;
  productNames: string[];
  corporate: CorporateSignal;
};

type OpportunityRow = {
  type: "stopped_suspect" | "likely_to_start";
  category: string;
  brand_name: string;
  corporate_score: number;
  seller_type: string;
  latest_clip_at: string;
  days_since_latest_clip: number;
  historical_views: number;
  replay_views: number;
  channel_name: string;
  reason: string;
  evidence_titles: string;
  urls: string;
};

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

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const CORPORATE_POSITIVE_KEYWORDS = [
  "공식",
  "직영",
  "본사",
  "코리아",
  "브랜드데이",
  "론칭",
  "labs",
  "lab",
  "코스메틱",
  "제약",
  "바이오",
  "푸드",
  "식품",
  "유업",
  "전자",
  "프라엘",
];

const MARKETPLACE_NEGATIVE_KEYWORDS = [
  "협력사",
  "마켓",
  "market",
  "농수산",
  "직송",
  "샵",
  "몰",
  "아울렛",
  "언니",
  "상회",
  "셀렉트",
];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    outputPath: "tmp/naver-shoppinglive-opportunities.csv",
    perCategory: 10,
    stopDays: 7,
    startGapDays: 14,
    minReplayViews: 2000,
    minHistoricalViews: 3000,
    minCorporateScore: 4,
    maxShortclipsPerCategory: 24,
    maxReplaysPerCategory: 12,
    maxLatestClipsPerChannel: 12,
    headful: false,
    timeoutMs: 20_000,
    settleMs: 1_200,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--output" && argv[i + 1]) {
      args.outputPath = argv[++i];
      continue;
    }
    if (arg === "--per-category" && argv[i + 1]) {
      args.perCategory = Number.parseInt(argv[++i] ?? "", 10) || args.perCategory;
      continue;
    }
    if (arg === "--stop-days" && argv[i + 1]) {
      args.stopDays = Number.parseInt(argv[++i] ?? "", 10) || args.stopDays;
      continue;
    }
    if (arg === "--start-gap-days" && argv[i + 1]) {
      args.startGapDays = Number.parseInt(argv[++i] ?? "", 10) || args.startGapDays;
      continue;
    }
    if (arg === "--min-replay-views" && argv[i + 1]) {
      args.minReplayViews = Number.parseInt(argv[++i] ?? "", 10) || args.minReplayViews;
      continue;
    }
    if (arg === "--min-historical-views" && argv[i + 1]) {
      args.minHistoricalViews = Number.parseInt(argv[++i] ?? "", 10) || args.minHistoricalViews;
      continue;
    }
    if (arg === "--min-corporate-score" && argv[i + 1]) {
      args.minCorporateScore = Number.parseInt(argv[++i] ?? "", 10) || args.minCorporateScore;
      continue;
    }
    if (arg === "--max-shortclips-per-category" && argv[i + 1]) {
      args.maxShortclipsPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.maxShortclipsPerCategory;
      continue;
    }
    if (arg === "--max-replays-per-category" && argv[i + 1]) {
      args.maxReplaysPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.maxReplaysPerCategory;
      continue;
    }
    if (arg === "--max-latest-clips-per-channel" && argv[i + 1]) {
      args.maxLatestClipsPerChannel =
        Number.parseInt(argv[++i] ?? "", 10) || args.maxLatestClipsPerChannel;
      continue;
    }
    if (arg === "--categories" && argv[i + 1]) {
      args.categoryCodes = String(argv[++i])
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
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
  node --import tsx scripts/naver-shoppinglive-opportunities.ts [options]

Options:
  --output <path>                   CSV output path
  --per-category <n>                Max rows per type within each category (default: 10)
  --stop-days <n>                   Days since latest shortclip to flag stopped (default: 7)
  --start-gap-days <n>              Reserved threshold for future stale-start logic (default: 14)
  --min-replay-views <n>            Minimum replay views for current opportunity signals (default: 2000)
  --min-historical-views <n>        Reserved threshold for shortclip-history scoring (default: 3000)
  --min-corporate-score <n>         Minimum corporate score (default: 4)
  --categories <codes>              Comma-separated category codes
  --headful                         Launch visible browser

This script finds:
  - stopped_suspect: brands with current replay activity but stale shortclip uploads
  - likely_to_start: brands with current replay activity and no detected shortclip history
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

function normalizeBrandKey(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
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

function parseShortclipAnchor(text: string) {
  const normalized = normalizeText(text);
  const match = normalized.match(/^숏클립\s*([0-9.,만천]+)?\s*시청?(.*)$/);
  return {
    views: parseKoreanCount(match?.[1] ?? ""),
    title: normalizeText(match?.[2] ?? normalized.replace(/^숏클립/, "")),
  };
}

function parseReplayAnchor(text: string) {
  const normalized = normalizeText(text);
  const match = normalized.match(/다시보기\s*([0-9.,만천]+)\s*시청(.*)$/);
  return {
    views: parseKoreanCount(match?.[1] ?? ""),
    title: normalizeText(match?.[2] ?? normalized),
  };
}

function decodeHtmlEscapes(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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

function toChannelShortclipUrl(rawChannelUrl: string, channelId: number): string {
  const normalized = normalizeText(rawChannelUrl).replace(/\/$/, "");
  if (normalized) {
    return normalized.endsWith("/shortclip") ? normalized : `${normalized}/shortclip`;
  }
  return `https://shoppinglive.naver.com/channels/${channelId}/shortclip`;
}

function daysBetweenNow(isoDate: string): number {
  const timestamp = Date.parse(isoDate);
  if (!Number.isFinite(timestamp)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
}

function computeCorporateSignal(params: {
  brandName: string;
  channelName?: string;
  titles?: string[];
  productName?: string;
  smartStore?: boolean;
}): CorporateSignal {
  const signals = new Set<string>();
  let score = 0;
  const brand = params.brandName.toLowerCase();
  const channel = (params.channelName ?? "").toLowerCase();
  const titles = (params.titles ?? []).join(" ").toLowerCase();
  const product = (params.productName ?? "").toLowerCase();
  let hasPositiveKeyword = false;

  if (params.smartStore) {
    score += 1;
    signals.add("smart_store");
  }
  if (brand && channel && (channel.includes(brand) || brand.includes(channel))) {
    score += 2;
    signals.add("brand_channel_match");
  }
  if (brand && product && product.includes(brand)) {
    score += 1;
    signals.add("brand_product_match");
  }

  for (const keyword of CORPORATE_POSITIVE_KEYWORDS) {
    if ([brand, channel, titles, product].some((value) => value.includes(keyword.toLowerCase()))) {
      score += 2;
      signals.add(`keyword:${keyword}`);
      hasPositiveKeyword = true;
      break;
    }
  }

  const marketplaceKeyword = MARKETPLACE_NEGATIVE_KEYWORDS.find((keyword) =>
    [brand, channel].some((value) => value.includes(keyword.toLowerCase())),
  );
  if (marketplaceKeyword && !hasPositiveKeyword) {
    score -= 3;
    signals.add(`marketplace:${marketplaceKeyword}`);
    return {
      score,
      sellerType: "marketplace_like",
      signals: [...signals],
    };
  }

  return {
    score,
    sellerType: score >= 2 ? "corporate_like" : "unclear",
    signals: [...signals],
  };
}

async function collectCategorySeeds(
  page: import("playwright-core").Page,
  category: CategorySpec,
  args: Args,
): Promise<{ shortclips: CategoryShortclipSeed[]; replays: CategoryReplaySeed[] }> {
  await page.goto(category.url, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);

  const shortclips = new Map<string, CategoryShortclipSeed>();
  const replays = new Map<string, CategoryReplaySeed>();

  for (let pass = 0; pass < 8; pass += 1) {
    const anchors = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map((anchor) => ({
        text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: anchor.href,
      })),
    );

    for (const anchor of anchors) {
      if (
        anchor.href.includes("view.shoppinglive.naver.com/shortclips/") &&
        anchor.text.startsWith("숏클립")
      ) {
        const parsed = parseShortclipAnchor(anchor.text);
        const clipUrl = canonicalUrl(anchor.href);
        if (!shortclips.has(clipUrl)) {
          shortclips.set(clipUrl, {
            categoryCode: category.code,
            categoryName: category.name,
            clipUrl,
            listViews: parsed.views,
            listTitle: parsed.title,
          });
        }
      }
      if (
        anchor.href.includes("view.shoppinglive.naver.com/replays/") &&
        anchor.text.includes("다시보기")
      ) {
        const parsed = parseReplayAnchor(anchor.text);
        const replayUrl = canonicalUrl(anchor.href);
        if (!replays.has(replayUrl)) {
          replays.set(replayUrl, {
            categoryCode: category.code,
            categoryName: category.name,
            replayUrl,
            listViews: parsed.views,
            listTitle: parsed.title,
          });
        }
      }
    }

    if (
      shortclips.size >= args.maxShortclipsPerCategory &&
      replays.size >= args.maxReplaysPerCategory
    ) {
      break;
    }
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(800);
  }

  return {
    shortclips: [...shortclips.values()].slice(0, args.maxShortclipsPerCategory),
    replays: [...replays.values()].slice(0, args.maxReplaysPerCategory),
  };
}

async function fetchShortclipDetail(
  page: import("playwright-core").Page,
  seed: CategoryShortclipSeed,
  args: Args,
): Promise<ShortclipDetail | null> {
  await page.goto(seed.clipUrl, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);
  const shortclipRaw = await page.evaluate(() => {
    const win = window as Window & { __shortclip?: string };
    return win.__shortclip ?? null;
  });
  if (!shortclipRaw) {
    return null;
  }
  try {
    const parsed = JSON.parse(decodeHtmlEscapes(shortclipRaw)) as {
      shortclipId: number;
      title: string;
      expectedExposeAt: string;
      channelId: number;
      channelName: string;
      channelLinkUrl: string;
      smartStore: boolean;
      categoryComponent?: { brandName?: string };
      products?: Array<{ name?: string; stock?: number }>;
    };
    const products =
      parsed.products?.map((product) => ({
        name: normalizeText(product.name ?? ""),
        stock: product.stock ?? 0,
      })) ?? [];
    const brandName =
      normalizeText(parsed.categoryComponent?.brandName ?? "") ||
      inferBrandFromProducts(products.map((product) => product.name));
    return {
      shortclipId: parsed.shortclipId,
      title: normalizeText(parsed.title || seed.listTitle),
      expectedExposeAt: parsed.expectedExposeAt,
      channelId: parsed.channelId,
      channelName: normalizeText(parsed.channelName),
      channelShortclipUrl: `https://shoppinglive.naver.com/channels/${parsed.channelId}/shortclip`,
      brandName,
      smartStore: parsed.smartStore,
      products,
    };
  } catch {
    return null;
  }
}

function inferBrandFromProducts(productNames: string[]): string {
  const first = normalizeText(productNames[0] ?? "");
  if (!first) {
    return "";
  }
  return first.split(" ").slice(0, 2).join(" ");
}

async function fetchLatestChannelHistory(
  page: import("playwright-core").Page,
  channelUrl: string,
  args: Args,
): Promise<ChannelClipHistory> {
  await page.goto(channelUrl, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);
  const sortButton = page.getByRole("button", { name: "추천순" });
  if ((await sortButton.count().catch(() => 0)) > 0) {
    await sortButton.click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);
    await page
      .getByText("최신순", { exact: true })
      .click({ timeout: 1500 })
      .catch(() => {});
    await page.waitForTimeout(500);
  }

  const bodyLines = await page.evaluate(() =>
    (document.body.innerText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean),
  );

  const totalClipCount = (() => {
    const line = bodyLines.find((item) => /^숏클립\s+\d+/.test(item));
    const match = line?.match(/^숏클립\s+(\d+)/);
    return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
  })();

  const seeds = new Map<string, { clipUrl: string; listViews: number }>();
  let stablePasses = 0;
  let previousSize = 0;

  for (let pass = 0; pass < 6; pass += 1) {
    const anchors = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'a[href*="view.shoppinglive.naver.com/shortclips/"]',
        ),
      ).map((anchor) => ({
        text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: anchor.href,
      })),
    );

    for (const anchor of anchors) {
      if (!anchor.text.startsWith("숏클립")) {
        continue;
      }
      const clipUrl = canonicalUrl(anchor.href);
      if (seeds.has(clipUrl)) {
        continue;
      }
      const parsed = parseShortclipAnchor(anchor.text);
      seeds.set(clipUrl, {
        clipUrl,
        listViews: parsed.views,
      });
      if (seeds.size >= args.maxLatestClipsPerChannel) {
        break;
      }
    }

    if (seeds.size >= args.maxLatestClipsPerChannel) {
      break;
    }
    if (seeds.size === previousSize) {
      stablePasses += 1;
      if (stablePasses >= 2) {
        break;
      }
    } else {
      previousSize = seeds.size;
      stablePasses = 0;
    }
    await page.mouse.wheel(0, 2500);
    await page.waitForTimeout(600);
  }

  const details: Array<{ clipUrl: string; listViews: number; detail: ShortclipDetail | null }> = [];
  for (const seed of seeds.values()) {
    const detail = await fetchShortclipDetail(
      page,
      {
        categoryCode: "",
        categoryName: "",
        clipUrl: seed.clipUrl,
        listViews: seed.listViews,
        listTitle: "",
      },
      args,
    );
    details.push({ clipUrl: seed.clipUrl, listViews: seed.listViews, detail });
  }

  return { totalClipCount, clips: details };
}

async function fetchReplayCandidate(
  page: import("playwright-core").Page,
  seed: CategoryReplaySeed,
  args: Args,
): Promise<ReplayCandidate | null> {
  await page.goto(seed.replayUrl, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);
  const replayId = extractReplayId(seed.replayUrl);
  if (!replayId) {
    return null;
  }
  const metadata = await page.evaluate(
    async ({ currentReplayId }) => {
      const slSessionId =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const response = await fetch(
        `https://apis.naver.com/live_commerce_web/viewer_api_web/v1/broadcast/${currentReplayId}?needTimeMachine=true&slSessionId=${slSessionId}`,
        { credentials: "include" },
      );
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as {
        id: number;
        nickname?: string;
        broadcastOwnerId?: number;
        broadcasterEndUrl?: string;
        shoppingProducts?: Array<{ name?: string }>;
      };
    },
    { currentReplayId: replayId },
  );
  const brandName = normalizeText(metadata?.nickname ?? "");
  const channelId = metadata?.broadcastOwnerId ?? 0;
  if (!brandName || !channelId) {
    return null;
  }
  const productNames =
    metadata?.shoppingProducts
      ?.map((product) => normalizeText(product.name ?? ""))
      .filter(Boolean) ?? [];
  const corporate = computeCorporateSignal({
    brandName,
    channelName: brandName,
    titles: [seed.listTitle],
    productName: productNames[0] ?? "",
    smartStore: true,
  });
  return {
    categoryCode: seed.categoryCode,
    categoryName: seed.categoryName,
    replayUrl: seed.replayUrl,
    replayId,
    listTitle: seed.listTitle,
    listViews: seed.listViews,
    brandName,
    channelId,
    channelName: brandName,
    channelShortclipUrl: toChannelShortclipUrl(metadata?.broadcasterEndUrl ?? "", channelId),
    productNames,
    corporate,
  };
}

function extractReplayId(replayUrl: string): number {
  const match = replayUrl.match(/\/replays\/(\d+)/);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

function mergeLatestHistory(
  target: BrandHistoryAggregate,
  history: ChannelClipHistory,
): BrandHistoryAggregate {
  const datedClips = history.clips
    .filter((item): item is { clipUrl: string; listViews: number; detail: ShortclipDetail } =>
      Boolean(item.detail),
    )
    .map((item) => item as { clipUrl: string; listViews: number; detail: ShortclipDetail })
    .toSorted(
      (left, right) =>
        Date.parse(right.detail.expectedExposeAt) - Date.parse(left.detail.expectedExposeAt),
    );
  const latest = datedClips[0]?.detail.expectedExposeAt;

  return {
    ...target,
    totalChannelClipCount: history.totalClipCount || history.clips.length,
    latestClipAt: latest,
    daysSinceLatestClip: latest ? daysBetweenNow(latest) : Number.POSITIVE_INFINITY,
    latestClipTitles: datedClips.slice(0, 3).map((item) => item.detail.title),
    latestClipUrls: datedClips.slice(0, 3).map((item) => item.clipUrl),
  };
}

function createReplayBrandHistory(replay: ReplayCandidate): BrandHistoryAggregate {
  return {
    categoryCode: replay.categoryCode,
    categoryName: replay.categoryName,
    brandName: replay.brandName,
    brandKey: normalizeBrandKey(replay.brandName),
    channelId: replay.channelId,
    channelName: replay.channelName,
    channelShortclipUrl: replay.channelShortclipUrl,
    corporate: replay.corporate,
    seenSeedClipCount: 0,
    seenSeedViews: 0,
    totalChannelClipCount: 0,
    latestClipTitles: [],
    latestClipUrls: [],
  };
}

function buildStoppedRows(
  replayCandidates: ReplayCandidate[],
  brandHistories: Map<string, BrandHistoryAggregate>,
  args: Args,
): OpportunityRow[] {
  const rows: OpportunityRow[] = [];
  const seen = new Set<string>();

  for (const replay of replayCandidates) {
    if (replay.corporate.sellerType !== "corporate_like") {
      continue;
    }
    if (replay.corporate.score < args.minCorporateScore) {
      continue;
    }
    if (replay.listViews < args.minReplayViews) {
      continue;
    }

    const brandKey = normalizeBrandKey(replay.brandName);
    const history = brandHistories.get(brandKey);
    const daysSinceLatest = history?.daysSinceLatestClip ?? Number.POSITIVE_INFINITY;
    if (!history || history.totalChannelClipCount === 0 || !Number.isFinite(daysSinceLatest)) {
      continue;
    }
    if (daysSinceLatest < args.stopDays) {
      continue;
    }

    const dedupeKey = `${replay.categoryCode}:${brandKey}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    rows.push({
      type: "stopped_suspect",
      category: replay.categoryName,
      brand_name: replay.brandName,
      corporate_score: replay.corporate.score,
      seller_type: replay.corporate.sellerType,
      latest_clip_at: history.latestClipAt ?? "",
      days_since_latest_clip: daysSinceLatest,
      historical_views: history.totalChannelClipCount,
      replay_views: replay.listViews,
      channel_name: history.channelName,
      reason: `최근 다시보기 조회수 ${replay.listViews}인데 채널 최신 숏클립이 ${daysSinceLatest}일 전이며, 확인된 숏클립은 ${history.totalChannelClipCount}건입니다.`,
      evidence_titles: [replay.listTitle, ...history.latestClipTitles].filter(Boolean).join(" | "),
      urls: [replay.replayUrl, ...history.latestClipUrls].filter(Boolean).join(" | "),
    });
  }

  return rows;
}

function buildStartRows(
  replayCandidates: ReplayCandidate[],
  brandHistories: Map<string, BrandHistoryAggregate>,
  args: Args,
): OpportunityRow[] {
  const rows: OpportunityRow[] = [];
  const seen = new Set<string>();

  for (const replay of replayCandidates) {
    if (replay.corporate.sellerType !== "corporate_like") {
      continue;
    }
    if (replay.corporate.score < args.minCorporateScore) {
      continue;
    }
    if (replay.listViews < args.minReplayViews) {
      continue;
    }

    const brandKey = normalizeBrandKey(replay.brandName);
    const history = brandHistories.get(brandKey);
    const totalChannelClipCount = history?.totalChannelClipCount ?? 0;
    const daysSinceLatest = history?.daysSinceLatestClip ?? Number.POSITIVE_INFINITY;
    if (totalChannelClipCount > 0) {
      continue;
    }

    const dedupeKey = `${replay.categoryCode}:${brandKey}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    rows.push({
      type: "likely_to_start",
      category: replay.categoryName,
      brand_name: replay.brandName,
      corporate_score: replay.corporate.score,
      seller_type: replay.corporate.sellerType,
      latest_clip_at: history?.latestClipAt ?? "",
      days_since_latest_clip: Number.isFinite(daysSinceLatest) ? daysSinceLatest : 9999,
      historical_views: totalChannelClipCount,
      replay_views: replay.listViews,
      channel_name: history?.channelName ?? replay.channelName,
      reason: `최근 다시보기 조회수 ${replay.listViews}인데 확인된 채널 숏클립 이력이 없습니다.`,
      evidence_titles: replay.listTitle,
      urls: replay.replayUrl,
    });
  }
  return rows;
}

function toCsv(rows: OpportunityRow[]): string {
  if (rows.length === 0) {
    return "";
  }
  const headers = Object.keys(rows[0]) as Array<keyof OpportunityRow>;
  const escaped = (value: string | number) => {
    const raw = String(value);
    if (!/[",\n]/.test(raw)) {
      return raw;
    }
    return `"${raw.replace(/"/g, '""')}"`;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escaped(row[header])).join(",")),
  ].join("\n");
}

function capRowsPerCategory(rows: OpportunityRow[], args: Args): OpportunityRow[] {
  const grouped = new Map<string, OpportunityRow[]>();
  for (const row of rows) {
    const key = `${row.type}:${row.category}`;
    const existing = grouped.get(key) ?? [];
    existing.push(row);
    grouped.set(key, existing);
  }

  const capped: OpportunityRow[] = [];
  for (const groupRows of grouped.values()) {
    capped.push(...groupRows.slice(0, args.perCategory));
  }
  return capped;
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const categories = CATEGORIES.filter((category) =>
    args.categoryCodes?.length ? args.categoryCodes.includes(category.code) : true,
  );

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
  const detailPage = await context.newPage();
  const channelPage = await context.newPage();
  const replayPage = await context.newPage();

  const allBrandHistories = new Map<string, BrandHistoryAggregate>();
  const allReplayCandidates: ReplayCandidate[] = [];
  const channelHistoryCache = new Map<string, ChannelClipHistory>();

  try {
    for (const category of categories) {
      const seeds = await collectCategorySeeds(listPage, category, args);
      let replayBrandCount = 0;

      for (const replaySeed of seeds.replays) {
        const replay = await fetchReplayCandidate(replayPage, replaySeed, args);
        if (replay) {
          allReplayCandidates.push(replay);
          replayBrandCount += 1;
          const brandKey = normalizeBrandKey(replay.brandName);
          const existing = allBrandHistories.get(brandKey) ?? createReplayBrandHistory(replay);
          let latestHistory = channelHistoryCache.get(replay.channelShortclipUrl);
          if (!latestHistory) {
            latestHistory = await fetchLatestChannelHistory(
              channelPage,
              replay.channelShortclipUrl,
              args,
            );
            channelHistoryCache.set(replay.channelShortclipUrl, latestHistory);
          }
          allBrandHistories.set(brandKey, mergeLatestHistory(existing, latestHistory));
        }
      }

      console.log(
        `${category.name}: shortclips=${seeds.shortclips.length} replays=${seeds.replays.length} replay_brands=${replayBrandCount}`,
      );
    }
  } finally {
    await replayPage.close().catch(() => {});
    await channelPage.close().catch(() => {});
    await detailPage.close().catch(() => {});
    await listPage.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  const brandHistoryArray = [...allBrandHistories.values()];
  const stoppedRows = buildStoppedRows(allReplayCandidates, allBrandHistories, args);
  const startRows = buildStartRows(allReplayCandidates, allBrandHistories, args);
  const rows = capRowsPerCategory(
    [...stoppedRows, ...startRows].toSorted((left, right) => {
      if (left.type !== right.type) {
        return left.type.localeCompare(right.type);
      }
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      if (right.replay_views !== left.replay_views) {
        return right.replay_views - left.replay_views;
      }
      return right.historical_views - left.historical_views;
    }),
    args,
  );

  const outputPath = path.resolve(args.outputPath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${toCsv(rows)}\n`, "utf8");

  const jsonPath = outputPath.replace(/\.csv$/i, ".json");
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        args,
        stoppedRows,
        startRows,
        brandHistoryArray,
        allReplayCandidates,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote opportunities to ${outputPath}`);
  console.log(`Wrote raw data to ${jsonPath}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

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
  minViews: number;
  minTotalViews: number;
  minStock: number;
  minCorporateScore: number;
  perCategory: number;
  maxClipsPerCategory: number;
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

type CategoryClipCandidate = {
  categoryCode: string;
  categoryName: string;
  clipUrl: string;
  clipTitleFromList: string;
  viewsFromList: number;
};

type ShortclipProduct = {
  name: string;
  price: number;
  discountRate: number;
  stock: number;
  categoryName?: string | null;
};

type ShortclipDetail = {
  shortclipId: number;
  title: string;
  channelName: string;
  channelLinkUrl?: string;
  brandName: string;
  categoryNames: string[];
  smartStore: boolean;
  productCount: number;
  products: ShortclipProduct[];
  clipUrl: string;
};

type BrandAggregate = {
  categoryCode: string;
  categoryName: string;
  brandName: string;
  channelNames: Set<string>;
  clipUrls: Set<string>;
  clipTitles: Set<string>;
  currentClipCount: number;
  maxViews: number;
  totalViews: number;
  productCountMax: number;
  representativeProduct?: string;
  representativePrice?: number;
  representativeStock?: number;
  smartStore: boolean;
  corporateScore: number;
  corporateSignals: string[];
  sellerType: "corporate_like" | "marketplace_like" | "unclear";
};

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

const CORPORATE_POSITIVE_KEYWORDS = [
  "공식",
  "직영",
  "본사",
  "코리아",
  "브랜드데이",
  "brand day",
  "labs",
  "lab",
  "코스메틱",
  "제약",
  "pharm",
  "바이오",
  "푸드",
  "식품",
  "유업",
  "테크",
  "전자",
  "산업",
  "컴퍼니",
  "company",
  "corp",
  "inc",
  "co.",
];

const MARKETPLACE_NEGATIVE_KEYWORDS = [
  "협력사",
  "마켓",
  "market",
  "스토어",
  "store",
  "셀렉트",
  "select",
  "잡화",
  "언니",
  "백억",
  "농수산",
  "상회",
  "쇼핑",
  "산지직송",
  "직송",
  "아울렛",
  "도매",
  "프리미엄푸드",
  "수프리미엄",
  "샵",
  "몰",
  "마트",
];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    outputPath: "tmp/naver-shoppinglive-shortlist.csv",
    minViews: 5,
    minTotalViews: 10,
    minStock: 500,
    minCorporateScore: 2,
    perCategory: 10,
    maxClipsPerCategory: 40,
    headful: false,
    timeoutMs: 20_000,
    settleMs: 1_500,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--output" && argv[i + 1]) {
      args.outputPath = argv[++i];
      continue;
    }
    if (arg === "--min-views" && argv[i + 1]) {
      args.minViews = Number.parseInt(argv[++i] ?? "", 10) || args.minViews;
      continue;
    }
    if (arg === "--min-total-views" && argv[i + 1]) {
      args.minTotalViews = Number.parseInt(argv[++i] ?? "", 10) || args.minTotalViews;
      continue;
    }
    if (arg === "--min-stock" && argv[i + 1]) {
      args.minStock = Number.parseInt(argv[++i] ?? "", 10) || args.minStock;
      continue;
    }
    if (arg === "--min-corporate-score" && argv[i + 1]) {
      args.minCorporateScore = Number.parseInt(argv[++i] ?? "", 10) || args.minCorporateScore;
      continue;
    }
    if (arg === "--per-category" && argv[i + 1]) {
      args.perCategory = Number.parseInt(argv[++i] ?? "", 10) || args.perCategory;
      continue;
    }
    if (arg === "--max-clips-per-category" && argv[i + 1]) {
      args.maxClipsPerCategory = Number.parseInt(argv[++i] ?? "", 10) || args.maxClipsPerCategory;
      continue;
    }
    if (arg === "--categories" && argv[i + 1]) {
      args.categoryCodes = String(argv[++i])
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
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
  node --import tsx scripts/naver-shoppinglive-shortlist.ts [options]

Options:
  --output <path>             CSV output path (default: tmp/naver-shoppinglive-shortlist.csv)
  --categories <codes>        Comma-separated category codes, e.g. dc:1,dc:2
  --min-views <n>             Minimum views for a single shortclip (default: 5)
  --min-total-views <n>       Minimum summed views per brand in a category (default: 10)
  --min-stock <n>             Minimum representative stock proxy (default: 500)
  --min-corporate-score <n>   Minimum corporate-likeness score (default: 2)
  --per-category <n>          Max shortlisted brands per category (default: 10)
  --max-clips-per-category<n> Max shortclips to inspect per category (default: 40)
  --headful                   Launch visible browser

Notes:
  - This script uses shoppinglive.naver.com, not search.shopping.naver.com.
  - Corporate filtering is heuristic based on brand/channel/title keywords.
  - Views are used as an activity proxy, not actual sales.
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

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEscapes(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripShortclipPrefix(text: string): { views: number; title: string } {
  const normalized = normalizeText(text);
  const match = normalized.match(/^숏클립\s*([0-9.,만천]+)?\s*시청?(.*)$/);
  if (match) {
    return {
      views: parseKoreanCount(match[1] ?? ""),
      title: normalizeText(match[2] ?? ""),
    };
  }
  const alt = normalized.match(/^숏클립(.*)$/);
  return {
    views: 0,
    title: normalizeText(alt?.[1] ?? normalized),
  };
}

function canonicalClipUrl(href: string): string {
  try {
    const parsed = new URL(href);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return href;
  }
}

async function collectCategoryClips(
  page: import("playwright-core").Page,
  category: CategorySpec,
  args: Args,
): Promise<CategoryClipCandidate[]> {
  await page.goto(category.url, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);
  await page
    .getByRole("link", { name: "숏클립" })
    .click({ timeout: 2_000 })
    .catch(() => {});
  await page.waitForTimeout(600);
  await page
    .getByRole("button", { name: "인기시청순" })
    .click({ timeout: 2_000 })
    .catch(() => {});
  await page.waitForTimeout(900);

  const seen = new Map<string, CategoryClipCandidate>();
  let stablePasses = 0;
  let previousSize = 0;

  for (let pass = 0; pass < 8; pass += 1) {
    const anchors = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'a[href*="view.shoppinglive.naver.com/shortclips/"]',
        ),
      ).map((anchor) => ({
        text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: anchor.href,
      }));
    });

    for (const anchor of anchors) {
      if (!anchor.text.startsWith("숏클립")) {
        continue;
      }
      const clipUrl = canonicalClipUrl(anchor.href);
      if (seen.has(clipUrl)) {
        continue;
      }
      const { views, title } = stripShortclipPrefix(anchor.text);
      seen.set(clipUrl, {
        categoryCode: category.code,
        categoryName: category.name,
        clipUrl,
        clipTitleFromList: title,
        viewsFromList: views,
      });
      if (seen.size >= args.maxClipsPerCategory) {
        break;
      }
    }

    if (seen.size >= args.maxClipsPerCategory) {
      break;
    }
    if (seen.size === previousSize) {
      stablePasses += 1;
      if (stablePasses >= 2) {
        break;
      }
    } else {
      stablePasses = 0;
      previousSize = seen.size;
    }
    await page.mouse.wheel(0, 3_200);
    await page.waitForTimeout(1_000);
  }

  return [...seen.values()];
}

async function fetchShortclipDetail(
  page: import("playwright-core").Page,
  candidate: CategoryClipCandidate,
  args: Args,
): Promise<ShortclipDetail | null> {
  await page.goto(candidate.clipUrl, { waitUntil: "domcontentloaded", timeout: args.timeoutMs });
  await page.waitForTimeout(args.settleMs);

  const shortclipRaw = await page.evaluate(() => {
    const viewer = window as Window & { __shortclip?: string };
    return viewer.__shortclip ?? null;
  });

  if (!shortclipRaw) {
    return null;
  }

  let parsed: {
    shortclipId: number;
    title?: string;
    channelName?: string;
    channelLinkUrl?: string;
    smartStore?: boolean;
    productCount?: number;
    products?: Array<{
      name?: string;
      price?: number;
      discountRate?: number;
      stock?: number;
      rightLayerCategoryName?: string | null;
    }>;
    categoryComponent?: {
      brandName?: string;
      categories?: Array<{ name?: string }>;
    };
  };

  try {
    parsed = JSON.parse(decodeHtmlEscapes(shortclipRaw));
  } catch {
    return null;
  }

  const products =
    parsed.products?.map((product) => ({
      name: product.name ?? "",
      price: product.price ?? 0,
      discountRate: product.discountRate ?? 0,
      stock: product.stock ?? 0,
      categoryName: product.rightLayerCategoryName ?? null,
    })) ?? [];

  const brandName =
    normalizeText(parsed.categoryComponent?.brandName ?? "") ||
    inferBrandFromProducts(products.map((product) => product.name));

  return {
    shortclipId: parsed.shortclipId,
    title: normalizeText(parsed.title ?? candidate.clipTitleFromList),
    channelName: normalizeText(parsed.channelName ?? ""),
    channelLinkUrl: parsed.channelLinkUrl,
    brandName,
    categoryNames:
      parsed.categoryComponent?.categories
        ?.map((item) => normalizeText(item.name ?? ""))
        .filter(Boolean) ?? [],
    smartStore: parsed.smartStore ?? false,
    productCount: parsed.productCount ?? products.length,
    products,
    clipUrl: candidate.clipUrl,
  };
}

function inferBrandFromProducts(productNames: string[]): string {
  const firstName = normalizeText(productNames[0] ?? "");
  if (!firstName) {
    return "";
  }
  const tokens = firstName.split(" ").filter(Boolean).slice(0, 2);
  return tokens.join(" ");
}

function aggregateByBrand(
  category: CategorySpec,
  candidates: CategoryClipCandidate[],
  details: Array<ShortclipDetail | null>,
): BrandAggregate[] {
  const aggregates = new Map<string, BrandAggregate>();

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const detail = details[i];
    if (!detail || !detail.brandName) {
      continue;
    }

    const brandKey = detail.brandName.toLowerCase();
    const existing = aggregates.get(brandKey) ?? {
      categoryCode: category.code,
      categoryName: category.name,
      brandName: detail.brandName,
      channelNames: new Set<string>(),
      clipUrls: new Set<string>(),
      clipTitles: new Set<string>(),
      currentClipCount: 0,
      maxViews: 0,
      totalViews: 0,
      productCountMax: 0,
      smartStore: detail.smartStore,
      corporateScore: 0,
      corporateSignals: [],
      sellerType: "unclear" as const,
    };

    existing.channelNames.add(detail.channelName);
    existing.clipUrls.add(detail.clipUrl);
    existing.clipTitles.add(detail.title);
    existing.currentClipCount += 1;
    existing.maxViews = Math.max(existing.maxViews, candidate.viewsFromList);
    existing.totalViews += candidate.viewsFromList;
    existing.productCountMax = Math.max(existing.productCountMax, detail.productCount);
    existing.smartStore = existing.smartStore || detail.smartStore;

    const firstProduct = detail.products[0];
    if (firstProduct) {
      existing.representativeProduct = existing.representativeProduct ?? firstProduct.name;
      existing.representativePrice = existing.representativePrice ?? firstProduct.price;
      existing.representativeStock = Math.max(
        existing.representativeStock ?? 0,
        firstProduct.stock,
      );
    }
    aggregates.set(brandKey, existing);
  }

  return [...aggregates.values()].map(applyCorporateHeuristics);
}

function shortlistBrands(brands: BrandAggregate[], args: Args): BrandAggregate[] {
  return brands
    .filter((brand) => brand.sellerType !== "marketplace_like")
    .filter((brand) => brand.corporateScore >= args.minCorporateScore)
    .filter(
      (brand) =>
        brand.maxViews >= args.minViews ||
        brand.totalViews >= args.minTotalViews ||
        (brand.representativeStock ?? 0) >= args.minStock,
    )
    .toSorted((left, right) => {
      if (right.totalViews !== left.totalViews) {
        return right.totalViews - left.totalViews;
      }
      if (right.maxViews !== left.maxViews) {
        return right.maxViews - left.maxViews;
      }
      if (right.currentClipCount !== left.currentClipCount) {
        return right.currentClipCount - left.currentClipCount;
      }
      return left.brandName.localeCompare(right.brandName, "ko");
    })
    .slice(0, args.perCategory);
}

function csvEscape(value: string | number | undefined): string {
  const raw = String(value ?? "");
  if (!/[",\n]/.test(raw)) {
    return raw;
  }
  return `"${raw.replace(/"/g, '""')}"`;
}

function toCsv(rows: Array<Record<string, string | number>>): string {
  if (rows.length === 0) {
    return "";
  }
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

function toOutputRow(brand: BrandAggregate): Record<string, string | number> {
  return {
    category: brand.categoryName,
    brand_name: brand.brandName,
    corporate_score: brand.corporateScore,
    seller_type: brand.sellerType,
    corporate_signals: brand.corporateSignals.join(" | "),
    total_views: brand.totalViews,
    max_views: brand.maxViews,
    clip_count: brand.currentClipCount,
    product_count_max: brand.productCountMax,
    representative_product: brand.representativeProduct ?? "",
    representative_price: brand.representativePrice ?? 0,
    representative_stock: brand.representativeStock ?? 0,
    smart_store: brand.smartStore ? "yes" : "no",
    channel_names: [...brand.channelNames].join(" | "),
    clip_titles: [...brand.clipTitles].slice(0, 3).join(" | "),
    clip_urls: [...brand.clipUrls].slice(0, 3).join(" | "),
  };
}

function serializeBrandAggregate(brand: BrandAggregate) {
  return {
    ...brand,
    channelNames: [...brand.channelNames],
    clipUrls: [...brand.clipUrls],
    clipTitles: [...brand.clipTitles],
  };
}

function applyCorporateHeuristics(brand: BrandAggregate): BrandAggregate {
  const signals = new Set<string>();
  let score = 0;
  const brandText = brand.brandName.toLowerCase();
  const channelText = [...brand.channelNames].join(" ").toLowerCase();
  const titleText = [...brand.clipTitles].join(" ").toLowerCase();
  const productText = (brand.representativeProduct ?? "").toLowerCase();
  let hasPositiveKeyword = false;

  if (brand.smartStore) {
    score += 1;
    signals.add("smart_store");
  }

  if (textsOverlap(brandText, channelText)) {
    score += 2;
    signals.add("brand_channel_match");
  }

  if (textsOverlap(brandText, productText)) {
    score += 1;
    signals.add("brand_product_match");
  }

  for (const keyword of CORPORATE_POSITIVE_KEYWORDS) {
    if ([brandText, channelText, titleText, productText].some((value) => value.includes(keyword))) {
      score += 2;
      signals.add(`keyword:${keyword}`);
      hasPositiveKeyword = true;
      break;
    }
  }

  if (brand.currentClipCount >= 2) {
    score += 1;
    signals.add("repeat_clips");
  }

  if ((brand.representativeStock ?? 0) >= 5_000) {
    score += 1;
    signals.add("large_stock");
  }

  let sellerType: BrandAggregate["sellerType"] = "unclear";
  const marketplaceKeyword = MARKETPLACE_NEGATIVE_KEYWORDS.find(
    (keyword) => channelText.includes(keyword) || brandText.includes(keyword),
  );
  if (marketplaceKeyword && !hasPositiveKeyword) {
    score -= 3;
    signals.add(`marketplace:${marketplaceKeyword}`);
    sellerType = "marketplace_like";
  } else if (score >= 2) {
    sellerType = "corporate_like";
  }

  return {
    ...brand,
    corporateScore: score,
    corporateSignals: [...signals],
    sellerType,
  };
}

function textsOverlap(left: string, right: string): boolean {
  if (!left || !right) {
    return false;
  }
  if (left === right) {
    return true;
  }
  if (left.length >= 2 && right.includes(left)) {
    return true;
  }
  if (right.length >= 2 && left.includes(right)) {
    return true;
  }
  return false;
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const categories = CATEGORIES.filter((category) =>
    args.categoryCodes && args.categoryCodes.length > 0
      ? args.categoryCodes.includes(category.code)
      : true,
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

  const categoryPage = await context.newPage();
  const detailPage = await context.newPage();
  const shortlisted: BrandAggregate[] = [];
  const rawCategoryData: Array<{
    category: CategorySpec;
    candidates: CategoryClipCandidate[];
    shortlisted: BrandAggregate[];
  }> = [];

  try {
    for (const category of categories) {
      const candidates = await collectCategoryClips(categoryPage, category, args);
      const details: Array<ShortclipDetail | null> = [];
      for (const candidate of candidates) {
        details.push(await fetchShortclipDetail(detailPage, candidate, args));
      }
      const aggregated = aggregateByBrand(category, candidates, details);
      const categoryShortlist = shortlistBrands(aggregated, args);
      shortlisted.push(...categoryShortlist);
      rawCategoryData.push({ category, candidates, shortlisted: categoryShortlist });
      console.log(
        `${category.name}: candidates=${candidates.length} shortlisted=${categoryShortlist.length}`,
      );
    }
  } finally {
    await detailPage.close().catch(() => {});
    await categoryPage.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  const outputPath = path.resolve(args.outputPath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${toCsv(shortlisted.map(toOutputRow))}\n`, "utf8");

  const jsonPath = outputPath.replace(/\.csv$/i, ".json");
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        filters: {
          minViews: args.minViews,
          minTotalViews: args.minTotalViews,
          minStock: args.minStock,
          minCorporateScore: args.minCorporateScore,
          perCategory: args.perCategory,
          maxClipsPerCategory: args.maxClipsPerCategory,
        },
        shortlisted: shortlisted.map(serializeBrandAggregate),
        rawCategoryData: rawCategoryData.map((entry) => ({
          category: entry.category,
          candidates: entry.candidates,
          shortlisted: entry.shortlisted.map(serializeBrandAggregate),
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote shortlist to ${outputPath}`);
  console.log(`Wrote raw data to ${jsonPath}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

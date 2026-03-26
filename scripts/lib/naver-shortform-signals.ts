export type SignalBucket = "current" | "historical";

export type SearchTask = {
  bucket: SignalBucket;
  label: string;
  query: string;
  url: string;
  allowedHosts?: string[];
  requireBrandMatch?: boolean;
};

export type PageScanResult = {
  brand: string;
  bucket: SignalBucket;
  label: string;
  query: string;
  url: string;
  finalUrl: string;
  title: string;
  statusCode: number | null;
  keywordCategories: string[];
  evidenceLines: string[];
  relevantLinks: string[];
  note: string;
};

export type BrandScanSummary = {
  brand: string;
  checkedAt: string;
  status:
    | "active_signal_present"
    | "stopped_suspect"
    | "stopped_suspect_strong"
    | "blocked_current_signal"
    | "no_clear_signal";
  confidence: "high" | "medium" | "low";
  currentScore: number;
  historicalScore: number;
  currentEvidenceCount: number;
  historicalEvidenceCount: number;
  currentSignals: string[];
  historicalSignals: string[];
  currentEvidence: string[];
  historicalEvidence: string[];
  currentLinks: string[];
  historicalLinks: string[];
  notes: string[];
};

const CURRENT_KEYWORDS = [
  { category: "clip", tokens: ["shortclip", "쇼핑라이브 클립", "쇼핑라이브 숏클립"] },
  { category: "shopping_live", tokens: ["쇼핑라이브", "shoppinglive.naver.com", "쇼핑라이브 홈"] },
] as const;

const HISTORICAL_KEYWORDS = [
  { category: "clip_history", tokens: ["shortclip", "쇼핑라이브 클립", "쇼핑라이브 숏클립"] },
  {
    category: "shopping_live_history",
    tokens: ["쇼핑라이브", "shoppinglive.naver.com", "쇼핑라이브 홈"],
  },
  { category: "connect_history", tokens: ["쇼핑 커넥트", "브랜드 커넥트", "brandconnect"] },
] as const;

const CATEGORY_WEIGHT: Record<string, number> = {
  clip: 3,
  clip_history: 3,
  creator_connect: 2,
  connect_history: 2,
  shopping_live: 3,
  shopping_live_history: 3,
  store_support: 1,
};

const SUPPORTIVE_HOST_PATTERNS = [
  "brandconnect.naver.com",
  "shopping.naver.com",
  "search.shopping.naver.com",
  "mkt.naver.com",
  "smartstore.naver.com",
];

const NOISE_PATTERNS = [
  "네이버 검색",
  "통합검색",
  "연관검색어",
  "자동완성",
  "지식in",
  "view",
  "이미지",
  "뉴스",
  "더보기",
  "바로가기",
  "검색어를 입력",
  "쇼핑 더보기",
  "추천순",
  "정확도순",
  "네이버쇼핑",
  "광고",
];

export type CsvRow = Record<string, string | number>;

export function buildSearchTasks(brand: string): SearchTask[] {
  const trimmed = brand.trim();
  if (!trimmed) {
    return [];
  }

  const webBase = "https://search.naver.com/search.naver?query=";
  const currentQueries = [
    {
      label: "current_naver_live",
      query: `${trimmed} site:shoppinglive.naver.com`,
      allowedHosts: ["shoppinglive.naver.com"],
    },
    {
      label: "current_naver_shortclip",
      query: `${trimmed} site:shoppinglive.naver.com/shortclip`,
      allowedHosts: ["shoppinglive.naver.com"],
    },
  ];
  const webQueries = [
    {
      label: "web_live_history",
      query: `${trimmed} site:shoppinglive.naver.com`,
      allowedHosts: ["shoppinglive.naver.com"],
      requireBrandMatch: true,
    },
    {
      label: "web_connect_history",
      query: `${trimmed} "쇼핑 커넥트"`,
      allowedHosts: ["brandconnect.naver.com", "blog.naver.com", "cafe.naver.com"],
      requireBrandMatch: true,
    },
  ];

  return [
    ...currentQueries.map((item) => ({
      bucket: "current" as const,
      label: item.label,
      query: item.query,
      url: `${webBase}${encodeURIComponent(item.query)}`,
      allowedHosts: item.allowedHosts,
      requireBrandMatch: true,
    })),
    ...webQueries.map((item) => ({
      bucket: "historical" as const,
      label: item.label,
      query: item.query,
      url: `${webBase}${encodeURIComponent(item.query)}`,
      allowedHosts: item.allowedHosts,
      requireBrandMatch: item.requireBrandMatch,
    })),
  ];
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

export function buildPageNote(scan: PageScanResult): string {
  if (scan.statusCode && scan.statusCode >= 400) {
    return `http_${scan.statusCode}`;
  }
  if (scan.evidenceLines.length === 0 && scan.relevantLinks.length === 0) {
    return "no_direct_signal";
  }
  return "signal_detected";
}

export function summarizeScan(
  params: Omit<PageScanResult, "keywordCategories" | "evidenceLines" | "relevantLinks" | "note"> & {
    lines: string[];
    links: Array<{ href: string; text: string }>;
    allowedHosts?: string[];
    requireBrandMatch?: boolean;
  },
): PageScanResult {
  const keywordTable = params.bucket === "current" ? CURRENT_KEYWORDS : HISTORICAL_KEYWORDS;
  const brand = extractBrandFromQuery(params.query);
  const keywordCategories = matchKeywordCategories(params.lines, params.links, keywordTable, {
    brand,
    allowedHosts: params.allowedHosts,
    requireBrandMatch: params.requireBrandMatch,
  });
  const evidenceLines = selectEvidenceLines(params.lines, keywordTable, params.query, {
    brand,
    requireBrandMatch: params.requireBrandMatch,
  });
  const relevantLinks = selectRelevantLinks(params.links, keywordTable, {
    brand,
    allowedHosts: params.allowedHosts,
    requireBrandMatch: params.requireBrandMatch,
  });
  const partial: PageScanResult = {
    ...params,
    keywordCategories,
    evidenceLines,
    relevantLinks,
    note: "",
  };
  return {
    ...partial,
    note: buildPageNote(partial),
  };
}

function matchKeywordCategories(
  lines: string[],
  links: Array<{ href: string; text: string }>,
  table: ReadonlyArray<{ category: string; tokens: readonly string[] }>,
  options: {
    brand: string;
    allowedHosts?: string[];
    requireBrandMatch?: boolean;
  },
): string[] {
  const haystacks = [
    ...lines
      .map((line) => normalizeText(line))
      .filter((line) => isSignalCandidate(line, options.brand, options.requireBrandMatch ?? false)),
    ...links.flatMap((link) => {
      if (!isAllowedHost(link.href, options.allowedHosts)) {
        return [];
      }
      const text = normalizeText(link.text);
      const href = normalizeText(link.href);
      const candidates = [text, href].filter((item) =>
        isSignalCandidate(item, options.brand, options.requireBrandMatch ?? false),
      );
      return candidates;
    }),
  ];
  return table
    .filter((entry) => entry.tokens.some((token) => haystacks.some((item) => item.includes(token))))
    .map((entry) => entry.category);
}

function selectEvidenceLines(
  lines: string[],
  table: ReadonlyArray<{ category: string; tokens: readonly string[] }>,
  query: string,
  options: {
    brand: string;
    requireBrandMatch?: boolean;
  },
): string[] {
  const normalizedQuery = normalizeText(query);
  const seen = new Set<string>();
  const matches: string[] = [];
  for (const line of lines) {
    const normalized = normalizeText(line);
    if (!normalized || normalized === normalizedQuery) {
      continue;
    }
    if (normalized.length < 6) {
      continue;
    }
    if (isNoiseLine(normalized)) {
      continue;
    }
    if (!isSignalCandidate(normalized, options.brand, options.requireBrandMatch ?? false)) {
      continue;
    }
    if (!table.some((entry) => entry.tokens.some((token) => normalized.includes(token)))) {
      continue;
    }
    if (isQueryEchoLine(normalized, normalizedQuery)) {
      continue;
    }
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    matches.push(line);
    if (matches.length >= 6) {
      break;
    }
  }
  return matches;
}

function selectRelevantLinks(
  links: Array<{ href: string; text: string }>,
  table: ReadonlyArray<{ category: string; tokens: readonly string[] }>,
  options: {
    brand: string;
    allowedHosts?: string[];
    requireBrandMatch?: boolean;
  },
): string[] {
  const seen = new Set<string>();
  const matches: string[] = [];
  for (const link of links) {
    const text = normalizeText(link.text);
    const href = normalizeText(link.href);
    const combined = `${text} ${href}`.trim();
    if (!combined) {
      continue;
    }
    if (isNoiseLine(combined)) {
      continue;
    }
    if (!isAllowedHost(link.href, options.allowedHosts)) {
      continue;
    }
    if (!isSignalCandidate(combined, options.brand, options.requireBrandMatch ?? false)) {
      continue;
    }
    const keywordMatch = table.some((entry) =>
      entry.tokens.some((token) => combined.includes(token)),
    );
    const hostMatch = SUPPORTIVE_HOST_PATTERNS.some((host) => href.includes(host));
    if (!keywordMatch && !hostMatch) {
      continue;
    }
    if (href.includes("search.naver.com/search.naver")) {
      continue;
    }
    if (seen.has(link.href)) {
      continue;
    }
    seen.add(link.href);
    matches.push(link.href);
    if (matches.length >= 6) {
      break;
    }
  }
  return matches;
}

export function summarizeBrand(
  brand: string,
  scans: PageScanResult[],
  checkedAt: string,
): BrandScanSummary {
  const current = scans.filter((scan) => scan.bucket === "current");
  const historical = scans.filter((scan) => scan.bucket === "historical");
  const currentBlocked = current.every(
    (scan) => scan.note.startsWith("http_") || scan.note.startsWith("error:"),
  );
  const currentCategories = unique(current.flatMap((scan) => scan.keywordCategories));
  const historicalCategories = unique(historical.flatMap((scan) => scan.keywordCategories));
  const currentEvidence = unique(current.flatMap((scan) => scan.evidenceLines));
  const historicalEvidence = unique(historical.flatMap((scan) => scan.evidenceLines));
  const currentLinks = unique(current.flatMap((scan) => scan.relevantLinks));
  const historicalLinks = unique(historical.flatMap((scan) => scan.relevantLinks));

  const currentScore = scoreBucket(currentCategories, currentEvidence.length, currentLinks.length);
  const historicalScore = scoreBucket(
    historicalCategories,
    historicalEvidence.length,
    historicalLinks.length,
  );

  const notes: string[] = [];
  if (historicalScore > 0 && currentScore === 0) {
    notes.push("과거 공개 흔적은 있지만 현재 직접 신호가 보이지 않음");
  }
  if (currentBlocked) {
    notes.push("현재 신호 조회는 네이버 보안 확인 또는 접근 제한 영향을 받음");
  }
  if (currentCategories.includes("store_support") && currentScore < 3) {
    notes.push("브랜드/공식 스토어 흔적만 있어 숏폼 집행 증거로는 약함");
  }
  if (historicalScore === 0 && currentScore === 0) {
    notes.push("한 번의 검색 결과 기준으로는 숏폼 증거를 찾지 못함");
  }

  const { status, confidence } = classifyBrandSignal({
    currentScore,
    historicalScore,
    currentCategories,
    historicalEvidenceCount: historicalEvidence.length,
    historicalLinkCount: historicalLinks.length,
    currentBlocked,
  });

  return {
    brand,
    checkedAt,
    status,
    confidence,
    currentScore,
    historicalScore,
    currentEvidenceCount: currentEvidence.length + currentLinks.length,
    historicalEvidenceCount: historicalEvidence.length + historicalLinks.length,
    currentSignals: currentCategories,
    historicalSignals: historicalCategories,
    currentEvidence,
    historicalEvidence,
    currentLinks,
    historicalLinks,
    notes,
  };
}

function scoreBucket(categories: string[], evidenceCount: number, linkCount: number): number {
  const categoryScore = categories.reduce(
    (sum, category) => sum + (CATEGORY_WEIGHT[category] ?? 1),
    0,
  );
  const evidenceBonus = Math.min(evidenceCount, 3);
  const linkBonus = Math.min(linkCount, 2);
  return categoryScore + evidenceBonus + linkBonus;
}

export function classifyBrandSignal(params: {
  currentScore: number;
  historicalScore: number;
  currentCategories: string[];
  historicalEvidenceCount?: number;
  historicalLinkCount?: number;
  currentBlocked?: boolean;
}): Pick<BrandScanSummary, "status" | "confidence"> {
  const hasCurrentDirectSignal = params.currentCategories.some((category) =>
    ["clip", "creator_connect", "shopping_live"].includes(category),
  );
  const hasHistoricalDirectEvidence =
    (params.historicalEvidenceCount ?? 0) > 0 && (params.historicalLinkCount ?? 0) > 0;

  if (params.currentBlocked) {
    if (hasCurrentDirectSignal) {
      return { status: "active_signal_present", confidence: "medium" };
    }
    return { status: "blocked_current_signal", confidence: "low" };
  }

  if (params.historicalScore >= 6 && params.currentScore === 0 && hasHistoricalDirectEvidence) {
    return { status: "stopped_suspect_strong", confidence: "high" };
  }
  if (
    params.historicalScore >= 4 &&
    params.currentScore <= 1 &&
    (params.historicalEvidenceCount ?? 0) > 0
  ) {
    return { status: "stopped_suspect", confidence: "medium" };
  }
  if (hasCurrentDirectSignal || params.currentScore >= 4) {
    return {
      status: "active_signal_present",
      confidence: hasCurrentDirectSignal ? "high" : "medium",
    };
  }
  return { status: "no_clear_signal", confidence: "low" };
}

export function summarizeForCsv(summary: BrandScanSummary): CsvRow {
  return {
    brand: summary.brand,
    checked_at: summary.checkedAt,
    status: summary.status,
    confidence: summary.confidence,
    current_score: summary.currentScore,
    historical_score: summary.historicalScore,
    current_signal_categories: summary.currentSignals.join(" | "),
    historical_signal_categories: summary.historicalSignals.join(" | "),
    current_evidence: summary.currentEvidence.join(" || "),
    historical_evidence: summary.historicalEvidence.join(" || "),
    current_links: summary.currentLinks.join(" | "),
    historical_links: summary.historicalLinks.join(" | "),
    notes: summary.notes.join(" | "),
  };
}

export function csvStringify(rows: CsvRow[]): string {
  if (rows.length === 0) {
    return "";
  }
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

function escapeCsvValue(value: string | number | undefined): string {
  const raw = String(value ?? "");
  if (!/[",\n]/.test(raw)) {
    return raw;
  }
  return `"${raw.replace(/"/g, '""')}"`;
}

export function parseBrandList(raw: string, brandColumn = "brand"): string[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }
  if (!trimmed.includes(",")) {
    const lines = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines[0]?.toLowerCase() === brandColumn.trim().toLowerCase()) {
      lines.shift();
    }
    return unique(lines);
  }

  const rows = parseCsv(trimmed);
  if (rows.length === 0) {
    return [];
  }
  const headers = rows[0].map((cell) => cell.trim().toLowerCase());
  const brandIndex = headers.indexOf(brandColumn.trim().toLowerCase());
  const targetIndex = brandIndex >= 0 ? brandIndex : 0;

  return unique(
    rows
      .slice(1)
      .map((row) => row[targetIndex]?.trim() ?? "")
      .filter(Boolean),
  );
}

function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const next = raw[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }
    current += char;
  }

  row.push(current);
  rows.push(row);
  return rows.filter((item) => item.some((cell) => cell.trim()));
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function isNoiseLine(value: string): boolean {
  return NOISE_PATTERNS.some((pattern) => value.includes(pattern));
}

function isQueryEchoLine(line: string, normalizedQuery: string): boolean {
  if (!normalizedQuery) {
    return false;
  }
  if (line === normalizedQuery) {
    return true;
  }
  if (line.startsWith(normalizedQuery) && line.length <= normalizedQuery.length + 12) {
    return true;
  }
  if (line.includes(normalizedQuery) && (line.includes(":") || line.includes("|"))) {
    return true;
  }
  return false;
}

function extractBrandFromQuery(query: string): string {
  const trimmed = query
    .replace(/site:[^\s]+/g, " ")
    .replace(/["']/g, " ")
    .replace(/\b(쇼핑라이브|쇼핑 커넥트|브랜드 커넥트|shortclip)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalizeText(trimmed);
}

function isAllowedHost(href: string, allowedHosts?: string[]): boolean {
  if (!allowedHosts || allowedHosts.length === 0) {
    return true;
  }
  const normalized = normalizeText(href);
  return allowedHosts.some((host) => normalized.includes(host.toLowerCase()));
}

function isSignalCandidate(value: string, brand: string, requireBrandMatch: boolean): boolean {
  if (!value) {
    return false;
  }
  if (!requireBrandMatch) {
    return true;
  }
  if (!brand) {
    return true;
  }
  return value.includes(brand);
}

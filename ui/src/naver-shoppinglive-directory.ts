import "./naver-shoppinglive-directory.css";

type DirectoryRow = {
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

type DirectoryPayload = {
  generatedAt?: string;
  rows: DirectoryRow[];
};

type CrawlHealth = {
  ok?: boolean;
  crawlEnabled?: boolean;
  running?: boolean;
  lastStartedAt?: string;
  lastFinishedAt?: string;
  lastError?: string;
  generatedAt?: string;
  rowCount?: number;
  totalCategories?: number;
  completedCategories?: number;
  currentCategoryCode?: string;
  currentCategoryName?: string;
  lastMessage?: string;
  activeTargetRowsPerCategory?: number;
  activeCategoryCodes?: string[];
  lastAddedRows?: number;
  lastCategoryResults?: Array<{
    categoryCode: string;
    categoryName: string;
    existingRows: number;
    replaySeeds: number;
    addedRows: number;
    targetRows: number;
    reason: string;
    noSourceCount: number;
    provisionalDuplicateCount: number;
    finalDuplicateCount: number;
    identityErrorCount: number;
  }>;
};

type FilterState = {
  query: string;
  category: string;
  missingOnly: boolean;
  collectionStatus: "all" | "done" | "pending";
  sort: "replay_desc" | "market_asc" | "crawled_desc";
};

type CrawlScope =
  | "all"
  | "dc:1"
  | "dc:2"
  | "dc:3"
  | "dc:4"
  | "dc:5"
  | "dc:6"
  | "dc:7"
  | "dc:8"
  | "dc:9";

const CRAWL_CATEGORY_OPTIONS: Array<{ code: CrawlScope; name: string }> = [
  { code: "all", name: "전체 카테고리" },
  { code: "dc:1", name: "뷰티" },
  { code: "dc:2", name: "푸드" },
  { code: "dc:3", name: "패션" },
  { code: "dc:4", name: "라이프" },
  { code: "dc:5", name: "여행/체험" },
  { code: "dc:6", name: "키즈" },
  { code: "dc:7", name: "테크" },
  { code: "dc:8", name: "취미레저" },
  { code: "dc:9", name: "문화생활" },
];

const BUNDLED_DATA_URL = "./data/naver-shoppinglive-seller-directory-latest.json";
const COLLECTION_STORAGE_KEY = "naver-shoppinglive-directory:completed";
const PAGE_SIZE_OPTIONS = [25, 50, 100];

const state = {
  payload: null as DirectoryPayload | null,
  filteredRows: [] as DirectoryRow[],
  pagedRows: [] as DirectoryRow[],
  categories: [] as string[],
  crawlHealth: null as CrawlHealth | null,
  crawlAvailable: false,
  crawlChecking: true,
  crawlSubmitting: false,
  resetSubmitting: false,
  crawlScope: "all" as CrawlScope,
  crawlTargetRowsPerCategory: 50,
  filters: {
    query: "",
    category: "all",
    missingOnly: false,
    collectionStatus: "all",
    sort: "replay_desc",
  } satisfies FilterState,
  sourceLabel: "번들 스냅샷",
  celebrateVisible: false,
  celebrateRunId: 0,
  pendingCompletionCelebrate: false,
  lastSeenFinishedAt: "",
  completedKeys: new Set<string>(),
  page: 1,
  pageSize: 25,
};

const dom = {
  app: document.querySelector<HTMLDivElement>("#app"),
};

let audioContext: AudioContext | null = null;
let celebrateTimer: number | null = null;

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatDateTime(value: string): string {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainderSeconds = safeSeconds % 60;
  if (minutes === 0) {
    return `${remainderSeconds}초`;
  }
  if (remainderSeconds === 0) {
    return `${minutes}분`;
  }
  return `${minutes}분 ${remainderSeconds}초`;
}

function buildRows(payload: DirectoryPayload): DirectoryRow[] {
  return [...payload.rows];
}

function buildRowKey(row: DirectoryRow): string {
  return [
    row.category,
    row.market_name,
    row.replay_url,
    row.store_url,
    row.profile_url,
    row.crawled_at,
  ].join("|");
}

function loadCompletedKeys() {
  try {
    const raw = window.localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as string[];
    state.completedKeys = new Set(parsed.filter(Boolean));
  } catch {
    state.completedKeys = new Set();
  }
}

function saveCompletedKeys() {
  window.localStorage.setItem(
    COLLECTION_STORAGE_KEY,
    JSON.stringify([...state.completedKeys.values()]),
  );
}

function isRowCompleted(row: DirectoryRow): boolean {
  return state.completedKeys.has(buildRowKey(row));
}

function toggleRowCompleted(row: DirectoryRow, checked: boolean) {
  const key = buildRowKey(row);
  if (checked) {
    state.completedKeys.add(key);
  } else {
    state.completedKeys.delete(key);
  }
  saveCompletedKeys();
  applyFilters();
}

function clampPage(page: number, totalPages: number): number {
  if (!totalPages) {
    return 1;
  }
  return Math.max(1, Math.min(page, totalPages));
}

function toCsv(rows: DirectoryRow[]): string {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]) as Array<keyof DirectoryRow>;
  const escapeValue = (value: string | number) => {
    const raw = String(value);
    if (!/[",\n]/.test(raw)) {
      return raw;
    }
    return `"${raw.replaceAll('"', '""')}"`;
  };

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(",")),
  ].join("\n");
}

function downloadCsvFile(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function applyFilters() {
  if (!state.payload) {
    state.filteredRows = [];
    state.pagedRows = [];
    render();
    return;
  }

  const query = normalizeText(state.filters.query).toLowerCase();
  let rows = buildRows(state.payload);

  if (state.filters.category !== "all") {
    rows = rows.filter((row) => row.category === state.filters.category);
  }

  if (query) {
    rows = rows.filter((row) =>
      [
        row.category,
        row.market_name,
        row.seller_name,
        row.business_name,
        row.shoppinglive_seller_name,
        row.replay_title,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  if (state.filters.missingOnly) {
    rows = rows.filter((row) => !row.seller_name || !row.business_name);
  }

  if (state.filters.collectionStatus !== "all") {
    rows = rows.filter((row) =>
      state.filters.collectionStatus === "done" ? isRowCompleted(row) : !isRowCompleted(row),
    );
  }

  rows.sort((left, right) => {
    if (state.filters.sort === "market_asc") {
      return left.market_name.localeCompare(right.market_name, "ko");
    }
    if (state.filters.sort === "crawled_desc") {
      return Date.parse(right.crawled_at) - Date.parse(left.crawled_at);
    }
    return right.replay_views - left.replay_views;
  });

  state.filteredRows = rows;
  const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.page = clampPage(state.page, totalPages);
  const startIndex = (state.page - 1) * state.pageSize;
  state.pagedRows = rows.slice(startIndex, startIndex + state.pageSize);
  render();
}

async function loadBundledData() {
  const response = await fetch(BUNDLED_DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load bundled data: ${response.status}`);
  }
  const payload = (await response.json()) as DirectoryPayload;
  setPayload(payload, "번들 스냅샷");
}

async function loadCrawlHealth() {
  const previousHealth = state.crawlHealth;
  try {
    const response = await fetch("./api/health", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`health ${response.status}`);
    }
    state.crawlHealth = (await response.json()) as CrawlHealth;
    state.crawlAvailable = Boolean(state.crawlHealth.crawlEnabled);
    maybeCelebrateCompletion(previousHealth, state.crawlHealth);
  } catch {
    state.crawlHealth = null;
    state.crawlAvailable = false;
  } finally {
    state.crawlChecking = false;
    render();
  }
}

async function startCrawl() {
  if (!state.crawlAvailable || state.crawlSubmitting) {
    return;
  }
  state.crawlSubmitting = true;
  state.pendingCompletionCelebrate = true;
  render();

  try {
    await ensureAudioReady();
    const response = await fetch("./api/crawl", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        categories: state.crawlScope === "all" ? [] : [state.crawlScope],
        targetRowsPerCategory: state.crawlTargetRowsPerCategory,
      }),
    });
    if (!response.ok) {
      throw new Error(`crawl ${response.status}`);
    }
    await loadCrawlHealth();
    pollCrawlUntilSettled();
  } catch {
    state.crawlHealth = {
      ...state.crawlHealth,
      lastError: "크롤링 요청에 실패했습니다.",
    };
  } finally {
    state.crawlSubmitting = false;
    render();
  }
}

async function resetDataSource() {
  if (state.resetSubmitting || state.crawlHealth?.running) {
    return;
  }
  const confirmed = window.confirm(
    "현재 누적된 크롤링 데이터와 수집 완료 체크를 초기화합니다. 계속할까요?",
  );
  if (!confirmed) {
    return;
  }

  state.resetSubmitting = true;
  render();
  try {
    const response = await fetch("./api/reset-data", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`reset ${response.status}`);
    }
    state.completedKeys = new Set();
    saveCompletedKeys();
    state.page = 1;
    await loadBundledData().catch(() => {
      setPayload({ rows: [] }, "번들 스냅샷");
    });
    await loadCrawlHealth();
  } catch {
    state.crawlHealth = {
      ...state.crawlHealth,
      lastError: "데이터 소스 초기화에 실패했습니다.",
    };
  } finally {
    state.resetSubmitting = false;
    render();
  }
}

function pollCrawlUntilSettled() {
  const tick = async () => {
    await loadCrawlHealth();
    if (state.crawlHealth?.running) {
      window.setTimeout(() => {
        void tick();
      }, 2_500);
      return;
    }
    await loadBundledData().catch(() => undefined);
  };
  void tick();
}

async function ensureAudioReady() {
  const AudioCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) {
    return;
  }
  if (!audioContext) {
    audioContext = new AudioCtor();
  }
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

function playCompletionSound() {
  if (!audioContext || audioContext.state !== "running") {
    return;
  }

  const now = audioContext.currentTime;
  const notes = [659.25, 783.99, 987.77];
  for (const [index, frequency] of notes.entries()) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + index * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.14 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.22);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + index * 0.14);
    oscillator.stop(now + index * 0.14 + 0.24);
  }
}

function triggerCelebration() {
  state.celebrateRunId += 1;
  state.celebrateVisible = true;
  playCompletionSound();
  if (celebrateTimer != null) {
    window.clearTimeout(celebrateTimer);
  }
  celebrateTimer = window.setTimeout(() => {
    state.celebrateVisible = false;
    render();
  }, 3200);
  render();
}

function maybeCelebrateCompletion(
  previousHealth: CrawlHealth | null,
  nextHealth: CrawlHealth | null,
) {
  const nextFinishedAt = nextHealth?.lastFinishedAt ?? "";
  const previousRunning = Boolean(previousHealth?.running);
  const nextRunning = Boolean(nextHealth?.running);
  const completedNow =
    state.pendingCompletionCelebrate &&
    !!nextFinishedAt &&
    nextFinishedAt !== state.lastSeenFinishedAt &&
    (previousRunning || (!nextRunning && previousHealth?.lastFinishedAt !== nextFinishedAt));

  state.lastSeenFinishedAt = nextFinishedAt || state.lastSeenFinishedAt;
  if (!completedNow) {
    return;
  }

  state.pendingCompletionCelebrate = false;
  triggerCelebration();
}

function exportFilteredRows() {
  if (!state.filteredRows.length) {
    return;
  }
  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  downloadCsvFile(`naver-shoppinglive-seller-directory-${stamp}.csv`, toCsv(state.filteredRows));
}

function exportAllRows() {
  if (!state.payload?.rows.length) {
    return;
  }
  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  downloadCsvFile(
    `naver-shoppinglive-seller-directory-all-${stamp}.csv`,
    toCsv(state.payload.rows),
  );
}

function setPayload(payload: DirectoryPayload, sourceLabel: string) {
  state.payload = payload;
  state.categories = [...new Set(payload.rows.map((row) => row.category))].toSorted((a, b) =>
    a.localeCompare(b, "ko"),
  );
  state.sourceLabel = sourceLabel;
  applyFilters();
}

async function handleFileChange(event: Event) {
  const input = event.currentTarget as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) {
    return;
  }
  const text = await file.text();
  const payload = JSON.parse(text) as DirectoryPayload;
  setPayload(payload, `업로드: ${file.name}`);
  if (input) {
    input.value = "";
  }
}

function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
  state.filters[key] = value;
  state.page = 1;
  applyFilters();
}

function getSummary() {
  const rows = state.payload?.rows ?? [];
  return {
    total: rows.length,
    categories: new Set(rows.map((row) => row.category)).size,
    missing: rows.filter((row) => !row.seller_name || !row.business_name).length,
    completed: rows.filter((row) => isRowCompleted(row)).length,
    lastAddedRows: state.crawlHealth?.lastAddedRows ?? 0,
    generatedAt: state.payload?.generatedAt ?? rows[0]?.crawled_at ?? "",
  };
}

function crawlStatusText() {
  if (state.crawlChecking) {
    return "크롤링 API 확인 중";
  }
  if (!state.crawlAvailable) {
    return "정적 공개본에서는 크롤링 실행이 비활성화됩니다. 로컬 실행기에서 연 페이지에서만 사용할 수 있습니다.";
  }
  if (state.crawlHealth?.running) {
    const completed = state.crawlHealth.completedCategories ?? 0;
    const total = state.crawlHealth.totalCategories ?? 0;
    const category = state.crawlHealth.currentCategoryName
      ? ` · ${state.crawlHealth.currentCategoryName}`
      : "";
    const message = state.crawlHealth.lastMessage ? ` · ${state.crawlHealth.lastMessage}` : "";
    return `크롤링 실행 중 ${completed}/${total}${category}${message}`;
  }
  if (state.crawlHealth?.lastError) {
    return `최근 오류 · ${state.crawlHealth.lastError}`;
  }
  if (state.crawlHealth?.lastFinishedAt) {
    const added =
      typeof state.crawlHealth.lastAddedRows === "number"
        ? ` · 이번 실행 신규 ${formatNumber(state.crawlHealth.lastAddedRows)}행`
        : "";
    return `마지막 실행 완료 · ${formatDateTime(state.crawlHealth.lastFinishedAt)}${added}`;
  }
  return "크롤링 준비 완료";
}

function crawlProgressRatio(): number {
  const total = state.crawlHealth?.totalCategories ?? 0;
  const completed = state.crawlHealth?.completedCategories ?? 0;
  if (!total) {
    return 0;
  }
  return Math.max(0, Math.min(1, completed / total));
}

function getSelectedCategoryCodes(): string[] {
  if (state.crawlScope === "all") {
    return CRAWL_CATEGORY_OPTIONS.filter((option) => option.code !== "all").map(
      (option) => option.code,
    );
  }
  return [state.crawlScope];
}

function categoryNameFromCode(code: string): string {
  return CRAWL_CATEGORY_OPTIONS.find((option) => option.code === code)?.name ?? code;
}

function getCategoryRowCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  const codeByName = new Map(
    CRAWL_CATEGORY_OPTIONS.filter((option) => option.code !== "all").map((option) => [
      option.name,
      option.code,
    ]),
  );
  for (const row of state.payload?.rows ?? []) {
    const code = codeByName.get(row.category);
    if (!code) {
      continue;
    }
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return counts;
}

function getActiveTargetRowsPerCategory(): number {
  return state.crawlHealth?.running
    ? Math.max(1, state.crawlHealth.activeTargetRowsPerCategory ?? state.crawlTargetRowsPerCategory)
    : state.crawlTargetRowsPerCategory;
}

function estimateCrawlSeconds(): number {
  const categoryCounts = getCategoryRowCounts();
  const selectedCategoryCodes =
    state.crawlHealth?.running && state.crawlHealth.activeCategoryCodes?.length
      ? state.crawlHealth.activeCategoryCodes
      : getSelectedCategoryCodes();
  const targetRowsPerCategory = getActiveTargetRowsPerCategory();
  const pendingRows = selectedCategoryCodes.reduce((sum, code) => {
    const existing = categoryCounts.get(code) ?? 0;
    return sum + Math.max(0, targetRowsPerCategory - existing);
  }, 0);
  return selectedCategoryCodes.length * 12 + pendingRows * 5;
}

function estimateRemainingSeconds(): number {
  const totalEstimate = estimateCrawlSeconds();
  if (!state.crawlHealth?.running) {
    return totalEstimate;
  }
  const totalCategories = state.crawlHealth.totalCategories ?? 0;
  const completedCategories = state.crawlHealth.completedCategories ?? 0;
  if (!totalCategories) {
    return totalEstimate;
  }
  const remainingRatio = Math.max(0, 1 - completedCategories / totalCategories);
  return totalEstimate * remainingRatio;
}

function crawlEtaText(): string {
  const selectedCategoryCodes =
    state.crawlHealth?.running && state.crawlHealth.activeCategoryCodes?.length
      ? state.crawlHealth.activeCategoryCodes
      : getSelectedCategoryCodes();
  if (!selectedCategoryCodes.length) {
    return "예상 소요 시간 계산 중";
  }
  const seconds = state.crawlHealth?.running ? estimateRemainingSeconds() : estimateCrawlSeconds();
  const prefix = state.crawlHealth?.running ? "예상 잔여 시간" : "예상 소요 시간";
  return `${prefix} · ${formatDuration(seconds)}`;
}

function crawlPlanText(): string {
  const categoryCodes =
    state.crawlHealth?.running && state.crawlHealth.activeCategoryCodes?.length
      ? state.crawlHealth.activeCategoryCodes
      : getSelectedCategoryCodes();
  const scope =
    categoryCodes.length === CRAWL_CATEGORY_OPTIONS.length - 1
      ? "전체 카테고리"
      : categoryCodes.map((code) => categoryNameFromCode(code)).join(", ");
  return `크롤링 계획 · ${scope} · 카테고리당 ${formatNumber(getActiveTargetRowsPerCategory())}개`;
}

function render() {
  if (!dom.app) {
    return;
  }

  const summary = getSummary();
  const rows = state.pagedRows;
  const filteredCount = state.filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / state.pageSize));
  const pageStart = filteredCount ? (state.page - 1) * state.pageSize + 1 : 0;
  const pageEnd = filteredCount ? Math.min(filteredCount, state.page * state.pageSize) : 0;
  const lastCategoryResults = state.crawlHealth?.lastCategoryResults ?? [];
  const celebrationPieces = Array.from({ length: 18 }, (_, index) => {
    const left = (index * 91) % 100;
    const delay = ((index % 6) * 0.06).toFixed(2);
    const duration = (1.6 + (index % 5) * 0.18).toFixed(2);
    const hueClass = ["accent", "warm", "ink"][index % 3];
    return `<span class="seller-confetti seller-confetti-${hueClass}" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s"></span>`;
  }).join("");

  dom.app.innerHTML = `
    <div class="seller-shell">
      ${
        state.celebrateVisible
          ? `
            <div class="seller-celebrate-layer" data-run="${state.celebrateRunId}">
              <div class="seller-celebrate-glow"></div>
              <div class="seller-celebrate-badge">
                <strong>크롤링 완료</strong>
                <span>최신 결과를 반영했습니다.</span>
              </div>
              <div class="seller-confetti-field">${celebrationPieces}</div>
            </div>
          `
          : ""
      }
      <section class="seller-hero">
        <div class="seller-kicker">Naver Shopping Live Directory</div>
        <h1 class="seller-title">네이버 쇼핑라이브 셀러 디렉터리</h1>
        <p class="seller-subtitle">
          카테고리별 셀러 결과를 공용으로 탐색하는 정적 페이지입니다. 최신 번들 스냅샷을 바로 읽고,
          필요하면 JSON 파일을 업로드해서 같은 화면에서 검토할 수 있습니다.
        </p>
        <div class="seller-actions">
          <button class="seller-button" data-action="reload" data-tone="accent">번들 다시 불러오기</button>
          <button class="seller-button" data-action="reset-data"${state.crawlHealth?.running || state.resetSubmitting ? " disabled" : ""}>
            ${state.resetSubmitting ? "초기화 중" : "데이터 소스 초기화"}
          </button>
          <div class="seller-crawl-controls">
            <select id="seller-crawl-scope" class="seller-select seller-crawl-select"${state.crawlAvailable ? "" : " disabled"}>
              ${CRAWL_CATEGORY_OPTIONS.map(
                (option) =>
                  `<option value="${option.code}"${state.crawlScope === option.code ? " selected" : ""}>${escapeHtml(option.name)}</option>`,
              ).join("")}
            </select>
          </div>
          <div class="seller-crawl-controls">
            <input
              id="seller-crawl-target"
              class="seller-input seller-crawl-target"
              type="number"
              min="1"
              max="200"
              step="1"
              value="${escapeHtml(String(state.crawlTargetRowsPerCategory))}"
              ${state.crawlAvailable && !state.crawlHealth?.running ? "" : " disabled"}
            />
          </div>
          <button class="seller-button" data-action="crawl"${state.crawlAvailable && !state.crawlHealth?.running && !state.crawlSubmitting ? "" : " disabled"}>
            ${state.crawlHealth?.running ? "크롤링 실행 중" : state.crawlSubmitting ? "요청 중" : "크롤링 실행"}
          </button>
          <button class="seller-button" data-action="csv-all"${state.payload?.rows.length ? "" : " disabled"}>
            전체 CSV 저장
          </button>
          <button class="seller-button" data-action="csv"${state.filteredRows.length ? "" : " disabled"}>
            현재 필터 CSV 저장
          </button>
          <label class="seller-file-label">
            JSON 업로드
            <input type="file" accept=".json,application/json" data-action="upload" />
          </label>
        </div>
        <div class="seller-status-strip">${escapeHtml(crawlStatusText())}</div>
        <div class="seller-status-strip seller-status-secondary">
          ${escapeHtml(crawlPlanText())}
          · ${escapeHtml(crawlEtaText())}
        </div>
        <div class="seller-progress-track">
          <div class="seller-progress-bar" style="width:${Math.round(crawlProgressRatio() * 100)}%"></div>
        </div>
        ${
          lastCategoryResults.length
            ? `
              <section class="seller-panel seller-run-summary">
                <div class="seller-run-summary-head">이번 실행 결과</div>
                <div class="seller-run-summary-list">
                  ${lastCategoryResults
                    .map(
                      (result) => `
                        <article class="seller-run-item">
                          <strong>${escapeHtml(result.categoryName)}</strong>
                          <span>${escapeHtml(result.reason)}</span>
                          <span>신규 ${formatNumber(result.addedRows)}행 · 기존 ${formatNumber(result.existingRows)}행 · 시드 ${formatNumber(result.replaySeeds)}개</span>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              </section>
            `
            : ""
        }
      </section>

      <section class="seller-grid">
        <div class="seller-stats">
          <article class="seller-stat">
            <span class="seller-stat-label">총 행 수</span>
            <strong class="seller-stat-value">${formatNumber(summary.total)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">카테고리 수</span>
            <strong class="seller-stat-value">${formatNumber(summary.categories)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">정보 미완성 행</span>
            <strong class="seller-stat-value">${formatNumber(summary.missing)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">수집 완료 체크</span>
            <strong class="seller-stat-value">${formatNumber(summary.completed)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">이번 실행 신규 행</span>
            <strong class="seller-stat-value">${formatNumber(summary.lastAddedRows)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">기준 시각</span>
            <strong class="seller-stat-value" style="font-size:1rem;">${formatDateTime(summary.generatedAt)}</strong>
          </article>
        </div>

        <section class="seller-panel seller-filter-shell">
          <div class="seller-filters">
            <div class="seller-field">
              <label for="seller-query">검색</label>
              <input id="seller-query" class="seller-input" type="search" placeholder="마켓 이름, 판매자 이름, 상호명, 방송 제목" value="${escapeHtml(state.filters.query)}" />
            </div>
            <div class="seller-field">
              <label for="seller-category">카테고리</label>
              <select id="seller-category" class="seller-select">
                <option value="all"${state.filters.category === "all" ? " selected" : ""}>전체</option>
                ${state.categories
                  .map(
                    (category) =>
                      `<option value="${escapeHtml(category)}"${state.filters.category === category ? " selected" : ""}>${escapeHtml(category)}</option>`,
                  )
                  .join("")}
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-sort">정렬</label>
              <select id="seller-sort" class="seller-select">
                <option value="replay_desc"${state.filters.sort === "replay_desc" ? " selected" : ""}>조회수 높은순</option>
                <option value="market_asc"${state.filters.sort === "market_asc" ? " selected" : ""}>마켓 이름순</option>
                <option value="crawled_desc"${state.filters.sort === "crawled_desc" ? " selected" : ""}>크롤링 최신순</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-missing">정보 필터</label>
              <select id="seller-missing" class="seller-select">
                <option value="all"${state.filters.missingOnly ? "" : " selected"}>전체</option>
                <option value="missing"${state.filters.missingOnly ? " selected" : ""}>빈 정보만</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-collection-status">수집 체크</label>
              <select id="seller-collection-status" class="seller-select">
                <option value="all"${state.filters.collectionStatus === "all" ? " selected" : ""}>전체</option>
                <option value="done"${state.filters.collectionStatus === "done" ? " selected" : ""}>완료만</option>
                <option value="pending"${state.filters.collectionStatus === "pending" ? " selected" : ""}>미완료만</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-page-size">페이지 크기</label>
              <select id="seller-page-size" class="seller-select">
                ${PAGE_SIZE_OPTIONS.map(
                  (size) =>
                    `<option value="${size}"${state.pageSize === size ? " selected" : ""}>${size}행</option>`,
                ).join("")}
              </select>
            </div>
          </div>
        </section>

        <section class="seller-panel seller-table-shell">
          <div class="seller-table-meta">
            <div class="seller-meta-note">데이터 소스: ${escapeHtml(state.sourceLabel)}</div>
            <div class="seller-badge">현재 ${formatNumber(pageStart)}-${formatNumber(pageEnd)} / ${formatNumber(filteredCount)}행</div>
          </div>
          <div class="seller-pagination">
            <button class="seller-button seller-page-button" data-action="page-prev"${state.page <= 1 ? " disabled" : ""}>이전</button>
            <div class="seller-page-label">페이지 ${formatNumber(state.page)} / ${formatNumber(totalPages)}</div>
            <button class="seller-button seller-page-button" data-action="page-next"${state.page >= totalPages ? " disabled" : ""}>다음</button>
          </div>
          <div class="seller-table-wrap">
            <table class="seller-table">
              <thead>
                <tr>
                  <th>수집 완료</th>
                  <th>카테고리</th>
                  <th>마켓 이름</th>
                  <th>판매자 이름</th>
                  <th>상호명</th>
                  <th>쇼핑라이브 이름</th>
                  <th>조회수</th>
                  <th>크롤링 시각</th>
                  <th>링크</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rows.length
                    ? rows
                        .map(
                          (row) => `
                            <tr>
                              <td>
                                <input class="seller-row-check" type="checkbox" data-action="toggle-row" data-row-key="${escapeHtml(buildRowKey(row))}"${isRowCompleted(row) ? " checked" : ""} />
                              </td>
                              <td>${escapeHtml(row.category)}</td>
                              <td>${escapeHtml(row.market_name)}</td>
                              <td>${row.seller_name ? escapeHtml(row.seller_name) : '<span class="seller-missing">없음</span>'}</td>
                              <td>${row.business_name ? escapeHtml(row.business_name) : '<span class="seller-missing">없음</span>'}</td>
                              <td>${escapeHtml(row.shoppinglive_seller_name)}</td>
                              <td>${formatNumber(row.replay_views)}</td>
                              <td>${escapeHtml(formatDateTime(row.crawled_at))}</td>
                              <td>
                                ${row.replay_url ? `<a class="seller-link" href="${escapeHtml(row.replay_url)}" target="_blank" rel="noreferrer">방송</a>` : ""}
                                ${row.store_url ? ` · <a class="seller-link" href="${escapeHtml(row.store_url)}" target="_blank" rel="noreferrer">스토어</a>` : ""}
                                ${row.profile_url ? ` · <a class="seller-link" href="${escapeHtml(row.profile_url)}" target="_blank" rel="noreferrer">프로필</a>` : ""}
                              </td>
                            </tr>
                          `,
                        )
                        .join("")
                    : `<tr><td colspan="9">표시할 데이터가 없습니다.</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </section>

        <div class="seller-foot">
          GitHub Pages 공개본은 조회 전용입니다. 로컬 실행기로 연 페이지에서는 크롤링 실행과 CSV 저장이 가능합니다.
        </div>
      </section>
    </div>
  `;

  dom.app
    .querySelector<HTMLButtonElement>('[data-action="reload"]')
    ?.addEventListener("click", () => {
      void loadBundledData();
    });
  dom.app
    .querySelector<HTMLButtonElement>('[data-action="reset-data"]')
    ?.addEventListener("click", () => {
      void resetDataSource();
    });
  dom.app
    .querySelector<HTMLInputElement>('[data-action="upload"]')
    ?.addEventListener("change", (event) => {
      void handleFileChange(event);
    });
  dom.app
    .querySelector<HTMLButtonElement>('[data-action="crawl"]')
    ?.addEventListener("click", () => {
      void startCrawl();
    });
  dom.app
    .querySelector<HTMLButtonElement>('[data-action="csv-all"]')
    ?.addEventListener("click", () => {
      exportAllRows();
    });
  dom.app.querySelector<HTMLButtonElement>('[data-action="csv"]')?.addEventListener("click", () => {
    exportFilteredRows();
  });
  dom.app
    .querySelector<HTMLSelectElement>("#seller-crawl-scope")
    ?.addEventListener("change", (event) => {
      state.crawlScope = (event.currentTarget as HTMLSelectElement).value as CrawlScope;
      render();
    });
  dom.app
    .querySelector<HTMLInputElement>("#seller-crawl-target")
    ?.addEventListener("change", (event) => {
      const value = Number.parseInt((event.currentTarget as HTMLInputElement).value, 10) || 50;
      state.crawlTargetRowsPerCategory = Math.max(1, Math.min(200, value));
      render();
    });
  dom.app.querySelector<HTMLInputElement>("#seller-query")?.addEventListener("input", (event) => {
    updateFilter("query", (event.currentTarget as HTMLInputElement).value);
  });
  dom.app
    .querySelector<HTMLSelectElement>("#seller-category")
    ?.addEventListener("change", (event) => {
      updateFilter("category", (event.currentTarget as HTMLSelectElement).value);
    });
  dom.app.querySelector<HTMLSelectElement>("#seller-sort")?.addEventListener("change", (event) => {
    updateFilter("sort", (event.currentTarget as HTMLSelectElement).value as FilterState["sort"]);
  });
  dom.app
    .querySelector<HTMLSelectElement>("#seller-missing")
    ?.addEventListener("change", (event) => {
      updateFilter("missingOnly", (event.currentTarget as HTMLSelectElement).value === "missing");
    });
  dom.app
    .querySelector<HTMLSelectElement>("#seller-collection-status")
    ?.addEventListener("change", (event) => {
      updateFilter(
        "collectionStatus",
        (event.currentTarget as HTMLSelectElement).value as FilterState["collectionStatus"],
      );
    });
  dom.app
    .querySelector<HTMLSelectElement>("#seller-page-size")
    ?.addEventListener("change", (event) => {
      state.pageSize = Number.parseInt((event.currentTarget as HTMLSelectElement).value, 10) || 25;
      state.page = 1;
      applyFilters();
    });
  dom.app
    .querySelector<HTMLButtonElement>('[data-action="page-prev"]')
    ?.addEventListener("click", () => {
      state.page = Math.max(1, state.page - 1);
      applyFilters();
    });
  dom.app
    .querySelector<HTMLButtonElement>('[data-action="page-next"]')
    ?.addEventListener("click", () => {
      state.page = Math.min(totalPages, state.page + 1);
      applyFilters();
    });
  dom.app.querySelectorAll<HTMLInputElement>('[data-action="toggle-row"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const input = event.currentTarget as HTMLInputElement;
      const key = input.dataset.rowKey ?? "";
      const row = state.payload?.rows.find((candidate) => buildRowKey(candidate) === key);
      if (!row) {
        return;
      }
      toggleRowCompleted(row, input.checked);
    });
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

loadCompletedKeys();

void loadBundledData()
  .catch(() => {
    setPayload({ rows: [] }, "번들 없음");
  })
  .finally(() => {
    render();
  });

void loadCrawlHealth();

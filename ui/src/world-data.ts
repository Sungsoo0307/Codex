import "./world-data.css";

type ProductId =
  | "BTC-USD"
  | "ETH-USD"
  | "BTC-EUR"
  | "ETH-EUR"
  | "SOL-USD"
  | "XRP-USD";

type RouteId =
  | "route-global"
  | "route-na-eu"
  | "route-eu-core"
  | "route-eu-asia"
  | "route-asia-pacific"
  | "route-na-latam";

type ConnectionState = "connecting" | "live" | "reconnecting" | "error";
type TradeSide = "buy" | "sell";
type Tone = "positive" | "negative" | "neutral";
type MapDetailLevel = "overview" | "mid" | "deep";

type ProductConfig = {
  id: ProductId;
  label: string;
  quoteCurrency: "USD" | "EUR";
  routeId: RouteId;
  corridor: string;
  hubA: string;
  hubB: string;
};

type ProductState = {
  price: number | null;
  open24h: number | null;
  volume24h: number | null;
  lastSize: number | null;
  side: TradeSide | null;
  lastTradeAtMs: number | null;
  lastDelayMs: number | null;
  history: number[];
};

type TapeEntry = {
  id: string;
  productId: ProductId;
  corridor: string;
  hubA: string;
  hubB: string;
  price: number;
  side: TradeSide;
  notionalUsd: number;
  size: number;
  tradeAtMs: number;
  delayMs: number;
};

type CorridorAggregate = {
  routeId: RouteId;
  label: string;
  hubA: string;
  hubB: string;
  notionalUsd: number;
  tradeCount: number;
  tone: Tone;
};

type MapTransformState = {
  scale: number;
  x: number;
  y: number;
  dragging: boolean;
  pointerId: number | null;
  dragStartX: number;
  dragStartY: number;
  originX: number;
  originY: number;
};

const WS_URL = "wss://ws-feed.exchange.coinbase.com";
const ROLLING_WINDOW_MS = 60_000;
const RECONNECT_DELAY_MS = 2_000;
const HISTORY_POINTS = 40;
const FEED_LIMIT = 5;

const products: ProductConfig[] = [
  {
    id: "BTC-USD",
    label: "비트코인 / USD",
    quoteCurrency: "USD",
    routeId: "route-global",
    corridor: "시카고 -> 도쿄",
    hubA: "시카고",
    hubB: "도쿄",
  },
  {
    id: "ETH-USD",
    label: "이더 / USD",
    quoteCurrency: "USD",
    routeId: "route-na-eu",
    corridor: "뉴욕 -> 런던",
    hubA: "뉴욕",
    hubB: "런던",
  },
  {
    id: "BTC-EUR",
    label: "비트코인 / EUR",
    quoteCurrency: "EUR",
    routeId: "route-eu-core",
    corridor: "런던 -> 프랑크푸르트",
    hubA: "런던",
    hubB: "프랑크푸르트",
  },
  {
    id: "ETH-EUR",
    label: "이더 / EUR",
    quoteCurrency: "EUR",
    routeId: "route-eu-asia",
    corridor: "프랑크푸르트 -> 싱가포르",
    hubA: "프랑크푸르트",
    hubB: "싱가포르",
  },
  {
    id: "SOL-USD",
    label: "솔라나 / USD",
    quoteCurrency: "USD",
    routeId: "route-asia-pacific",
    corridor: "싱가포르 -> 시드니",
    hubA: "싱가포르",
    hubB: "시드니",
  },
  {
    id: "XRP-USD",
    label: "XRP / USD",
    quoteCurrency: "USD",
    routeId: "route-na-latam",
    corridor: "뉴욕 -> 상파울루",
    hubA: "뉴욕",
    hubB: "상파울루",
  },
];

const productById = new Map<ProductId, ProductConfig>(products.map((product) => [product.id, product]));

const productState = new Map<ProductId, ProductState>(
  products.map((product) => [
    product.id,
    {
      price: null,
      open24h: null,
      volume24h: null,
      lastSize: null,
      side: null,
      lastTradeAtMs: null,
      lastDelayMs: null,
      history: [],
    },
  ]),
);

const state = {
  connection: "connecting" as ConnectionState,
  errorMessage: "" as string,
  lastMessageAtMs: null as number | null,
  lastHeartbeatAtMs: null as number | null,
  reconnectTimer: null as number | null,
  socket: null as WebSocket | null,
  heartbeats: 0,
  trades: [] as TapeEntry[],
  reconnectCount: 0,
};

const mapState: MapTransformState = {
  scale: 1,
  x: 0,
  y: 0,
  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  originX: 0,
  originY: 0,
};

const dom = {
  connectionText: null as HTMLElement | null,
  connectionPill: null as HTMLElement | null,
  socketState: null as HTMLElement | null,
  footnote: null as HTMLElement | null,
  chartArea: null as SVGPolygonElement | null,
  chartLine: null as SVGPolylineElement | null,
  chartPrice: null as HTMLElement | null,
  ticksPerMinute: null as HTMLElement | null,
  heartbeats: null as HTMLElement | null,
  lastEvent: null as HTMLElement | null,
  mapStage: null as HTMLElement | null,
  mapViewport: null as HTMLElement | null,
  mapZoom: null as HTMLElement | null,
  mapTooltip: null as HTMLElement | null,
  corridors: null as HTMLElement | null,
  feed: null as HTMLElement | null,
  metricValue: new Map<string, HTMLElement>(),
  metricDelta: new Map<string, HTMLElement>(),
  quoteValue: new Map<ProductId, HTMLElement>(),
  quoteDelta: new Map<ProductId, HTMLElement>(),
};

let tooltipRouteId: RouteId | null = null;
let tooltipClientX = 0;
let tooltipClientY = 0;

const worldSvg = `
  <svg viewBox="0 0 1440 860" aria-label="애니메이션 글로벌 금융 지도" role="img">
    <defs>
      <radialGradient id="atlas-ocean" cx="50%" cy="42%" r="70%">
        <stop offset="0%" stop-color="rgba(29,66,117,0.7)" />
        <stop offset="55%" stop-color="rgba(6,20,35,0.96)" />
        <stop offset="100%" stop-color="#020811" />
      </radialGradient>
      <linearGradient id="atlas-land-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14314a" />
        <stop offset="100%" stop-color="#0b1d2d" />
      </linearGradient>
      <linearGradient id="route-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(116,242,255,0)" />
        <stop offset="50%" stop-color="#74f2ff" />
        <stop offset="100%" stop-color="rgba(116,242,255,0)" />
      </linearGradient>
      <linearGradient id="route-gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255,197,103,0)" />
        <stop offset="50%" stop-color="#ffc567" />
        <stop offset="100%" stop-color="rgba(255,197,103,0)" />
      </linearGradient>
      <linearGradient id="route-red" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255,114,114,0)" />
        <stop offset="50%" stop-color="#ff7272" />
        <stop offset="100%" stop-color="rgba(255,114,114,0)" />
      </linearGradient>
      <filter id="atlas-glow">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect width="1440" height="860" fill="url(#atlas-ocean)" />

    <g opacity="0.9">
      <path d="M166 208 C223 125 353 93 431 126 C474 143 501 179 507 226 C512 266 484 295 441 305 C403 313 378 338 370 376 C362 414 320 429 281 409 C232 384 187 369 158 328 C123 277 117 238 166 208 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
      <path d="M374 434 C430 443 481 476 499 523 C516 564 506 621 478 670 C459 703 443 753 410 775 C384 792 350 776 338 741 C321 696 302 662 297 617 C291 550 304 497 333 460 C343 446 355 438 374 434 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
      <path d="M648 167 C706 129 782 121 848 138 C903 153 945 151 989 142 C1053 130 1141 148 1209 192 C1266 228 1357 243 1394 296 C1421 334 1418 389 1370 411 C1324 432 1268 427 1222 414 C1170 400 1128 389 1081 400 C1031 412 987 401 946 377 C899 349 868 330 824 336 C761 346 708 331 666 295 C628 261 579 218 648 167 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
      <path d="M822 393 C869 374 925 385 961 424 C993 458 999 516 976 574 C955 625 933 674 892 716 C863 746 818 731 798 688 C778 647 759 601 754 551 C747 473 765 415 822 393 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
      <path d="M1197 620 C1245 588 1327 594 1372 630 C1408 660 1408 706 1369 730 C1323 758 1256 766 1208 742 C1161 718 1152 658 1197 620 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
      <path d="M486 88 C522 60 577 59 603 87 C620 104 615 134 589 145 C558 159 514 149 494 121 C479 106 475 98 486 88 Z" fill="url(#atlas-land-fill)" stroke="rgba(146,193,232,0.15)" />
    </g>

    <g opacity="0.38" stroke="rgba(158,198,255,0.08)" stroke-width="1">
      <path d="M80 140 H1360" />
      <path d="M80 250 H1360" />
      <path d="M80 360 H1360" />
      <path d="M80 470 H1360" />
      <path d="M80 580 H1360" />
      <path d="M80 690 H1360" />
      <path d="M200 70 V790" />
      <path d="M400 70 V790" />
      <path d="M600 70 V790" />
      <path d="M800 70 V790" />
      <path d="M1000 70 V790" />
      <path d="M1200 70 V790" />
    </g>

    <g fill="none" stroke-linecap="round" filter="url(#atlas-glow)">
      <path id="route-global" class="atlas-route route-fast" d="M305 274 C481 170 650 142 830 183 C1000 222 1117 227 1234 224" stroke="url(#route-cyan)" stroke-width="6" />
      <path id="route-na-eu" class="atlas-route route-mid" d="M333 302 C520 364 686 387 873 370 C1065 352 1191 294 1270 236" stroke="url(#route-cyan)" stroke-width="4.5" />
      <path id="route-eu-core" class="atlas-route route-mid" d="M851 216 C955 200 1092 219 1248 248" stroke="url(#route-gold)" stroke-width="4.5" />
      <path id="route-eu-asia" class="atlas-route route-slow" d="M835 229 C797 326 807 451 876 614" stroke="url(#route-red)" stroke-width="4.5" />
      <path id="route-asia-pacific" class="atlas-route route-mid" d="M1236 236 C1276 344 1289 468 1237 655" stroke="url(#route-cyan)" stroke-width="4.5" />
      <path id="route-na-latam" class="atlas-route route-slow" d="M335 323 C366 442 397 566 426 648" stroke="url(#route-gold)" stroke-width="4.5" />
      <path class="atlas-route route-mid" d="M427 649 C593 576 762 539 907 582 C1056 628 1166 652 1243 649" stroke="url(#route-cyan)" stroke-width="2.6" opacity="0.28" />
      <path class="atlas-route route-slow" d="M875 614 C789 653 651 692 528 720 C481 730 452 710 427 649" stroke="url(#route-red)" stroke-width="2.4" opacity="0.28" />
    </g>

    <g fill="none" stroke="transparent" stroke-linecap="round">
      <path data-route-hit="route-global" d="M305 274 C481 170 650 142 830 183 C1000 222 1117 227 1234 224" stroke-width="20" />
      <path data-route-hit="route-na-eu" d="M333 302 C520 364 686 387 873 370 C1065 352 1191 294 1270 236" stroke-width="18" />
      <path data-route-hit="route-eu-core" d="M851 216 C955 200 1092 219 1248 248" stroke-width="18" />
      <path data-route-hit="route-eu-asia" d="M835 229 C797 326 807 451 876 614" stroke-width="18" />
      <path data-route-hit="route-asia-pacific" d="M1236 236 C1276 344 1289 468 1237 655" stroke-width="18" />
      <path data-route-hit="route-na-latam" d="M335 323 C366 442 397 566 426 648" stroke-width="18" />
    </g>

    <g class="atlas-particle" fill="#f7fbff">
      <circle r="4" opacity="0.9">
        <animateMotion dur="6.2s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-global" />
        </animateMotion>
      </circle>
    </g>
    <g class="atlas-particle" fill="#74f2ff">
      <circle r="4">
        <animateMotion dur="8.4s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-na-eu" />
        </animateMotion>
      </circle>
    </g>
    <g class="atlas-particle" fill="#ffc567">
      <circle r="4">
        <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-eu-asia" />
        </animateMotion>
      </circle>
    </g>

    <g>
      <g class="atlas-node">
        <circle cx="290" cy="274" r="10" fill="rgba(116,242,255,0.12)" />
        <circle cx="290" cy="274" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 0.25s">
        <circle cx="352" cy="300" r="10" fill="rgba(255,197,103,0.12)" />
        <circle cx="352" cy="300" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 0.5s">
        <circle cx="820" cy="184" r="10" fill="rgba(116,242,255,0.12)" />
        <circle cx="820" cy="184" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 0.75s">
        <circle cx="853" cy="214" r="10" fill="rgba(255,114,114,0.12)" />
        <circle cx="853" cy="214" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 1s">
        <circle cx="1228" cy="225" r="10" fill="rgba(116,242,255,0.12)" />
        <circle cx="1228" cy="225" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 1.25s">
        <circle cx="1238" cy="651" r="10" fill="rgba(255,197,103,0.12)" />
        <circle cx="1238" cy="651" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 1.5s">
        <circle cx="883" cy="614" r="10" fill="rgba(255,114,114,0.12)" />
        <circle cx="883" cy="614" r="5" fill="#eff8ff" />
      </g>
      <g class="atlas-node" style="animation-delay: 1.75s">
        <circle cx="426" cy="649" r="10" fill="rgba(116,242,255,0.12)" />
        <circle cx="426" cy="649" r="5" fill="#eff8ff" />
      </g>
    </g>

    <g>
      <text class="atlas-map-label" x="236" y="258">시카고</text>
      <text class="atlas-map-label" x="300" y="334">뉴욕</text>
      <text class="atlas-map-label" x="770" y="170">런던</text>
      <text class="atlas-map-label" x="826" y="252">프랑크푸르트</text>
      <text class="atlas-map-label" x="1128" y="207">싱가포르</text>
      <text class="atlas-map-label" x="1198" y="271">도쿄</text>
      <text class="atlas-map-label" x="1164" y="690">시드니</text>
      <text class="atlas-map-label" x="794" y="651">요하네스버그</text>
      <text class="atlas-map-label" x="352" y="686">상파울루</text>
      <text class="atlas-map-label atlas-map-label--soft" x="72" y="90">대륙 간 가격 발견</text>
      <text class="atlas-map-label atlas-map-label--soft" x="72" y="784">코리더는 실시간 상품 활동을 바탕으로 시각화한 추정 경로입니다</text>
    </g>

    <g class="atlas-detail-layer atlas-detail-mid">
      <circle class="atlas-detail-dot" cx="244" cy="260" r="3.5" />
      <circle class="atlas-detail-dot" cx="322" cy="322" r="3.5" />
      <circle class="atlas-detail-dot" cx="790" cy="182" r="3.5" />
      <circle class="atlas-detail-dot" cx="876" cy="234" r="3.5" />
      <circle class="atlas-detail-dot" cx="1150" cy="214" r="3.5" />
      <circle class="atlas-detail-dot" cx="1218" cy="262" r="3.5" />
      <text class="atlas-map-label atlas-map-label--detail" x="186" y="248">CME</text>
      <text class="atlas-map-label atlas-map-label--detail" x="282" y="313">NASDAQ</text>
      <text class="atlas-map-label atlas-map-label--detail" x="748" y="170">LSE</text>
      <text class="atlas-map-label atlas-map-label--detail" x="854" y="224">DBX</text>
      <text class="atlas-map-label atlas-map-label--detail" x="1097" y="202">SGX</text>
      <text class="atlas-map-label atlas-map-label--detail" x="1185" y="253">JPX</text>
    </g>

    <g class="atlas-detail-layer atlas-detail-deep">
      <path class="atlas-detail-arc" d="M270 280 C330 250 420 236 520 240" />
      <path class="atlas-detail-arc" d="M860 244 C922 260 1010 258 1108 236" />
      <path class="atlas-detail-arc" d="M1116 258 C1165 310 1192 376 1205 476" />
      <text class="atlas-map-label atlas-map-label--detail" x="474" y="228">북미 파생 허브</text>
      <text class="atlas-map-label atlas-map-label--detail" x="1040" y="224">아시아 세션 허브</text>
      <text class="atlas-map-label atlas-map-label--detail" x="1165" y="454">오세아니아 확장 구간</text>
      <text class="atlas-map-label atlas-map-label--micro" x="372" y="352">뉴욕 현물</text>
      <text class="atlas-map-label atlas-map-label--micro" x="905" y="280">프랑크푸르트 FX</text>
      <text class="atlas-map-label atlas-map-label--micro" x="1250" y="300">도쿄 야간장</text>
    </g>
  </svg>
`;

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCompactUsd(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 2,
  }).format(value);
}

function formatMarketPrice(value: number, quoteCurrency: "USD" | "EUR"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: quoteCurrency,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  }).format(value);
}

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "--";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatAge(ms: number | null): string {
  if (ms === null || ms < 0) {
    return "--";
  }
  if (ms < 1_000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1_000).toFixed(ms < 10_000 ? 1 : 0)}초`;
}

function formatTradeAge(timestampMs: number): string {
  const deltaMs = Math.max(Date.now() - timestampMs, 0);
  if (deltaMs < 1_000) {
    return "방금 전";
  }
  if (deltaMs < 60_000) {
    return `${Math.round(deltaMs / 1_000)}초 전`;
  }
  return `${Math.round(deltaMs / 60_000)}분 전`;
}

function toneFromPercent(value: number | null): Tone {
  if (value === null || Math.abs(value) < 0.05) {
    return "neutral";
  }
  return value > 0 ? "positive" : "negative";
}

function buildSparkline(values: number[]): string {
  if (values.length === 0) {
    return "0,56 60,56 120,56 180,56 240,56 300,56 360,56";
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 360;
      const y = 96 - ((value - min) / spread) * 76;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getRouteConfig(routeId: RouteId): ProductConfig | undefined {
  return products.find((product) => product.routeId === routeId);
}

function getMapDetailLevel(scale: number): MapDetailLevel {
  if (scale >= 2.15) {
    return "deep";
  }
  if (scale >= 1.45) {
    return "mid";
  }
  return "overview";
}

function formatMapDetailLevel(level: MapDetailLevel): string {
  if (level === "deep") {
    return "시장 세부";
  }
  if (level === "mid") {
    return "거래소 레벨";
  }
  return "광역 보기";
}

function getRollingTrades(): TapeEntry[] {
  const cutoff = Date.now() - ROLLING_WINDOW_MS;
  state.trades = state.trades.filter((entry) => entry.tradeAtMs >= cutoff);
  return state.trades;
}

function getCorridorAggregates(): CorridorAggregate[] {
  const aggregates = new Map<RouteId, CorridorAggregate>();
  for (const entry of getRollingTrades()) {
    const product = productById.get(entry.productId);
    if (!product) {
      continue;
    }
    const current =
      aggregates.get(product.routeId) ??
      {
        routeId: product.routeId,
        label: product.corridor,
        hubA: product.hubA,
        hubB: product.hubB,
        notionalUsd: 0,
        tradeCount: 0,
        tone: "neutral" as Tone,
      };
    current.notionalUsd += entry.notionalUsd;
    current.tradeCount += 1;
    current.tone = entry.side === "buy" ? "positive" : "negative";
    aggregates.set(product.routeId, current);
  }
  return Array.from(aggregates.values()).sort((left, right) => right.notionalUsd - left.notionalUsd);
}

function getQuoteDelta(product: ProductState): number | null {
  if (product.price === null || product.open24h === null || product.open24h === 0) {
    return null;
  }
  return ((product.price - product.open24h) / product.open24h) * 100;
}

function renderDashboard(): string {
  return `
    <main class="atlas-shell">
      <div class="atlas-dashboard">
        <aside class="atlas-sidebar">
          <section class="atlas-card atlas-enter" data-delay="0">
            <div class="atlas-kicker">글로벌 마켓 플로우</div>
            <h1 class="atlas-heading">대륙 간<br />가격 흐름</h1>
            <p class="atlas-subtitle">
              Coinbase 실시간 시장 데이터를 바탕으로 대륙 간 가격 발견 흐름을 더 선명하게
              읽을 수 있도록 구성한 금융 지도입니다.
            </p>
            <div class="atlas-side-summary">
              <div class="atlas-side-stat">
                <span>포커스</span>
                <strong>주요 크립토 자산</strong>
              </div>
              <div class="atlas-side-stat">
                <span>소스</span>
                <strong>Coinbase 공개 피드</strong>
              </div>
            </div>
            <div class="atlas-quote-list">
              ${products
                .slice(0, 4)
                .map(
                  (product) => `
                    <div class="atlas-quote-card">
                      <div class="atlas-quote-copy">
                        <div class="atlas-quote-symbol">${product.id}</div>
                        <div class="atlas-quote-name">${product.label}</div>
                      </div>
                      <div class="atlas-quote-values">
                        <strong data-quote-value="${product.id}">--</strong>
                        <small data-quote-delta="${product.id}">체결 대기 중</small>
                      </div>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </section>

          <section class="atlas-card atlas-enter" data-delay="1">
            <div class="atlas-section-title">
              <h2>피드 상태</h2>
              <span>최근 60초</span>
            </div>
            <div class="atlas-status-grid atlas-status-grid--feature">
              <div class="atlas-status atlas-status--feature">
                <div class="atlas-status-label">연결 상태</div>
                <div class="atlas-status-value" data-socket-state>연결 중</div>
              </div>
              <div class="atlas-status atlas-status--feature">
                <div class="atlas-status-label">하트비트</div>
                <div class="atlas-status-value" data-heartbeats>0</div>
              </div>
              <div class="atlas-status">
                <div class="atlas-status-label">분당 체결</div>
                <div class="atlas-status-value" data-ticks-per-minute>0</div>
              </div>
              <div class="atlas-status">
                <div class="atlas-status-label">마지막 이벤트</div>
                <div class="atlas-status-value" data-last-event>--</div>
              </div>
            </div>
            <div class="atlas-chart" aria-hidden="true">
              <svg viewBox="0 0 360 110" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="rgba(116,242,255,0.38)" />
                    <stop offset="100%" stop-color="rgba(116,242,255,0)" />
                  </linearGradient>
                </defs>
                <polygon data-chart-area points="0,110 0,56 360,56 360,110" fill="url(#chart-fill)" />
                <polyline
                  data-chart-line
                  points="0,56 60,56 120,56 180,56 240,56 300,56 360,56"
                  fill="none"
                  stroke="#74f2ff"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="atlas-footer atlas-footer--inline">
              <span>BTC-USD 실시간 테이프</span>
              <span data-chart-price>체결 대기 중</span>
            </div>
          </section>
        </aside>

        <section class="atlas-panel atlas-enter" data-delay="1">
          <header class="atlas-hero">
            <div class="atlas-hero-top">
              <div>
                <div class="atlas-kicker">하이엔드 금융 대시보드</div>
                <div class="atlas-heading" style="font-size: clamp(1.8rem, 3.5vw, 3.2rem);">
                  시네마틱 마켓 카토그래피
                </div>
                <p class="atlas-subtitle">
                  실시간 체결이 아래 지표를 즉시 갱신합니다. 지도 위 코리더는 실제 송금 경로가
                  아니라, 상품 활동을 허브 간 흐름으로 해석한 시각화 레이어입니다.
                </p>
              </div>
              <div class="atlas-pill" data-connection-pill data-status="connecting">
                <span class="atlas-pill-dot" aria-hidden="true"></span>
                <span data-connection-text>Coinbase 마켓 피드 연결 중</span>
              </div>
            </div>

            <div class="atlas-hero-metrics">
              <div class="atlas-metric">
                <div class="atlas-metric-label">1분 체결 금액</div>
                <div class="atlas-metric-value" data-metric="notional-pulse">--</div>
                <div class="atlas-metric-delta" data-metric-delta="notional-pulse">실시간 체결 대기 중</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">연결된 종목</div>
                <div class="atlas-metric-value" data-metric="products-wired">0</div>
                <div class="atlas-metric-delta" data-metric-delta="products-wired">${products.length}개 중 0개 활성</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">평균 지연</div>
                <div class="atlas-metric-value" data-metric="tick-delay">--</div>
                <div class="atlas-metric-delta" data-metric-delta="tick-delay">타임스탬프 대기 중</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">매수 우위</div>
                <div class="atlas-metric-value" data-metric="buy-pressure">--</div>
                <div class="atlas-metric-delta" data-metric-delta="buy-pressure">매수/매도 데이터 대기 중</div>
              </div>
            </div>
          </header>

          <div class="atlas-map-frame">
            <div class="atlas-map-head">
              <div class="atlas-map-title">대륙 간 시장 활동</div>
              <div class="atlas-map-time">동기화 시각 <span data-clock>00:00:00 UTC</span></div>
            </div>
            <div class="atlas-map">
              <div class="atlas-map-viewport" data-map-viewport>
                <div class="atlas-map-stage" data-map-stage>
                  ${worldSvg}
                  <div class="atlas-globe-aura"></div>
                </div>
              </div>
              <div class="atlas-scan" aria-hidden="true"></div>
              <div class="atlas-map-controls">
                <button type="button" class="atlas-map-button" data-map-control="zoom-in" aria-label="확대">+</button>
                <button type="button" class="atlas-map-button" data-map-control="zoom-out" aria-label="축소">-</button>
                <button type="button" class="atlas-map-button atlas-map-button--wide" data-map-control="reset">초기화</button>
                <div class="atlas-map-zoom" data-map-zoom>100% · 광역 보기</div>
              </div>
              <div class="atlas-map-tooltip" data-map-tooltip hidden></div>
              <div class="atlas-legend">
                <div class="atlas-caption">범례</div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-cyan"></span>
                  <span>실시간 활성 코리더</span>
                </div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-gold"></span>
                  <span>보조 거래 코리더</span>
                </div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-red"></span>
                  <span>매도 우위 밴드</span>
                </div>
              </div>
            </div>
            <div class="atlas-footer">
              <span>소스: Coinbase 공개 WebSocket 티커 피드</span>
              <span data-footnote-status>마켓 구독 대기 중</span>
            </div>
          </div>
        </section>

        <aside class="atlas-sidebar">
          <section class="atlas-card atlas-enter" data-delay="2">
            <div class="atlas-section-title">
              <h3>상위 코리더</h3>
              <span>최근 1분 체결 금액 기준</span>
            </div>
            <div class="atlas-corridors" data-corridors></div>
          </section>

          <section class="atlas-card atlas-enter" data-delay="3">
            <div class="atlas-section-title">
              <h3>실시간 체결 테이프</h3>
              <span>최신 체결</span>
            </div>
            <div class="atlas-feed" data-feed></div>
          </section>
        </aside>
      </div>
    </main>
  `;
}

function attachDashboard(root: HTMLElement): void {
  root.innerHTML = renderDashboard();
}

function cacheDom(): void {
  dom.connectionText = document.querySelector<HTMLElement>("[data-connection-text]");
  dom.connectionPill = document.querySelector<HTMLElement>("[data-connection-pill]");
  dom.socketState = document.querySelector<HTMLElement>("[data-socket-state]");
  dom.footnote = document.querySelector<HTMLElement>("[data-footnote-status]");
  dom.chartArea = document.querySelector<SVGPolygonElement>("[data-chart-area]");
  dom.chartLine = document.querySelector<SVGPolylineElement>("[data-chart-line]");
  dom.chartPrice = document.querySelector<HTMLElement>("[data-chart-price]");
  dom.ticksPerMinute = document.querySelector<HTMLElement>("[data-ticks-per-minute]");
  dom.heartbeats = document.querySelector<HTMLElement>("[data-heartbeats]");
  dom.lastEvent = document.querySelector<HTMLElement>("[data-last-event]");
  dom.mapStage = document.querySelector<HTMLElement>("[data-map-stage]");
  dom.mapViewport = document.querySelector<HTMLElement>("[data-map-viewport]");
  dom.mapZoom = document.querySelector<HTMLElement>("[data-map-zoom]");
  dom.mapTooltip = document.querySelector<HTMLElement>("[data-map-tooltip]");
  dom.corridors = document.querySelector<HTMLElement>("[data-corridors]");
  dom.feed = document.querySelector<HTMLElement>("[data-feed]");

  for (const metricId of ["notional-pulse", "products-wired", "tick-delay", "buy-pressure"]) {
    const valueNode = document.querySelector<HTMLElement>(`[data-metric="${metricId}"]`);
    const deltaNode = document.querySelector<HTMLElement>(`[data-metric-delta="${metricId}"]`);
    if (valueNode) {
      dom.metricValue.set(metricId, valueNode);
    }
    if (deltaNode) {
      dom.metricDelta.set(metricId, deltaNode);
    }
  }

  for (const product of products.slice(0, 4)) {
    const valueNode = document.querySelector<HTMLElement>(`[data-quote-value="${product.id}"]`);
    const deltaNode = document.querySelector<HTMLElement>(`[data-quote-delta="${product.id}"]`);
    if (valueNode) {
      dom.quoteValue.set(product.id, valueNode);
    }
    if (deltaNode) {
      dom.quoteDelta.set(product.id, deltaNode);
    }
  }
}

function updateClock(): void {
  const clock = document.querySelector<HTMLElement>("[data-clock]");
  if (!clock) {
    return;
  }
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(now);
}

function updateConnectionUi(): void {
  const messageAgeMs = state.lastMessageAtMs === null ? null : Date.now() - state.lastMessageAtMs;

  let label = "Coinbase 마켓 피드 연결 중";
  if (state.connection === "live") {
    label = messageAgeMs !== null && messageAgeMs < 5_000 ? "Coinbase 실시간 티커 수신 중" : "피드 지연 감지, 재연결 중";
  } else if (state.connection === "reconnecting") {
    label = "Coinbase 피드 재연결 중";
  } else if (state.connection === "error") {
    label = state.errorMessage || "피드 연결 오류";
  }

  if (dom.connectionText) {
    dom.connectionText.textContent = label;
  }
  if (dom.connectionPill) {
    dom.connectionPill.dataset.status = state.connection;
  }
  if (dom.socketState) {
    dom.socketState.textContent =
      state.connection === "live"
        ? "정상"
        : state.connection === "connecting"
          ? "연결 중"
          : state.connection === "reconnecting"
            ? "재연결 중"
            : "오류";
    dom.socketState.className = `atlas-status-value atlas-${state.connection === "error" ? "negative" : state.connection === "live" ? "positive" : "neutral"}`;
  }
  if (dom.footnote) {
    dom.footnote.textContent =
      state.connection === "live"
        ? `마지막 이벤트 ${formatAge(messageAgeMs)} 전`
        : label;
  }
}

function updateQuoteCards(): void {
  for (const product of products.slice(0, 4)) {
    const productData = productState.get(product.id);
    const valueNode = dom.quoteValue.get(product.id) ?? null;
    const deltaNode = dom.quoteDelta.get(product.id) ?? null;
    if (!productData || !valueNode || !deltaNode) {
      continue;
    }

    valueNode.textContent =
      productData.price === null ? "--" : formatMarketPrice(productData.price, product.quoteCurrency);

    const delta = getQuoteDelta(productData);
    deltaNode.textContent =
      delta === null
        ? "24시간 기준가 대기 중"
        : `24시간 기준 ${formatPercent(delta)}`;
    deltaNode.className = `atlas-chip-sub atlas-${toneFromPercent(delta)}`;
  }
}

function updateMetricsUi(): void {
  const rollingTrades = getRollingTrades();
  const activeProducts = Array.from(productState.values()).filter((product) => {
    return product.lastTradeAtMs !== null && Date.now() - product.lastTradeAtMs < ROLLING_WINDOW_MS;
  }).length;
  const totalNotional = rollingTrades.reduce((sum, entry) => sum + entry.notionalUsd, 0);
  const avgDelay =
    rollingTrades.length === 0
      ? null
      : rollingTrades.reduce((sum, entry) => sum + entry.delayMs, 0) / rollingTrades.length;
  const buyCount = rollingTrades.filter((entry) => entry.side === "buy").length;
  const buyPressure = rollingTrades.length === 0 ? null : (buyCount / rollingTrades.length) * 100;

  const notionalNode = dom.metricValue.get("notional-pulse") ?? null;
  const notionalDeltaNode = dom.metricDelta.get("notional-pulse") ?? null;
  const productsNode = dom.metricValue.get("products-wired") ?? null;
  const productsDeltaNode = dom.metricDelta.get("products-wired") ?? null;
  const delayNode = dom.metricValue.get("tick-delay") ?? null;
  const delayDeltaNode = dom.metricDelta.get("tick-delay") ?? null;
  const pressureNode = dom.metricValue.get("buy-pressure") ?? null;
  const pressureDeltaNode = dom.metricDelta.get("buy-pressure") ?? null;

  if (notionalNode) {
    notionalNode.textContent = totalNotional === 0 ? "--" : formatCompactUsd(totalNotional);
  }
  if (notionalDeltaNode) {
    notionalDeltaNode.textContent =
      rollingTrades.length === 0 ? "실시간 체결 대기 중" : `최근 60초 체결 ${rollingTrades.length}건`;
  }
  if (productsNode) {
    productsNode.textContent = String(activeProducts);
  }
  if (productsDeltaNode) {
    productsDeltaNode.textContent = `${products.length}개 중 ${activeProducts}개 활성`;
  }
  if (delayNode) {
    delayNode.textContent = formatAge(avgDelay);
  }
  if (delayDeltaNode) {
    delayDeltaNode.textContent =
      avgDelay === null ? "타임스탬프 대기 중" : `체결 타임스탬프 기준 클라이언트 지연`;
  }
  if (pressureNode) {
    pressureNode.textContent = buyPressure === null ? "--" : `${buyPressure.toFixed(0)}%`;
    pressureNode.className = `atlas-metric-value atlas-${toneFromPercent(buyPressure === null ? null : buyPressure - 50)}`;
  }
  if (pressureDeltaNode) {
    pressureDeltaNode.textContent =
      buyPressure === null
        ? "매수/매도 데이터 대기 중"
        : buyPressure >= 50
          ? `중립 대비 ${(buyPressure - 50).toFixed(1)}pt 우위`
          : `중립 대비 ${(50 - buyPressure).toFixed(1)}pt 약세`;
  }
}

function updateStatusPanel(): void {
  const rollingTrades = getRollingTrades();
  if (dom.ticksPerMinute) {
    dom.ticksPerMinute.textContent = String(rollingTrades.length);
  }
  if (dom.heartbeats) {
    dom.heartbeats.textContent = String(state.heartbeats);
  }
  if (dom.lastEvent) {
    dom.lastEvent.textContent = formatAge(state.lastMessageAtMs === null ? null : Date.now() - state.lastMessageAtMs);
  }
}

function updateChart(): void {
  const btc = productState.get("BTC-USD");
  const area = dom.chartArea;
  const line = dom.chartLine;
  const price = dom.chartPrice;
  if (!btc || !area || !line || !price) {
    return;
  }
  const points = buildSparkline(btc.history);
  const areaPoints = `0,110 ${points} 360,110`;
  line.setAttribute("points", points);
  area.setAttribute("points", areaPoints);

  if (btc.price === null) {
    price.textContent = "체결 대기 중";
    return;
  }
  const delta = getQuoteDelta(btc);
  price.textContent = `${formatMarketPrice(btc.price, "USD")} ${delta === null ? "" : `(${formatPercent(delta)})`}`.trim();
  price.className = `atlas-${toneFromPercent(delta)}`;
}

function renderCorridors(): void {
  const container = dom.corridors;
  if (!container) {
    return;
  }
  const aggregates = getCorridorAggregates().slice(0, 4);
  const maxNotional = aggregates.length === 0 ? 1 : Math.max(...aggregates.map((entry) => entry.notionalUsd), 1);

  container.innerHTML =
    aggregates.length === 0
      ? `<div class="atlas-empty">실시간 코리더 활동을 기다리는 중입니다.</div>`
      : aggregates
          .map((entry) => {
            const share = Math.max(entry.notionalUsd / maxNotional, 0.08);
            return `
              <div class="atlas-corridor">
                <div class="atlas-corridor-head">
                  <strong>${entry.label}</strong>
                  <span class="atlas-route-label">${formatCompactUsd(entry.notionalUsd)}</span>
                </div>
                <div class="atlas-corridor-meta">체결 ${entry.tradeCount}건 · ${entry.hubA} / ${entry.hubB}</div>
                <div class="atlas-corridor-bar">
                  <div class="atlas-corridor-fill atlas-${entry.tone}" style="width: ${(share * 100).toFixed(0)}%"></div>
                </div>
              </div>
            `;
          })
          .join("");
}

function renderFeed(): void {
  const container = dom.feed;
  if (!container) {
    return;
  }
  const latest = state.trades.slice(0, FEED_LIMIT);
  container.innerHTML =
    latest.length === 0
      ? `<div class="atlas-empty">실시간 체결을 기다리는 중입니다.</div>`
      : latest
          .map((entry) => {
            const product = productById.get(entry.productId);
            return `
              <article class="atlas-feed-item" data-side="${entry.side}">
                <div class="atlas-feed-line">
                  <div class="atlas-feed-title">${entry.productId} · ${entry.hubA} / ${entry.hubB}</div>
                  <div class="atlas-feed-time">${formatTradeAge(entry.tradeAtMs)}</div>
                </div>
                <div class="atlas-feed-copy">
                  ${entry.side === "buy" ? "매수 우위" : "매도 우위"} 체결가
                  ${product ? formatMarketPrice(entry.price, product.quoteCurrency) : entry.price.toFixed(2)}
                  · 수량 ${entry.size.toFixed(4)}
                </div>
                <div class="atlas-feed-line">
                  <div class="atlas-feed-badge atlas-${entry.side === "buy" ? "positive" : "negative"}">
                    ${entry.corridor}
                  </div>
                  <div class="atlas-route-label">${formatCompactUsd(entry.notionalUsd)}</div>
                </div>
              </article>
            `;
          })
          .join("");
}

function updateMapRoutes(): void {
  const aggregates = getCorridorAggregates();
  const maxNotional = aggregates.length === 0 ? 1 : Math.max(...aggregates.map((entry) => entry.notionalUsd), 1);
  const aggregateByRoute = new Map<RouteId, CorridorAggregate>(
    aggregates.map((aggregate) => [aggregate.routeId, aggregate]),
  );

  for (const product of products) {
    const routeNode = document.getElementById(product.routeId) as SVGPathElement | null;
    if (!routeNode) {
      continue;
    }
    const aggregate = aggregateByRoute.get(product.routeId);
    const strength = aggregate ? Math.max(aggregate.notionalUsd / maxNotional, 0.15) : 0.08;
    routeNode.style.opacity = String(0.2 + strength * 0.8);
    routeNode.setAttribute("stroke-width", `${2.8 + strength * 4.6}`);
    routeNode.dataset.tone = aggregate?.tone ?? "neutral";
  }
}

function applyMapTransform(): void {
  const stage = dom.mapStage;
  const viewport = dom.mapViewport;
  const zoomBadge = dom.mapZoom;
  if (!stage || !viewport || !zoomBadge) {
    return;
  }

  stage.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;
  viewport.dataset.dragging = mapState.dragging ? "true" : "false";
  const detailLevel = getMapDetailLevel(mapState.scale);
  viewport.dataset.detail = detailLevel;
  zoomBadge.textContent = `${Math.round(mapState.scale * 100)}% · ${formatMapDetailLevel(detailLevel)}`;
}

function zoomMap(nextScale: number, anchorX: number, anchorY: number): void {
  const scale = clamp(nextScale, 1, 3.25);
  const currentScale = mapState.scale;
  if (scale === currentScale) {
    return;
  }

  const worldX = (anchorX - mapState.x) / currentScale;
  const worldY = (anchorY - mapState.y) / currentScale;
  mapState.scale = scale;
  mapState.x = anchorX - worldX * scale;
  mapState.y = anchorY - worldY * scale;
  applyMapTransform();
}

function resetMapTransform(): void {
  mapState.scale = 1;
  mapState.x = 0;
  mapState.y = 0;
  applyMapTransform();
}

function hideRouteTooltip(): void {
  const tooltip = dom.mapTooltip;
  if (!tooltip) {
    return;
  }
  tooltipRouteId = null;
  tooltip.hidden = true;
}

function showRouteTooltip(routeId: RouteId, clientX: number, clientY: number): void {
  if (mapState.dragging) {
    hideRouteTooltip();
    return;
  }

  const tooltip = dom.mapTooltip;
  const viewport = dom.mapViewport;
  const config = getRouteConfig(routeId);
  if (!tooltip || !viewport || !config) {
    return;
  }

  const aggregate = getCorridorAggregates().find((entry) => entry.routeId === routeId) ?? null;
  const latestTrade = state.trades.find((entry) => entry.productId === config.id) ?? null;
  const routeProductState = productState.get(config.id);
  const delta = routeProductState ? getQuoteDelta(routeProductState) : null;

  tooltipRouteId = routeId;
  tooltipClientX = clientX;
  tooltipClientY = clientY;
  tooltip.hidden = false;
  tooltip.dataset.routeId = routeId;
  tooltip.innerHTML = `
    <div class="atlas-tooltip-kicker atlas-${aggregate?.tone ?? "neutral"}">실시간 코리더</div>
    <div class="atlas-tooltip-title">${config.corridor}</div>
    <div class="atlas-tooltip-grid">
      <div>
        <span>1분 체결 금액</span>
        <strong>${aggregate ? formatCompactUsd(aggregate.notionalUsd) : "--"}</strong>
      </div>
      <div>
        <span>체결 수</span>
        <strong>${aggregate ? aggregate.tradeCount : 0}</strong>
      </div>
      <div>
        <span>종목</span>
        <strong>${config.id}</strong>
      </div>
      <div>
        <span>24시간 변동</span>
        <strong>${formatPercent(delta)}</strong>
      </div>
    </div>
    <div class="atlas-tooltip-note">
      ${
        latestTrade
          ? `최근 체결 ${formatMarketPrice(latestTrade.price, config.quoteCurrency)} · ${formatCompactUsd(latestTrade.notionalUsd)}`
          : "이 코리더의 실시간 체결을 기다리는 중입니다"
      }
    </div>
  `;

  const rect = viewport.getBoundingClientRect();
  const rawX = clientX - rect.left;
  const rawY = clientY - rect.top;
  const width = tooltip.offsetWidth || 260;
  const height = tooltip.offsetHeight || 140;
  const x = clamp(rawX, width / 2 + 12, rect.width - width / 2 - 12);
  const y = clamp(rawY, height + 18, rect.height - 12);
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function refreshTooltipContent(): void {
  if (!tooltipRouteId) {
    return;
  }
  showRouteTooltip(tooltipRouteId, tooltipClientX, tooltipClientY);
}

function attachMapInteractions(): void {
  const viewport = document.querySelector<HTMLElement>("[data-map-viewport]");
  if (!viewport || viewport.dataset.bound === "true") {
    applyMapTransform();
    return;
  }

  viewport.dataset.bound = "true";

  viewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const anchorX = event.clientX - rect.left;
      const anchorY = event.clientY - rect.top;
      const nextScale = mapState.scale * (event.deltaY < 0 ? 1.12 : 0.9);
      zoomMap(nextScale, anchorX, anchorY);
    },
    { passive: false },
  );

  viewport.addEventListener("pointerdown", (event) => {
    const target = event.target as Element | null;
    if (event.button !== 0 || target?.closest("[data-map-control]")) {
      return;
    }

    mapState.dragging = true;
    mapState.pointerId = event.pointerId;
    mapState.dragStartX = event.clientX;
    mapState.dragStartY = event.clientY;
    mapState.originX = mapState.x;
    mapState.originY = mapState.y;
    viewport.setPointerCapture(event.pointerId);
    hideRouteTooltip();
    applyMapTransform();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (mapState.dragging && mapState.pointerId === event.pointerId) {
      mapState.x = mapState.originX + (event.clientX - mapState.dragStartX);
      mapState.y = mapState.originY + (event.clientY - mapState.dragStartY);
      applyMapTransform();
    }
  });

  const stopDrag = (event: PointerEvent) => {
    if (mapState.pointerId !== event.pointerId) {
      return;
    }
    mapState.dragging = false;
    mapState.pointerId = null;
    applyMapTransform();
  };

  viewport.addEventListener("pointerup", stopDrag);
  viewport.addEventListener("pointercancel", stopDrag);
  viewport.addEventListener("pointerleave", () => {
    if (!mapState.dragging) {
      hideRouteTooltip();
    }
  });

  const zoomIn = document.querySelector<HTMLElement>("[data-map-control=\"zoom-in\"]");
  const zoomOut = document.querySelector<HTMLElement>("[data-map-control=\"zoom-out\"]");
  const reset = document.querySelector<HTMLElement>("[data-map-control=\"reset\"]");

  zoomIn?.addEventListener("click", () => {
    zoomMap(mapState.scale * 1.12, viewport.clientWidth / 2, viewport.clientHeight / 2);
  });
  zoomOut?.addEventListener("click", () => {
    zoomMap(mapState.scale * 0.9, viewport.clientWidth / 2, viewport.clientHeight / 2);
  });
  reset?.addEventListener("click", () => {
    resetMapTransform();
  });

  for (const product of products) {
    const routeHit = document.querySelector<SVGPathElement>(`[data-route-hit="${product.routeId}"]`);
    if (!routeHit || routeHit.dataset.bound === "true") {
      continue;
    }
    routeHit.dataset.bound = "true";
    routeHit.addEventListener("pointerenter", (event) => {
      showRouteTooltip(product.routeId, event.clientX, event.clientY);
    });
    routeHit.addEventListener("pointermove", (event) => {
      showRouteTooltip(product.routeId, event.clientX, event.clientY);
    });
    routeHit.addEventListener("pointerleave", () => {
      hideRouteTooltip();
    });
  }

  applyMapTransform();
}

function refreshUi(): void {
  updateClock();
  updateConnectionUi();
  updateQuoteCards();
  updateMetricsUi();
  updateStatusPanel();
  updateChart();
  renderCorridors();
  renderFeed();
  updateMapRoutes();
  refreshTooltipContent();
  applyMapTransform();
}

function refreshMarketUi(): void {
  updateQuoteCards();
  updateMetricsUi();
  updateStatusPanel();
  updateChart();
  renderCorridors();
  renderFeed();
  updateMapRoutes();
  refreshTooltipContent();
}

function handleTicker(message: Record<string, unknown>): void {
  const productId = typeof message.product_id === "string" ? (message.product_id as ProductId) : null;
  if (!productId || !productById.has(productId)) {
    return;
  }

  const config = productById.get(productId);
  const product = productState.get(productId);
  const price = toNumber(message.price);
  const open24h = toNumber(message.open_24h);
  const volume24h = toNumber(message.volume_24h);
  const lastSize = toNumber(message.last_size) ?? 0;
  const timeRaw = typeof message.time === "string" ? message.time : "";
  const side = message.side === "buy" || message.side === "sell" ? message.side : null;
  const tradeAtMs = timeRaw ? Date.parse(timeRaw) : Date.now();

  if (!config || !product || price === null || !side || !Number.isFinite(tradeAtMs)) {
    return;
  }

  product.price = price;
  product.open24h = open24h;
  product.volume24h = volume24h;
  product.lastSize = lastSize;
  product.side = side;
  product.lastTradeAtMs = tradeAtMs;
  product.lastDelayMs = Math.max(Date.now() - tradeAtMs, 0);
  product.history.push(price);
  if (product.history.length > HISTORY_POINTS) {
    product.history.shift();
  }

  const usdConversion = config.quoteCurrency === "EUR" ? 1.09 : 1;
  const notionalUsd = Math.max(price * lastSize * usdConversion, 0);

  state.trades.unshift({
    id: `${productId}-${tradeAtMs}-${message.trade_id ?? Math.random().toString(16).slice(2)}`,
    productId,
    corridor: config.corridor,
    hubA: config.hubA,
    hubB: config.hubB,
    price,
    side,
    notionalUsd,
    size: lastSize,
    tradeAtMs,
    delayMs: product.lastDelayMs ?? 0,
  });
  if (state.trades.length > 120) {
    state.trades.length = 120;
  }
}

function scheduleReconnect(): void {
  if (state.reconnectTimer !== null) {
    return;
  }
  state.connection = "reconnecting";
  state.reconnectCount += 1;
  state.reconnectTimer = window.setTimeout(() => {
    state.reconnectTimer = null;
    connectFeed();
  }, RECONNECT_DELAY_MS);
}

function connectFeed(): void {
  if (state.socket) {
    state.socket.close();
  }

  state.connection = "connecting";
  state.errorMessage = "";

  const socket = new WebSocket(WS_URL);
  state.socket = socket;

  socket.addEventListener("open", () => {
    state.connection = "live";
    const subscribeMessage = {
      type: "subscribe",
      product_ids: products.map((product) => product.id),
      channels: ["heartbeat", "ticker"],
    };
    socket.send(JSON.stringify(subscribeMessage));
    updateConnectionUi();
    updateStatusPanel();
  });

  socket.addEventListener("message", (event) => {
    state.lastMessageAtMs = Date.now();
    const payload = typeof event.data === "string" ? event.data : "";
    if (!payload) {
      return;
    }

    let message: Record<string, unknown>;
    try {
      message = JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return;
    }

    const type = typeof message.type === "string" ? message.type : "";
    if (type === "heartbeat") {
      state.heartbeats += 1;
      state.lastHeartbeatAtMs = Date.now();
      updateConnectionUi();
      updateStatusPanel();
    } else if (type === "ticker") {
      handleTicker(message);
      updateConnectionUi();
      refreshMarketUi();
    } else if (type === "error") {
      state.connection = "error";
      state.errorMessage =
        typeof message.message === "string" ? message.message : "Coinbase 피드 오류";
      scheduleReconnect();
      updateConnectionUi();
    }
  });

  socket.addEventListener("error", () => {
    state.connection = "error";
    state.errorMessage = "Coinbase 마켓 피드에 연결할 수 없습니다";
    updateConnectionUi();
  });

  socket.addEventListener("close", () => {
    if (state.socket === socket) {
      state.socket = null;
    }
    scheduleReconnect();
    updateConnectionUi();
  });
}

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("월드 데이터 대시보드 루트 요소를 찾을 수 없습니다.");
}

attachDashboard(root);
cacheDom();
attachMapInteractions();
refreshUi();
connectFeed();
window.setInterval(refreshUi, 1_000);

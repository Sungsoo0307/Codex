import"./modulepreload-polyfill-B5Qt9EMX.js";const at="wss://ws-feed.exchange.coinbase.com",V=6e4,et=2e3,st=40,lt=5,p=[{id:"BTC-USD",label:"비트코인 / USD",quoteCurrency:"USD",routeId:"route-global",corridor:"시카고 -> 도쿄",hubA:"시카고",hubB:"도쿄"},{id:"ETH-USD",label:"이더 / USD",quoteCurrency:"USD",routeId:"route-na-eu",corridor:"뉴욕 -> 런던",hubA:"뉴욕",hubB:"런던"},{id:"BTC-EUR",label:"비트코인 / EUR",quoteCurrency:"EUR",routeId:"route-eu-core",corridor:"런던 -> 프랑크푸르트",hubA:"런던",hubB:"프랑크푸르트"},{id:"ETH-EUR",label:"이더 / EUR",quoteCurrency:"EUR",routeId:"route-eu-asia",corridor:"프랑크푸르트 -> 싱가포르",hubA:"프랑크푸르트",hubB:"싱가포르"},{id:"SOL-USD",label:"솔라나 / USD",quoteCurrency:"USD",routeId:"route-asia-pacific",corridor:"싱가포르 -> 시드니",hubA:"싱가포르",hubB:"시드니"},{id:"XRP-USD",label:"XRP / USD",quoteCurrency:"USD",routeId:"route-na-latam",corridor:"뉴욕 -> 상파울루",hubA:"뉴욕",hubB:"상파울루"}],$=new Map(p.map(t=>[t.id,t])),w=new Map(p.map(t=>[t.id,{price:null,open24h:null,volume24h:null,lastSize:null,side:null,lastTradeAtMs:null,lastDelayMs:null,history:[]}])),i={connection:"connecting",errorMessage:"",lastMessageAtMs:null,lastHeartbeatAtMs:null,reconnectTimer:null,socket:null,heartbeats:0,trades:[],reconnectCount:0},n={scale:1,x:0,y:0,dragging:!1,pointerId:null,dragStartX:0,dragStartY:0,originX:0,originY:0},l={connectionText:null,connectionPill:null,socketState:null,footnote:null,chartArea:null,chartLine:null,chartPrice:null,ticksPerMinute:null,heartbeats:null,lastEvent:null,mapStage:null,mapViewport:null,mapZoom:null,mapTooltip:null,corridors:null,feed:null,metricValue:new Map,metricDelta:new Map,quoteValue:new Map,quoteDelta:new Map};let D=null,X=0,z=0;const ot=`
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
`;function k(t){if(typeof t=="number"&&Number.isFinite(t))return t;if(typeof t!="string"||!t.trim())return null;const a=Number(t);return Number.isFinite(a)?a:null}function M(t){return new Intl.NumberFormat("ko-KR",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:t>=1e6?1:2}).format(t)}function I(t,a){return new Intl.NumberFormat("ko-KR",{style:"currency",currency:a,maximumFractionDigits:t>=1?2:4}).format(t)}function E(t){return t===null||!Number.isFinite(t)?"--":`${t>0?"+":""}${t.toFixed(2)}%`}function L(t){return t===null||t<0?"--":t<1e3?`${Math.round(t)}ms`:`${(t/1e3).toFixed(t<1e4?1:0)}초`}function it(t){const a=Math.max(Date.now()-t,0);return a<1e3?"방금 전":a<6e4?`${Math.round(a/1e3)}초 전`:`${Math.round(a/6e4)}분 전`}function R(t){return t===null||Math.abs(t)<.05?"neutral":t>0?"positive":"negative"}function nt(t){if(t.length===0)return"0,56 60,56 120,56 180,56 240,56 300,56 360,56";const a=Math.min(...t),s=Math.max(...t),e=Math.max(s-a,1);return t.map((r,o)=>{const c=t.length===1?0:o/(t.length-1)*360,d=96-(r-a)/e*76;return`${c.toFixed(1)},${d.toFixed(1)}`}).join(" ")}function A(t,a,s){return Math.min(Math.max(t,a),s)}function rt(t){return p.find(a=>a.routeId===t)}function ct(t){return t>=2.15?"deep":t>=1.45?"mid":"overview"}function dt(t){return t==="deep"?"시장 세부":t==="mid"?"거래소 레벨":"광역 보기"}function B(){const t=Date.now()-V;return i.trades=i.trades.filter(a=>a.tradeAtMs>=t),i.trades}function F(){const t=new Map;for(const a of B()){const s=$.get(a.productId);if(!s)continue;const e=t.get(s.routeId)??{routeId:s.routeId,label:s.corridor,hubA:s.hubA,hubB:s.hubB,notionalUsd:0,tradeCount:0,tone:"neutral"};e.notionalUsd+=a.notionalUsd,e.tradeCount+=1,e.tone=a.side==="buy"?"positive":"negative",t.set(s.routeId,e)}return Array.from(t.values()).sort((a,s)=>s.notionalUsd-a.notionalUsd)}function P(t){return t.price===null||t.open24h===null||t.open24h===0?null:(t.price-t.open24h)/t.open24h*100}function ut(){return`
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
              ${p.slice(0,4).map(t=>`
                    <div class="atlas-quote-card">
                      <div class="atlas-quote-copy">
                        <div class="atlas-quote-symbol">${t.id}</div>
                        <div class="atlas-quote-name">${t.label}</div>
                      </div>
                      <div class="atlas-quote-values">
                        <strong data-quote-value="${t.id}">--</strong>
                        <small data-quote-delta="${t.id}">체결 대기 중</small>
                      </div>
                    </div>
                  `).join("")}
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
                <div class="atlas-metric-delta" data-metric-delta="products-wired">${p.length}개 중 0개 활성</div>
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
                  ${ot}
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
  `}function pt(t){t.innerHTML=ut()}function ft(){l.connectionText=document.querySelector("[data-connection-text]"),l.connectionPill=document.querySelector("[data-connection-pill]"),l.socketState=document.querySelector("[data-socket-state]"),l.footnote=document.querySelector("[data-footnote-status]"),l.chartArea=document.querySelector("[data-chart-area]"),l.chartLine=document.querySelector("[data-chart-line]"),l.chartPrice=document.querySelector("[data-chart-price]"),l.ticksPerMinute=document.querySelector("[data-ticks-per-minute]"),l.heartbeats=document.querySelector("[data-heartbeats]"),l.lastEvent=document.querySelector("[data-last-event]"),l.mapStage=document.querySelector("[data-map-stage]"),l.mapViewport=document.querySelector("[data-map-viewport]"),l.mapZoom=document.querySelector("[data-map-zoom]"),l.mapTooltip=document.querySelector("[data-map-tooltip]"),l.corridors=document.querySelector("[data-corridors]"),l.feed=document.querySelector("[data-feed]");for(const t of["notional-pulse","products-wired","tick-delay","buy-pressure"]){const a=document.querySelector(`[data-metric="${t}"]`),s=document.querySelector(`[data-metric-delta="${t}"]`);a&&l.metricValue.set(t,a),s&&l.metricDelta.set(t,s)}for(const t of p.slice(0,4)){const a=document.querySelector(`[data-quote-value="${t.id}"]`),s=document.querySelector(`[data-quote-delta="${t.id}"]`);a&&l.quoteValue.set(t.id,a),s&&l.quoteDelta.set(t.id,s)}}function mt(){const t=document.querySelector("[data-clock]");if(!t)return;const a=new Date;t.textContent=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"UTC",timeZoneName:"short"}).format(a)}function b(){const t=i.lastMessageAtMs===null?null:Date.now()-i.lastMessageAtMs;let a="Coinbase 마켓 피드 연결 중";i.connection==="live"?a=t!==null&&t<5e3?"Coinbase 실시간 티커 수신 중":"피드 지연 감지, 재연결 중":i.connection==="reconnecting"?a="Coinbase 피드 재연결 중":i.connection==="error"&&(a=i.errorMessage||"피드 연결 오류"),l.connectionText&&(l.connectionText.textContent=a),l.connectionPill&&(l.connectionPill.dataset.status=i.connection),l.socketState&&(l.socketState.textContent=i.connection==="live"?"정상":i.connection==="connecting"?"연결 중":i.connection==="reconnecting"?"재연결 중":"오류",l.socketState.className=`atlas-status-value atlas-${i.connection==="error"?"negative":i.connection==="live"?"positive":"neutral"}`),l.footnote&&(l.footnote.textContent=i.connection==="live"?`마지막 이벤트 ${L(t)} 전`:a)}function G(){for(const t of p.slice(0,4)){const a=w.get(t.id),s=l.quoteValue.get(t.id)??null,e=l.quoteDelta.get(t.id)??null;if(!a||!s||!e)continue;s.textContent=a.price===null?"--":I(a.price,t.quoteCurrency);const r=P(a);e.textContent=r===null?"24시간 기준가 대기 중":`24시간 기준 ${E(r)}`,e.className=`atlas-chip-sub atlas-${R(r)}`}}function Y(){const t=B(),a=Array.from(w.values()).filter(g=>g.lastTradeAtMs!==null&&Date.now()-g.lastTradeAtMs<V).length,s=t.reduce((g,C)=>g+C.notionalUsd,0),e=t.length===0?null:t.reduce((g,C)=>g+C.delayMs,0)/t.length,r=t.filter(g=>g.side==="buy").length,o=t.length===0?null:r/t.length*100,c=l.metricValue.get("notional-pulse")??null,d=l.metricDelta.get("notional-pulse")??null,f=l.metricValue.get("products-wired")??null,m=l.metricDelta.get("products-wired")??null,u=l.metricValue.get("tick-delay")??null,y=l.metricDelta.get("tick-delay")??null,v=l.metricValue.get("buy-pressure")??null,x=l.metricDelta.get("buy-pressure")??null;c&&(c.textContent=s===0?"--":M(s)),d&&(d.textContent=t.length===0?"실시간 체결 대기 중":`최근 60초 체결 ${t.length}건`),f&&(f.textContent=String(a)),m&&(m.textContent=`${p.length}개 중 ${a}개 활성`),u&&(u.textContent=L(e)),y&&(y.textContent=e===null?"타임스탬프 대기 중":"체결 타임스탬프 기준 클라이언트 지연"),v&&(v.textContent=o===null?"--":`${o.toFixed(0)}%`,v.className=`atlas-metric-value atlas-${R(o===null?null:o-50)}`),x&&(x.textContent=o===null?"매수/매도 데이터 대기 중":o>=50?`중립 대비 ${(o-50).toFixed(1)}pt 우위`:`중립 대비 ${(50-o).toFixed(1)}pt 약세`)}function q(){const t=B();l.ticksPerMinute&&(l.ticksPerMinute.textContent=String(t.length)),l.heartbeats&&(l.heartbeats.textContent=String(i.heartbeats)),l.lastEvent&&(l.lastEvent.textContent=L(i.lastMessageAtMs===null?null:Date.now()-i.lastMessageAtMs))}function _(){const t=w.get("BTC-USD"),a=l.chartArea,s=l.chartLine,e=l.chartPrice;if(!t||!a||!s||!e)return;const r=nt(t.history),o=`0,110 ${r} 360,110`;if(s.setAttribute("points",r),a.setAttribute("points",o),t.price===null){e.textContent="체결 대기 중";return}const c=P(t);e.textContent=`${I(t.price,"USD")} ${c===null?"":`(${E(c)})`}`.trim(),e.className=`atlas-${R(c)}`}function Z(){const t=l.corridors;if(!t)return;const a=F().slice(0,4),s=a.length===0?1:Math.max(...a.map(e=>e.notionalUsd),1);t.innerHTML=a.length===0?'<div class="atlas-empty">실시간 코리더 활동을 기다리는 중입니다.</div>':a.map(e=>{const r=Math.max(e.notionalUsd/s,.08);return`
              <div class="atlas-corridor">
                <div class="atlas-corridor-head">
                  <strong>${e.label}</strong>
                  <span class="atlas-route-label">${M(e.notionalUsd)}</span>
                </div>
                <div class="atlas-corridor-meta">체결 ${e.tradeCount}건 · ${e.hubA} / ${e.hubB}</div>
                <div class="atlas-corridor-bar">
                  <div class="atlas-corridor-fill atlas-${e.tone}" style="width: ${(r*100).toFixed(0)}%"></div>
                </div>
              </div>
            `}).join("")}function O(){const t=l.feed;if(!t)return;const a=i.trades.slice(0,lt);t.innerHTML=a.length===0?'<div class="atlas-empty">실시간 체결을 기다리는 중입니다.</div>':a.map(s=>{const e=$.get(s.productId);return`
              <article class="atlas-feed-item" data-side="${s.side}">
                <div class="atlas-feed-line">
                  <div class="atlas-feed-title">${s.productId} · ${s.hubA} / ${s.hubB}</div>
                  <div class="atlas-feed-time">${it(s.tradeAtMs)}</div>
                </div>
                <div class="atlas-feed-copy">
                  ${s.side==="buy"?"매수 우위":"매도 우위"} 체결가
                  ${e?I(s.price,e.quoteCurrency):s.price.toFixed(2)}
                  · 수량 ${s.size.toFixed(4)}
                </div>
                <div class="atlas-feed-line">
                  <div class="atlas-feed-badge atlas-${s.side==="buy"?"positive":"negative"}">
                    ${s.corridor}
                  </div>
                  <div class="atlas-route-label">${M(s.notionalUsd)}</div>
                </div>
              </article>
            `}).join("")}function W(){const t=F(),a=t.length===0?1:Math.max(...t.map(e=>e.notionalUsd),1),s=new Map(t.map(e=>[e.routeId,e]));for(const e of p){const r=document.getElementById(e.routeId);if(!r)continue;const o=s.get(e.routeId),c=o?Math.max(o.notionalUsd/a,.15):.08;r.style.opacity=String(.2+c*.8),r.setAttribute("stroke-width",`${2.8+c*4.6}`),r.dataset.tone=o?.tone??"neutral"}}function h(){const t=l.mapStage,a=l.mapViewport,s=l.mapZoom;if(!t||!a||!s)return;t.style.transform=`translate(${n.x}px, ${n.y}px) scale(${n.scale})`,a.dataset.dragging=n.dragging?"true":"false";const e=ct(n.scale);a.dataset.detail=e,s.textContent=`${Math.round(n.scale*100)}% · ${dt(e)}`}function T(t,a,s){const e=A(t,1,3.25),r=n.scale;if(e===r)return;const o=(a-n.x)/r,c=(s-n.y)/r;n.scale=e,n.x=a-o*e,n.y=s-c*e,h()}function gt(){n.scale=1,n.x=0,n.y=0,h()}function S(){const t=l.mapTooltip;t&&(D=null,t.hidden=!0)}function N(t,a,s){if(n.dragging){S();return}const e=l.mapTooltip,r=l.mapViewport,o=rt(t);if(!e||!r||!o)return;const c=F().find(U=>U.routeId===t)??null,d=i.trades.find(U=>U.productId===o.id)??null,f=w.get(o.id),m=f?P(f):null;D=t,X=a,z=s,e.hidden=!1,e.dataset.routeId=t,e.innerHTML=`
    <div class="atlas-tooltip-kicker atlas-${c?.tone??"neutral"}">실시간 코리더</div>
    <div class="atlas-tooltip-title">${o.corridor}</div>
    <div class="atlas-tooltip-grid">
      <div>
        <span>1분 체결 금액</span>
        <strong>${c?M(c.notionalUsd):"--"}</strong>
      </div>
      <div>
        <span>체결 수</span>
        <strong>${c?c.tradeCount:0}</strong>
      </div>
      <div>
        <span>종목</span>
        <strong>${o.id}</strong>
      </div>
      <div>
        <span>24시간 변동</span>
        <strong>${E(m)}</strong>
      </div>
    </div>
    <div class="atlas-tooltip-note">
      ${d?`최근 체결 ${I(d.price,o.quoteCurrency)} · ${M(d.notionalUsd)}`:"이 코리더의 실시간 체결을 기다리는 중입니다"}
    </div>
  `;const u=r.getBoundingClientRect(),y=a-u.left,v=s-u.top,x=e.offsetWidth||260,g=e.offsetHeight||140,C=A(y,x/2+12,u.width-x/2-12),tt=A(v,g+18,u.height-12);e.style.left=`${C}px`,e.style.top=`${tt}px`}function j(){D&&N(D,X,z)}function ht(){const t=document.querySelector("[data-map-viewport]");if(!t||t.dataset.bound==="true"){h();return}t.dataset.bound="true",t.addEventListener("wheel",o=>{o.preventDefault();const c=t.getBoundingClientRect(),d=o.clientX-c.left,f=o.clientY-c.top,m=n.scale*(o.deltaY<0?1.12:.9);T(m,d,f)},{passive:!1}),t.addEventListener("pointerdown",o=>{const c=o.target;o.button!==0||c?.closest("[data-map-control]")||(n.dragging=!0,n.pointerId=o.pointerId,n.dragStartX=o.clientX,n.dragStartY=o.clientY,n.originX=n.x,n.originY=n.y,t.setPointerCapture(o.pointerId),S(),h())}),t.addEventListener("pointermove",o=>{n.dragging&&n.pointerId===o.pointerId&&(n.x=n.originX+(o.clientX-n.dragStartX),n.y=n.originY+(o.clientY-n.dragStartY),h())});const a=o=>{n.pointerId===o.pointerId&&(n.dragging=!1,n.pointerId=null,h())};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("pointerleave",()=>{n.dragging||S()});const s=document.querySelector('[data-map-control="zoom-in"]'),e=document.querySelector('[data-map-control="zoom-out"]'),r=document.querySelector('[data-map-control="reset"]');s?.addEventListener("click",()=>{T(n.scale*1.12,t.clientWidth/2,t.clientHeight/2)}),e?.addEventListener("click",()=>{T(n.scale*.9,t.clientWidth/2,t.clientHeight/2)}),r?.addEventListener("click",()=>{gt()});for(const o of p){const c=document.querySelector(`[data-route-hit="${o.routeId}"]`);!c||c.dataset.bound==="true"||(c.dataset.bound="true",c.addEventListener("pointerenter",d=>{N(o.routeId,d.clientX,d.clientY)}),c.addEventListener("pointermove",d=>{N(o.routeId,d.clientX,d.clientY)}),c.addEventListener("pointerleave",()=>{S()}))}h()}function J(){mt(),b(),G(),Y(),q(),_(),Z(),O(),W(),j(),h()}function vt(){G(),Y(),q(),_(),Z(),O(),W(),j()}function bt(t){const a=typeof t.product_id=="string"?t.product_id:null;if(!a||!$.has(a))return;const s=$.get(a),e=w.get(a),r=k(t.price),o=k(t.open_24h),c=k(t.volume_24h),d=k(t.last_size)??0,f=typeof t.time=="string"?t.time:"",m=t.side==="buy"||t.side==="sell"?t.side:null,u=f?Date.parse(f):Date.now();if(!s||!e||r===null||!m||!Number.isFinite(u))return;e.price=r,e.open24h=o,e.volume24h=c,e.lastSize=d,e.side=m,e.lastTradeAtMs=u,e.lastDelayMs=Math.max(Date.now()-u,0),e.history.push(r),e.history.length>st&&e.history.shift();const y=s.quoteCurrency==="EUR"?1.09:1,v=Math.max(r*d*y,0);i.trades.unshift({id:`${a}-${u}-${t.trade_id??Math.random().toString(16).slice(2)}`,productId:a,corridor:s.corridor,hubA:s.hubA,hubB:s.hubB,price:r,side:m,notionalUsd:v,size:d,tradeAtMs:u,delayMs:e.lastDelayMs??0}),i.trades.length>120&&(i.trades.length=120)}function H(){i.reconnectTimer===null&&(i.connection="reconnecting",i.reconnectCount+=1,i.reconnectTimer=window.setTimeout(()=>{i.reconnectTimer=null,K()},et))}function K(){i.socket&&i.socket.close(),i.connection="connecting",i.errorMessage="";const t=new WebSocket(at);i.socket=t,t.addEventListener("open",()=>{i.connection="live";const a={type:"subscribe",product_ids:p.map(s=>s.id),channels:["heartbeat","ticker"]};t.send(JSON.stringify(a)),b(),q()}),t.addEventListener("message",a=>{i.lastMessageAtMs=Date.now();const s=typeof a.data=="string"?a.data:"";if(!s)return;let e;try{e=JSON.parse(s)}catch{return}const r=typeof e.type=="string"?e.type:"";r==="heartbeat"?(i.heartbeats+=1,i.lastHeartbeatAtMs=Date.now(),b(),q()):r==="ticker"?(bt(e),b(),vt()):r==="error"&&(i.connection="error",i.errorMessage=typeof e.message=="string"?e.message:"Coinbase 피드 오류",H(),b())}),t.addEventListener("error",()=>{i.connection="error",i.errorMessage="Coinbase 마켓 피드에 연결할 수 없습니다",b()}),t.addEventListener("close",()=>{i.socket===t&&(i.socket=null),H(),b()})}const Q=document.querySelector("#app");if(!Q)throw new Error("월드 데이터 대시보드 루트 요소를 찾을 수 없습니다.");pt(Q);ft();ht();J();K();window.setInterval(J,1e3);
//# sourceMappingURL=world-data-Cl7rMpGs.js.map

import"./modulepreload-polyfill-B5Qt9EMX.js";const et="wss://ws-feed.exchange.coinbase.com",Y=6e4,at=2e3,ot=40,st=5,p=[{id:"BTC-USD",label:"Bitcoin / USD",quoteCurrency:"USD",routeId:"route-global",corridor:"Chicago -> Tokyo",hubA:"Chicago",hubB:"Tokyo"},{id:"ETH-USD",label:"Ether / USD",quoteCurrency:"USD",routeId:"route-na-eu",corridor:"New York -> London",hubA:"New York",hubB:"London"},{id:"BTC-EUR",label:"Bitcoin / EUR",quoteCurrency:"EUR",routeId:"route-eu-core",corridor:"London -> Frankfurt",hubA:"London",hubB:"Frankfurt"},{id:"ETH-EUR",label:"Ether / EUR",quoteCurrency:"EUR",routeId:"route-eu-asia",corridor:"Frankfurt -> Singapore",hubA:"Frankfurt",hubB:"Singapore"},{id:"SOL-USD",label:"Solana / USD",quoteCurrency:"USD",routeId:"route-asia-pacific",corridor:"Singapore -> Sydney",hubA:"Singapore",hubB:"Sydney"},{id:"XRP-USD",label:"XRP / USD",quoteCurrency:"USD",routeId:"route-na-latam",corridor:"New York -> Sao Paulo",hubA:"New York",hubB:"Sao Paulo"}],$=new Map(p.map(t=>[t.id,t])),M=new Map(p.map(t=>[t.id,{price:null,open24h:null,volume24h:null,lastSize:null,side:null,lastTradeAtMs:null,lastDelayMs:null,history:[]}])),i={connection:"connecting",errorMessage:"",lastMessageAtMs:null,lastHeartbeatAtMs:null,reconnectTimer:null,socket:null,heartbeats:0,trades:[],reconnectCount:0},r={scale:1,x:0,y:0,dragging:!1,pointerId:null,dragStartX:0,dragStartY:0,originX:0,originY:0},s={connectionText:null,connectionPill:null,socketState:null,footnote:null,chartArea:null,chartLine:null,chartPrice:null,ticksPerMinute:null,heartbeats:null,lastEvent:null,mapStage:null,mapViewport:null,mapZoom:null,mapTooltip:null,corridors:null,feed:null,metricValue:new Map,metricDelta:new Map,quoteValue:new Map,quoteDelta:new Map};let D=null,V=0,z=0;const nt=`
  <svg viewBox="0 0 1440 860" aria-label="Animated world financial map" role="img">
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
      <text class="atlas-map-label" x="236" y="258">Chicago</text>
      <text class="atlas-map-label" x="300" y="334">New York</text>
      <text class="atlas-map-label" x="770" y="170">London</text>
      <text class="atlas-map-label" x="826" y="252">Frankfurt</text>
      <text class="atlas-map-label" x="1128" y="207">Singapore</text>
      <text class="atlas-map-label" x="1198" y="271">Tokyo</text>
      <text class="atlas-map-label" x="1164" y="690">Sydney</text>
      <text class="atlas-map-label" x="794" y="651">Johannesburg</text>
      <text class="atlas-map-label" x="352" y="686">Sao Paulo</text>
      <text class="atlas-map-label atlas-map-label--soft" x="72" y="90">Cross-border price discovery</text>
      <text class="atlas-map-label atlas-map-label--soft" x="72" y="784">Corridors are visual inferences from live product activity</text>
    </g>
  </svg>
`;function w(t){if(typeof t=="number"&&Number.isFinite(t))return t;if(typeof t!="string"||!t.trim())return null;const e=Number(t);return Number.isFinite(e)?e:null}function k(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:t>=1e6?1:2}).format(t)}function T(t,e){return new Intl.NumberFormat("en-US",{style:"currency",currency:e,maximumFractionDigits:t>=1?2:4}).format(t)}function L(t){return t===null||!Number.isFinite(t)?"--":`${t>0?"+":""}${t.toFixed(2)}%`}function E(t){return t===null||t<0?"--":t<1e3?`${Math.round(t)} ms`:`${(t/1e3).toFixed(t<1e4?1:0)} s`}function it(t){const e=Math.max(Date.now()-t,0);return e<1e3?"just now":e<6e4?`${Math.round(e/1e3)} sec ago`:`${Math.round(e/6e4)} min ago`}function F(t){return t===null||Math.abs(t)<.05?"neutral":t>0?"positive":"negative"}function rt(t){if(t.length===0)return"0,56 60,56 120,56 180,56 240,56 300,56 360,56";const e=Math.min(...t),o=Math.max(...t),a=Math.max(o-e,1);return t.map((l,n)=>{const c=t.length===1?0:n/(t.length-1)*360,d=96-(l-e)/a*76;return`${c.toFixed(1)},${d.toFixed(1)}`}).join(" ")}function N(t,e,o){return Math.min(Math.max(t,e),o)}function lt(t){return p.find(e=>e.routeId===t)}function B(){const t=Date.now()-Y;return i.trades=i.trades.filter(e=>e.tradeAtMs>=t),i.trades}function P(){const t=new Map;for(const e of B()){const o=$.get(e.productId);if(!o)continue;const a=t.get(o.routeId)??{routeId:o.routeId,label:o.corridor,hubA:o.hubA,hubB:o.hubB,notionalUsd:0,tradeCount:0,tone:"neutral"};a.notionalUsd+=e.notionalUsd,a.tradeCount+=1,a.tone=e.side==="buy"?"positive":"negative",t.set(o.routeId,a)}return Array.from(t.values()).sort((e,o)=>o.notionalUsd-e.notionalUsd)}function R(t){return t.price===null||t.open24h===null||t.open24h===0?null:(t.price-t.open24h)/t.open24h*100}function ct(){return`
    <main class="atlas-shell">
      <div class="atlas-dashboard">
        <aside class="atlas-sidebar">
          <section class="atlas-card atlas-enter" data-delay="0">
            <div class="atlas-kicker">Global Market Flow</div>
            <h1 class="atlas-heading">Cross-border<br />price motion</h1>
            <p class="atlas-subtitle">
              Live Coinbase market data, composed into a cleaner world-atlas view for monitoring
              cross-border price discovery.
            </p>
            <div class="atlas-side-summary">
              <div class="atlas-side-stat">
                <span>Focus</span>
                <strong>Crypto majors</strong>
              </div>
              <div class="atlas-side-stat">
                <span>Source</span>
                <strong>Coinbase feed</strong>
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
                        <small data-quote-delta="${t.id}">awaiting tape</small>
                      </div>
                    </div>
                  `).join("")}
            </div>
          </section>

          <section class="atlas-card atlas-enter" data-delay="1">
            <div class="atlas-section-title">
              <h2>Feed health</h2>
              <span>rolling 60 sec</span>
            </div>
            <div class="atlas-status-grid atlas-status-grid--feature">
              <div class="atlas-status atlas-status--feature">
                <div class="atlas-status-label">Socket state</div>
                <div class="atlas-status-value" data-socket-state>Connecting</div>
              </div>
              <div class="atlas-status atlas-status--feature">
                <div class="atlas-status-label">Heartbeats</div>
                <div class="atlas-status-value" data-heartbeats>0</div>
              </div>
              <div class="atlas-status">
                <div class="atlas-status-label">Ticks / min</div>
                <div class="atlas-status-value" data-ticks-per-minute>0</div>
              </div>
              <div class="atlas-status">
                <div class="atlas-status-label">Last event</div>
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
              <span>BTC-USD live tape</span>
              <span data-chart-price>Waiting for ticks</span>
            </div>
          </section>
        </aside>

        <section class="atlas-panel atlas-enter" data-delay="1">
          <header class="atlas-hero">
            <div class="atlas-hero-top">
              <div>
                <div class="atlas-kicker">High-end financial dashboard</div>
                <div class="atlas-heading" style="font-size: clamp(1.8rem, 3.5vw, 3.2rem);">
                  Cinematic Market Cartography
                </div>
                <p class="atlas-subtitle">
                  Live trade ticks update the metrics below. The world corridors are inferred
                  visual lanes mapped from product activity, not literal fund-transfer rails.
                </p>
              </div>
              <div class="atlas-pill" data-connection-pill data-status="connecting">
                <span class="atlas-pill-dot" aria-hidden="true"></span>
                <span data-connection-text>Connecting to Coinbase market feed</span>
              </div>
            </div>

            <div class="atlas-hero-metrics">
              <div class="atlas-metric">
                <div class="atlas-metric-label">1m notional pulse</div>
                <div class="atlas-metric-value" data-metric="notional-pulse">--</div>
                <div class="atlas-metric-delta" data-metric-delta="notional-pulse">Awaiting live trades</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">Products wired</div>
                <div class="atlas-metric-value" data-metric="products-wired">0</div>
                <div class="atlas-metric-delta" data-metric-delta="products-wired">0 of ${p.length} active</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">Average tick delay</div>
                <div class="atlas-metric-value" data-metric="tick-delay">--</div>
                <div class="atlas-metric-delta" data-metric-delta="tick-delay">Waiting for timestamps</div>
              </div>
              <div class="atlas-metric">
                <div class="atlas-metric-label">Buy pressure</div>
                <div class="atlas-metric-value" data-metric="buy-pressure">--</div>
                <div class="atlas-metric-delta" data-metric-delta="buy-pressure">No side data yet</div>
              </div>
            </div>
          </header>

          <div class="atlas-map-frame">
            <div class="atlas-map-head">
              <div class="atlas-map-title">Intercontinental market activity</div>
              <div class="atlas-map-time">Synced <span data-clock>00:00:00 UTC</span></div>
            </div>
            <div class="atlas-map">
              <div class="atlas-map-viewport" data-map-viewport>
                <div class="atlas-map-stage" data-map-stage>
                  ${nt}
                  <div class="atlas-globe-aura"></div>
                </div>
              </div>
              <div class="atlas-scan" aria-hidden="true"></div>
              <div class="atlas-map-controls">
                <button type="button" class="atlas-map-button" data-map-control="zoom-in" aria-label="Zoom in">+</button>
                <button type="button" class="atlas-map-button" data-map-control="zoom-out" aria-label="Zoom out">-</button>
                <button type="button" class="atlas-map-button atlas-map-button--wide" data-map-control="reset">Reset</button>
                <div class="atlas-map-zoom" data-map-zoom>100%</div>
              </div>
              <div class="atlas-map-tooltip" data-map-tooltip hidden></div>
              <div class="atlas-legend">
                <div class="atlas-caption">Interpretation</div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-cyan"></span>
                  <span>Live market-active corridor</span>
                </div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-gold"></span>
                  <span>Secondary notional lane</span>
                </div>
                <div class="atlas-legend-row">
                  <span class="atlas-legend-swatch is-red"></span>
                  <span>Sell-led pressure band</span>
                </div>
              </div>
            </div>
            <div class="atlas-footer">
              <span>Source: Coinbase public WebSocket ticker feed</span>
              <span data-footnote-status>Waiting for market subscription</span>
            </div>
          </div>
        </section>

        <aside class="atlas-sidebar">
          <section class="atlas-card atlas-enter" data-delay="2">
            <div class="atlas-section-title">
              <h3>Top corridors</h3>
              <span>inferred from 1m notional</span>
            </div>
            <div class="atlas-corridors" data-corridors></div>
          </section>

          <section class="atlas-card atlas-enter" data-delay="3">
            <div class="atlas-section-title">
              <h3>Live trade tape</h3>
              <span>recent ticks</span>
            </div>
            <div class="atlas-feed" data-feed></div>
          </section>
        </aside>
      </div>
    </main>
  `}function dt(t){t.innerHTML=ct()}function ut(){s.connectionText=document.querySelector("[data-connection-text]"),s.connectionPill=document.querySelector("[data-connection-pill]"),s.socketState=document.querySelector("[data-socket-state]"),s.footnote=document.querySelector("[data-footnote-status]"),s.chartArea=document.querySelector("[data-chart-area]"),s.chartLine=document.querySelector("[data-chart-line]"),s.chartPrice=document.querySelector("[data-chart-price]"),s.ticksPerMinute=document.querySelector("[data-ticks-per-minute]"),s.heartbeats=document.querySelector("[data-heartbeats]"),s.lastEvent=document.querySelector("[data-last-event]"),s.mapStage=document.querySelector("[data-map-stage]"),s.mapViewport=document.querySelector("[data-map-viewport]"),s.mapZoom=document.querySelector("[data-map-zoom]"),s.mapTooltip=document.querySelector("[data-map-tooltip]"),s.corridors=document.querySelector("[data-corridors]"),s.feed=document.querySelector("[data-feed]");for(const t of["notional-pulse","products-wired","tick-delay","buy-pressure"]){const e=document.querySelector(`[data-metric="${t}"]`),o=document.querySelector(`[data-metric-delta="${t}"]`);e&&s.metricValue.set(t,e),o&&s.metricDelta.set(t,o)}for(const t of p.slice(0,4)){const e=document.querySelector(`[data-quote-value="${t.id}"]`),o=document.querySelector(`[data-quote-delta="${t.id}"]`);e&&s.quoteValue.set(t.id,e),o&&s.quoteDelta.set(t.id,o)}}function pt(){const t=document.querySelector("[data-clock]");if(!t)return;const e=new Date;t.textContent=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",timeZone:"UTC",timeZoneName:"short"}).format(e)}function y(){const t=i.lastMessageAtMs===null?null:Date.now()-i.lastMessageAtMs;let e="Connecting to Coinbase market feed";i.connection==="live"?e=t!==null&&t<5e3?"Live Coinbase ticker stream":"Feed stale, reconnecting":i.connection==="reconnecting"?e="Reconnecting to Coinbase market feed":i.connection==="error"&&(e=i.errorMessage||"Feed connection error"),s.connectionText&&(s.connectionText.textContent=e),s.connectionPill&&(s.connectionPill.dataset.status=i.connection),s.socketState&&(s.socketState.textContent=i.connection==="live"?"Live":i.connection,s.socketState.className=`atlas-status-value atlas-${i.connection==="error"?"negative":i.connection==="live"?"positive":"neutral"}`),s.footnote&&(s.footnote.textContent=i.connection==="live"?`Last market event ${E(t)} ago`:e)}function G(){for(const t of p.slice(0,4)){const e=M.get(t.id),o=s.quoteValue.get(t.id)??null,a=s.quoteDelta.get(t.id)??null;if(!e||!o||!a)continue;o.textContent=e.price===null?"--":T(e.price,t.quoteCurrency);const l=R(e);a.textContent=l===null?"awaiting 24h open":`${L(l)} vs 24h open`,a.className=`atlas-chip-sub atlas-${F(l)}`}}function W(){const t=B(),e=Array.from(M.values()).filter(m=>m.lastTradeAtMs!==null&&Date.now()-m.lastTradeAtMs<Y).length,o=t.reduce((m,x)=>m+x.notionalUsd,0),a=t.length===0?null:t.reduce((m,x)=>m+x.delayMs,0)/t.length,l=t.filter(m=>m.side==="buy").length,n=t.length===0?null:l/t.length*100,c=s.metricValue.get("notional-pulse")??null,d=s.metricDelta.get("notional-pulse")??null,f=s.metricValue.get("products-wired")??null,g=s.metricDelta.get("products-wired")??null,u=s.metricValue.get("tick-delay")??null,b=s.metricDelta.get("tick-delay")??null,h=s.metricValue.get("buy-pressure")??null,C=s.metricDelta.get("buy-pressure")??null;c&&(c.textContent=o===0?"--":k(o)),d&&(d.textContent=t.length===0?"Awaiting live trades":`${t.length} ticks in the last 60 seconds`),f&&(f.textContent=String(e)),g&&(g.textContent=`${e} of ${p.length} products active`),u&&(u.textContent=E(a)),b&&(b.textContent=a===null?"Waiting for timestamps":"Median-quality client delay from trade timestamps"),h&&(h.textContent=n===null?"--":`${n.toFixed(0)}%`,h.className=`atlas-metric-value atlas-${F(n===null?null:n-50)}`),C&&(C.textContent=n===null?"No side data yet":n>=50?`${(n-50).toFixed(1)} pts above neutral`:`${(50-n).toFixed(1)} pts below neutral`)}function q(){const t=B();s.ticksPerMinute&&(s.ticksPerMinute.textContent=String(t.length)),s.heartbeats&&(s.heartbeats.textContent=String(i.heartbeats)),s.lastEvent&&(s.lastEvent.textContent=E(i.lastMessageAtMs===null?null:Date.now()-i.lastMessageAtMs))}function X(){const t=M.get("BTC-USD"),e=s.chartArea,o=s.chartLine,a=s.chartPrice;if(!t||!e||!o||!a)return;const l=rt(t.history),n=`0,110 ${l} 360,110`;if(o.setAttribute("points",l),e.setAttribute("points",n),t.price===null){a.textContent="Waiting for ticks";return}const c=R(t);a.textContent=`${T(t.price,"USD")} ${c===null?"":`(${L(c)})`}`.trim(),a.className=`atlas-${F(c)}`}function _(){const t=s.corridors;if(!t)return;const e=P().slice(0,4),o=e.length===0?1:Math.max(...e.map(a=>a.notionalUsd),1);t.innerHTML=e.length===0?'<div class="atlas-empty">Waiting for live corridor activity.</div>':e.map(a=>{const l=Math.max(a.notionalUsd/o,.08);return`
              <div class="atlas-corridor">
                <div class="atlas-corridor-head">
                  <strong>${a.label}</strong>
                  <span class="atlas-route-label">${k(a.notionalUsd)}</span>
                </div>
                <div class="atlas-corridor-meta">${a.tradeCount} ticks · ${a.hubA} / ${a.hubB}</div>
                <div class="atlas-corridor-bar">
                  <div class="atlas-corridor-fill atlas-${a.tone}" style="width: ${(l*100).toFixed(0)}%"></div>
                </div>
              </div>
            `}).join("")}function Z(){const t=s.feed;if(!t)return;const e=i.trades.slice(0,st);t.innerHTML=e.length===0?'<div class="atlas-empty">Waiting for live trade ticks.</div>':e.map(o=>{const a=$.get(o.productId);return`
              <article class="atlas-feed-item" data-side="${o.side}">
                <div class="atlas-feed-line">
                  <div class="atlas-feed-title">${o.productId} · ${o.hubA} / ${o.hubB}</div>
                  <div class="atlas-feed-time">${it(o.tradeAtMs)}</div>
                </div>
                <div class="atlas-feed-copy">
                  ${o.side==="buy"?"Buy-led":"Sell-led"} tick at
                  ${a?T(o.price,a.quoteCurrency):o.price.toFixed(2)}
                  for ${o.size.toFixed(4)} units.
                </div>
                <div class="atlas-feed-line">
                  <div class="atlas-feed-badge atlas-${o.side==="buy"?"positive":"negative"}">
                    ${o.corridor}
                  </div>
                  <div class="atlas-route-label">${k(o.notionalUsd)}</div>
                </div>
              </article>
            `}).join("")}function O(){const t=P(),e=t.length===0?1:Math.max(...t.map(a=>a.notionalUsd),1),o=new Map(t.map(a=>[a.routeId,a]));for(const a of p){const l=document.getElementById(a.routeId);if(!l)continue;const n=o.get(a.routeId),c=n?Math.max(n.notionalUsd/e,.15):.08;l.style.opacity=String(.2+c*.8),l.setAttribute("stroke-width",`${2.8+c*4.6}`),l.dataset.tone=n?.tone??"neutral"}}function v(){const t=s.mapStage,e=s.mapViewport,o=s.mapZoom;!t||!e||!o||(t.style.transform=`translate(${r.x}px, ${r.y}px) scale(${r.scale})`,e.dataset.dragging=r.dragging?"true":"false",o.textContent=`${Math.round(r.scale*100)}%`)}function I(t,e,o){const a=N(t,1,3.25),l=r.scale;if(a===l)return;const n=(e-r.x)/l,c=(o-r.y)/l;r.scale=a,r.x=e-n*a,r.y=o-c*a,v()}function ft(){r.scale=1,r.x=0,r.y=0,v()}function S(){const t=s.mapTooltip;t&&(D=null,t.hidden=!0)}function A(t,e,o){if(r.dragging){S();return}const a=s.mapTooltip,l=s.mapViewport,n=lt(t);if(!a||!l||!n)return;const c=P().find(U=>U.routeId===t)??null,d=i.trades.find(U=>U.productId===n.id)??null,f=M.get(n.id),g=f?R(f):null;D=t,V=e,z=o,a.hidden=!1,a.dataset.routeId=t,a.innerHTML=`
    <div class="atlas-tooltip-kicker atlas-${c?.tone??"neutral"}">Live corridor</div>
    <div class="atlas-tooltip-title">${n.corridor}</div>
    <div class="atlas-tooltip-grid">
      <div>
        <span>1m notional</span>
        <strong>${c?k(c.notionalUsd):"--"}</strong>
      </div>
      <div>
        <span>Ticks</span>
        <strong>${c?c.tradeCount:0}</strong>
      </div>
      <div>
        <span>Product</span>
        <strong>${n.id}</strong>
      </div>
      <div>
        <span>24h move</span>
        <strong>${L(g)}</strong>
      </div>
    </div>
    <div class="atlas-tooltip-note">
      ${d?`Latest tick ${T(d.price,n.quoteCurrency)} · ${k(d.notionalUsd)}`:"Waiting for a live tick on this corridor"}
    </div>
  `;const u=l.getBoundingClientRect(),b=e-u.left,h=o-u.top,C=a.offsetWidth||260,m=a.offsetHeight||140,x=N(b,C/2+12,u.width-C/2-12),tt=N(h,m+18,u.height-12);a.style.left=`${x}px`,a.style.top=`${tt}px`}function j(){D&&A(D,V,z)}function gt(){const t=document.querySelector("[data-map-viewport]");if(!t||t.dataset.bound==="true"){v();return}t.dataset.bound="true",t.addEventListener("wheel",n=>{n.preventDefault();const c=t.getBoundingClientRect(),d=n.clientX-c.left,f=n.clientY-c.top,g=r.scale*(n.deltaY<0?1.12:.9);I(g,d,f)},{passive:!1}),t.addEventListener("pointerdown",n=>{const c=n.target;n.button!==0||c?.closest("[data-map-control]")||(r.dragging=!0,r.pointerId=n.pointerId,r.dragStartX=n.clientX,r.dragStartY=n.clientY,r.originX=r.x,r.originY=r.y,t.setPointerCapture(n.pointerId),S(),v())}),t.addEventListener("pointermove",n=>{r.dragging&&r.pointerId===n.pointerId&&(r.x=r.originX+(n.clientX-r.dragStartX),r.y=r.originY+(n.clientY-r.dragStartY),v())});const e=n=>{r.pointerId===n.pointerId&&(r.dragging=!1,r.pointerId=null,v())};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e),t.addEventListener("pointerleave",()=>{r.dragging||S()});const o=document.querySelector('[data-map-control="zoom-in"]'),a=document.querySelector('[data-map-control="zoom-out"]'),l=document.querySelector('[data-map-control="reset"]');o?.addEventListener("click",()=>{I(r.scale*1.12,t.clientWidth/2,t.clientHeight/2)}),a?.addEventListener("click",()=>{I(r.scale*.9,t.clientWidth/2,t.clientHeight/2)}),l?.addEventListener("click",()=>{ft()});for(const n of p){const c=document.querySelector(`[data-route-hit="${n.routeId}"]`);!c||c.dataset.bound==="true"||(c.dataset.bound="true",c.addEventListener("pointerenter",d=>{A(n.routeId,d.clientX,d.clientY)}),c.addEventListener("pointermove",d=>{A(n.routeId,d.clientX,d.clientY)}),c.addEventListener("pointerleave",()=>{S()}))}v()}function J(){pt(),y(),G(),W(),q(),X(),_(),Z(),O(),j(),v()}function mt(){G(),W(),q(),X(),_(),Z(),O(),j()}function vt(t){const e=typeof t.product_id=="string"?t.product_id:null;if(!e||!$.has(e))return;const o=$.get(e),a=M.get(e),l=w(t.price),n=w(t.open_24h),c=w(t.volume_24h),d=w(t.last_size)??0,f=typeof t.time=="string"?t.time:"",g=t.side==="buy"||t.side==="sell"?t.side:null,u=f?Date.parse(f):Date.now();if(!o||!a||l===null||!g||!Number.isFinite(u))return;a.price=l,a.open24h=n,a.volume24h=c,a.lastSize=d,a.side=g,a.lastTradeAtMs=u,a.lastDelayMs=Math.max(Date.now()-u,0),a.history.push(l),a.history.length>ot&&a.history.shift();const b=o.quoteCurrency==="EUR"?1.09:1,h=Math.max(l*d*b,0);i.trades.unshift({id:`${e}-${u}-${t.trade_id??Math.random().toString(16).slice(2)}`,productId:e,corridor:o.corridor,hubA:o.hubA,hubB:o.hubB,price:l,side:g,notionalUsd:h,size:d,tradeAtMs:u,delayMs:a.lastDelayMs??0}),i.trades.length>120&&(i.trades.length=120)}function H(){i.reconnectTimer===null&&(i.connection="reconnecting",i.reconnectCount+=1,i.reconnectTimer=window.setTimeout(()=>{i.reconnectTimer=null,Q()},at))}function Q(){i.socket&&i.socket.close(),i.connection="connecting",i.errorMessage="";const t=new WebSocket(et);i.socket=t,t.addEventListener("open",()=>{i.connection="live";const e={type:"subscribe",product_ids:p.map(o=>o.id),channels:["heartbeat","ticker"]};t.send(JSON.stringify(e)),y(),q()}),t.addEventListener("message",e=>{i.lastMessageAtMs=Date.now();const o=typeof e.data=="string"?e.data:"";if(!o)return;let a;try{a=JSON.parse(o)}catch{return}const l=typeof a.type=="string"?a.type:"";l==="heartbeat"?(i.heartbeats+=1,i.lastHeartbeatAtMs=Date.now(),y(),q()):l==="ticker"?(vt(a),y(),mt()):l==="error"&&(i.connection="error",i.errorMessage=typeof a.message=="string"?a.message:"Coinbase feed error",H(),y())}),t.addEventListener("error",()=>{i.connection="error",i.errorMessage="Unable to reach Coinbase market feed",y()}),t.addEventListener("close",()=>{i.socket===t&&(i.socket=null),H(),y()})}const K=document.querySelector("#app");if(!K)throw new Error("World data dashboard root element not found.");dt(K);ut();gt();J();Q();window.setInterval(J,1e3);
//# sourceMappingURL=world-data-D56hHxgX.js.map

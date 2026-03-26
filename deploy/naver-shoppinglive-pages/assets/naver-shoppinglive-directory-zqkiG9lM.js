import"./modulepreload-polyfill-B5Qt9EMX.js";const w=[{code:"all",name:"전체 카테고리"},{code:"dc:1",name:"뷰티"},{code:"dc:2",name:"푸드"},{code:"dc:3",name:"패션"},{code:"dc:4",name:"라이프"},{code:"dc:5",name:"여행/체험"},{code:"dc:6",name:"키즈"},{code:"dc:7",name:"테크"},{code:"dc:8",name:"취미레저"},{code:"dc:9",name:"문화생활"}],P="./data/naver-shoppinglive-seller-directory-latest.json",E="naver-shoppinglive-directory:completed",j=[25,50,100],e={payload:null,filteredRows:[],pagedRows:[],categories:[],crawlHealth:null,crawlAvailable:!1,crawlChecking:!0,crawlSubmitting:!1,resetSubmitting:!1,crawlScope:"all",crawlTargetRowsPerCategory:50,filters:{query:"",category:"all",missingOnly:!1,collectionStatus:"all",sort:"replay_desc"},sourceLabel:"번들 스냅샷",celebrateVisible:!1,celebrateRunId:0,pendingCompletionCelebrate:!1,lastSeenFinishedAt:"",completedKeys:new Set,page:1,pageSize:25},c={app:document.querySelector("#app")};let p=null,H=null;function F(t){return t.replace(/\s+/g," ").trim()}function i(t){return new Intl.NumberFormat("ko-KR").format(t)}function A(t){if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?t:new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(a)}function I(t){const a=Math.max(0,Math.round(t)),s=Math.floor(a/60),n=a%60;return s===0?`${n}초`:n===0?`${s}분`:`${s}분 ${n}초`}function K(t){return[...t.rows]}function b(t){return[t.category,t.market_name,t.replay_url,t.store_url,t.profile_url,t.crawled_at].join("|")}function D(){try{const t=window.localStorage.getItem(E);if(!t)return;const a=JSON.parse(t);e.completedKeys=new Set(a.filter(Boolean))}catch{e.completedKeys=new Set}}function x(){window.localStorage.setItem(E,JSON.stringify([...e.completedKeys.values()]))}function $(t){return e.completedKeys.has(b(t))}function z(t,a){const s=b(t);a?e.completedKeys.add(s):e.completedKeys.delete(s),x(),m()}function V(t,a){return a?Math.max(1,Math.min(t,a)):1}function L(t){if(!t.length)return"";const a=Object.keys(t[0]),s=n=>{const r=String(n);return/[",\n]/.test(r)?`"${r.replaceAll('"','""')}"`:r};return[a.join(","),...t.map(n=>a.map(r=>s(n[r])).join(","))].join(`
`)}function q(t,a){const s=new Blob([a],{type:"text/csv;charset=utf-8"}),n=URL.createObjectURL(s),r=document.createElement("a");r.href=n,r.download=t,r.click(),URL.revokeObjectURL(n)}function m(){if(!e.payload){e.filteredRows=[],e.pagedRows=[],u();return}const t=F(e.filters.query).toLowerCase();let a=K(e.payload);e.filters.category!=="all"&&(a=a.filter(r=>r.category===e.filters.category)),t&&(a=a.filter(r=>[r.category,r.market_name,r.seller_name,r.business_name,r.shoppinglive_seller_name,r.replay_title].join(" ").toLowerCase().includes(t))),e.filters.missingOnly&&(a=a.filter(r=>!r.seller_name||!r.business_name)),e.filters.collectionStatus!=="all"&&(a=a.filter(r=>e.filters.collectionStatus==="done"?$(r):!$(r))),a.sort((r,d)=>e.filters.sort==="market_asc"?r.market_name.localeCompare(d.market_name,"ko"):e.filters.sort==="crawled_desc"?Date.parse(d.crawled_at)-Date.parse(r.crawled_at):d.replay_views-r.replay_views),e.filteredRows=a;const s=Math.max(1,Math.ceil(a.length/e.pageSize));e.page=V(e.page,s);const n=(e.page-1)*e.pageSize;e.pagedRows=a.slice(n,n+e.pageSize),u()}async function S(){const t=await fetch(P,{cache:"no-store"});if(!t.ok)throw new Error(`Failed to load bundled data: ${t.status}`);const a=await t.json();R(a,"번들 스냅샷")}async function C(){const t=e.crawlHealth;try{const a=await fetch("./api/health",{cache:"no-store"});if(!a.ok)throw new Error(`health ${a.status}`);e.crawlHealth=await a.json(),e.crawlAvailable=!!e.crawlHealth.crawlEnabled,Z(t,e.crawlHealth)}catch{e.crawlHealth=null,e.crawlAvailable=!1}finally{e.crawlChecking=!1,u()}}async function B(){if(!(!e.crawlAvailable||e.crawlSubmitting)){e.crawlSubmitting=!0,e.pendingCompletionCelebrate=!0,u();try{await G();const t=await fetch("./api/crawl",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({categories:e.crawlScope==="all"?[]:[e.crawlScope],targetRowsPerCategory:e.crawlTargetRowsPerCategory})});if(!t.ok)throw new Error(`crawl ${t.status}`);await C(),J()}catch{e.crawlHealth={...e.crawlHealth??{},lastError:"크롤링 요청에 실패했습니다."}}finally{e.crawlSubmitting=!1,u()}}}async function U(){if(!(e.resetSubmitting||e.crawlHealth?.running||!window.confirm("현재 누적된 크롤링 데이터와 수집 완료 체크를 초기화합니다. 계속할까요?"))){e.resetSubmitting=!0,u();try{const a=await fetch("./api/reset-data",{method:"POST"});if(!a.ok)throw new Error(`reset ${a.status}`);e.completedKeys=new Set,x(),e.page=1,await S().catch(()=>{R({rows:[]},"번들 스냅샷")}),await C()}catch{e.crawlHealth={...e.crawlHealth??{},lastError:"데이터 소스 초기화에 실패했습니다."}}finally{e.resetSubmitting=!1,u()}}}function J(){const t=async()=>{if(await C(),e.crawlHealth?.running){window.setTimeout(()=>{t()},2500);return}await S().catch(()=>{})};t()}async function G(){const t=window.AudioContext??window.webkitAudioContext;t&&(p||(p=new t),p.state==="suspended"&&await p.resume())}function Y(){if(!p||p.state!=="running")return;const t=p.currentTime,a=[659.25,783.99,987.77];for(const[s,n]of a.entries()){const r=p.createOscillator(),d=p.createGain();r.type="triangle",r.frequency.value=n,d.gain.setValueAtTime(1e-4,t+s*.14),d.gain.exponentialRampToValueAtTime(.12,t+s*.14+.02),d.gain.exponentialRampToValueAtTime(1e-4,t+s*.14+.22),r.connect(d),d.connect(p.destination),r.start(t+s*.14),r.stop(t+s*.14+.24)}}function W(){e.celebrateRunId+=1,e.celebrateVisible=!0,Y(),H!=null&&window.clearTimeout(H),H=window.setTimeout(()=>{e.celebrateVisible=!1,u()},3200),u()}function Z(t,a){const s=a?.lastFinishedAt??"",n=!!t?.running,r=!!a?.running,d=e.pendingCompletionCelebrate&&!!s&&s!==e.lastSeenFinishedAt&&(n||!r&&t?.lastFinishedAt!==s);e.lastSeenFinishedAt=s||e.lastSeenFinishedAt,d&&(e.pendingCompletionCelebrate=!1,W())}function Q(){if(!e.filteredRows.length)return;const t=new Date().toISOString().slice(0,19).replaceAll(":","-");q(`naver-shoppinglive-seller-directory-${t}.csv`,L(e.filteredRows))}function X(){if(!e.payload?.rows.length)return;const t=new Date().toISOString().slice(0,19).replaceAll(":","-");q(`naver-shoppinglive-seller-directory-all-${t}.csv`,L(e.payload.rows))}function R(t,a){e.payload=t,e.categories=[...new Set(t.rows.map(s=>s.category))].sort((s,n)=>s.localeCompare(n,"ko")),e.sourceLabel=a,m()}async function ee(t){const a=t.currentTarget,s=a?.files?.[0];if(!s)return;const n=await s.text(),r=JSON.parse(n);R(r,`업로드: ${s.name}`),a&&(a.value="")}function f(t,a){e.filters[t]=a,e.page=1,m()}function te(){const t=e.payload?.rows??[];return{total:t.length,categories:new Set(t.map(a=>a.category)).size,missing:t.filter(a=>!a.seller_name||!a.business_name).length,completed:t.filter(a=>$(a)).length,lastAddedRows:e.crawlHealth?.lastAddedRows??0,generatedAt:e.payload?.generatedAt??t[0]?.crawled_at??""}}function ae(){if(e.crawlChecking)return"크롤링 API 확인 중";if(!e.crawlAvailable)return"정적 공개본에서는 크롤링 실행이 비활성화됩니다. 로컬 실행기에서 연 페이지에서만 사용할 수 있습니다.";if(e.crawlHealth?.running){const t=e.crawlHealth.completedCategories??0,a=e.crawlHealth.totalCategories??0,s=e.crawlHealth.currentCategoryName?` · ${e.crawlHealth.currentCategoryName}`:"",n=e.crawlHealth.lastMessage?` · ${e.crawlHealth.lastMessage}`:"";return`크롤링 실행 중 ${t}/${a}${s}${n}`}if(e.crawlHealth?.lastError)return`최근 오류 · ${e.crawlHealth.lastError}`;if(e.crawlHealth?.lastFinishedAt){const t=typeof e.crawlHealth.lastAddedRows=="number"?` · 이번 실행 신규 ${i(e.crawlHealth.lastAddedRows)}행`:"";return`마지막 실행 완료 · ${A(e.crawlHealth.lastFinishedAt)}${t}`}return"크롤링 준비 완료"}function le(){const t=e.crawlHealth?.totalCategories??0,a=e.crawlHealth?.completedCategories??0;return t?Math.max(0,Math.min(1,a/t)):0}function k(){return e.crawlScope==="all"?w.filter(t=>t.code!=="all").map(t=>t.code):[e.crawlScope]}function se(t){return w.find(a=>a.code===t)?.name??t}function re(){const t=new Map,a=new Map(w.filter(s=>s.code!=="all").map(s=>[s.name,s.code]));for(const s of e.payload?.rows??[]){const n=a.get(s.category);n&&t.set(n,(t.get(n)??0)+1)}return t}function O(){return e.crawlHealth?.running?Math.max(1,e.crawlHealth.activeTargetRowsPerCategory??e.crawlTargetRowsPerCategory):e.crawlTargetRowsPerCategory}function M(){const t=re(),a=e.crawlHealth?.running&&e.crawlHealth.activeCategoryCodes?.length?e.crawlHealth.activeCategoryCodes:k(),s=O(),n=a.reduce((r,d)=>{const h=t.get(d)??0;return r+Math.max(0,s-h)},0);return a.length*12+n*5}function ne(){const t=M();if(!e.crawlHealth?.running)return t;const a=e.crawlHealth.totalCategories??0,s=e.crawlHealth.completedCategories??0;if(!a)return t;const n=Math.max(0,1-s/a);return t*n}function oe(){if(!(e.crawlHealth?.running&&e.crawlHealth.activeCategoryCodes?.length?e.crawlHealth.activeCategoryCodes:k()).length)return"예상 소요 시간 계산 중";const a=e.crawlHealth?.running?ne():M();return`${e.crawlHealth?.running?"예상 잔여 시간":"예상 소요 시간"} · ${I(a)}`}function ce(){const t=e.crawlHealth?.running&&e.crawlHealth.activeCategoryCodes?.length?e.crawlHealth.activeCategoryCodes:k();return`크롤링 계획 · ${t.length===w.length-1?"전체 카테고리":t.map(s=>se(s)).join(", ")} · 카테고리당 ${i(O())}개`}function u(){if(!c.app)return;const t=te(),a=e.pagedRows,s=e.filteredRows.length,n=Math.max(1,Math.ceil(s/e.pageSize)),r=s?(e.page-1)*e.pageSize+1:0,d=s?Math.min(s,e.page*e.pageSize):0,h=e.crawlHealth?.lastCategoryResults??[],N=Array.from({length:18},(l,g)=>{const y=g*91%100,_=(g%6*.06).toFixed(2),v=(1.6+g%5*.18).toFixed(2);return`<span class="seller-confetti seller-confetti-${["accent","warm","ink"][g%3]}" style="left:${y}%;animation-delay:${_}s;animation-duration:${v}s"></span>`}).join("");c.app.innerHTML=`
    <div class="seller-shell">
      ${e.celebrateVisible?`
            <div class="seller-celebrate-layer" data-run="${e.celebrateRunId}">
              <div class="seller-celebrate-glow"></div>
              <div class="seller-celebrate-badge">
                <strong>크롤링 완료</strong>
                <span>최신 결과를 반영했습니다.</span>
              </div>
              <div class="seller-confetti-field">${N}</div>
            </div>
          `:""}
      <section class="seller-hero">
        <div class="seller-kicker">Naver Shopping Live Directory</div>
        <h1 class="seller-title">네이버 쇼핑라이브 셀러 디렉터리</h1>
        <p class="seller-subtitle">
          카테고리별 셀러 결과를 공용으로 탐색하는 정적 페이지입니다. 최신 번들 스냅샷을 바로 읽고,
          필요하면 JSON 파일을 업로드해서 같은 화면에서 검토할 수 있습니다.
        </p>
        <div class="seller-actions">
          <button class="seller-button" data-action="reload" data-tone="accent">번들 다시 불러오기</button>
          <button class="seller-button" data-action="reset-data"${e.crawlHealth?.running||e.resetSubmitting?" disabled":""}>
            ${e.resetSubmitting?"초기화 중":"데이터 소스 초기화"}
          </button>
          <div class="seller-crawl-controls">
            <select id="seller-crawl-scope" class="seller-select seller-crawl-select"${e.crawlAvailable?"":" disabled"}>
              ${w.map(l=>`<option value="${l.code}"${e.crawlScope===l.code?" selected":""}>${o(l.name)}</option>`).join("")}
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
              value="${o(String(e.crawlTargetRowsPerCategory))}"
              ${e.crawlAvailable&&!e.crawlHealth?.running?"":" disabled"}
            />
          </div>
          <button class="seller-button" data-action="crawl"${e.crawlAvailable&&!e.crawlHealth?.running&&!e.crawlSubmitting?"":" disabled"}>
            ${e.crawlHealth?.running?"크롤링 실행 중":e.crawlSubmitting?"요청 중":"크롤링 실행"}
          </button>
          <button class="seller-button" data-action="csv-all"${e.payload?.rows.length?"":" disabled"}>
            전체 CSV 저장
          </button>
          <button class="seller-button" data-action="csv"${e.filteredRows.length?"":" disabled"}>
            현재 필터 CSV 저장
          </button>
          <label class="seller-file-label">
            JSON 업로드
            <input type="file" accept=".json,application/json" data-action="upload" />
          </label>
        </div>
        <div class="seller-status-strip">${o(ae())}</div>
        <div class="seller-status-strip seller-status-secondary">
          ${o(ce())}
          · ${o(oe())}
        </div>
        <div class="seller-progress-track">
          <div class="seller-progress-bar" style="width:${Math.round(le()*100)}%"></div>
        </div>
        ${h.length?`
              <section class="seller-panel seller-run-summary">
                <div class="seller-run-summary-head">이번 실행 결과</div>
                <div class="seller-run-summary-list">
                  ${h.map(l=>`
                        <article class="seller-run-item">
                          <strong>${o(l.categoryName)}</strong>
                          <span>${o(l.reason)}</span>
                          <span>신규 ${i(l.addedRows)}행 · 기존 ${i(l.existingRows)}행 · 시드 ${i(l.replaySeeds)}개</span>
                        </article>
                      `).join("")}
                </div>
              </section>
            `:""}
      </section>

      <section class="seller-grid">
        <div class="seller-stats">
          <article class="seller-stat">
            <span class="seller-stat-label">총 행 수</span>
            <strong class="seller-stat-value">${i(t.total)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">카테고리 수</span>
            <strong class="seller-stat-value">${i(t.categories)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">정보 미완성 행</span>
            <strong class="seller-stat-value">${i(t.missing)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">수집 완료 체크</span>
            <strong class="seller-stat-value">${i(t.completed)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">이번 실행 신규 행</span>
            <strong class="seller-stat-value">${i(t.lastAddedRows)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">기준 시각</span>
            <strong class="seller-stat-value" style="font-size:1rem;">${A(t.generatedAt)}</strong>
          </article>
        </div>

        <section class="seller-panel seller-filter-shell">
          <div class="seller-filters">
            <div class="seller-field">
              <label for="seller-query">검색</label>
              <input id="seller-query" class="seller-input" type="search" placeholder="마켓 이름, 판매자 이름, 상호명, 방송 제목" value="${o(e.filters.query)}" />
            </div>
            <div class="seller-field">
              <label for="seller-category">카테고리</label>
              <select id="seller-category" class="seller-select">
                <option value="all"${e.filters.category==="all"?" selected":""}>전체</option>
                ${e.categories.map(l=>`<option value="${o(l)}"${e.filters.category===l?" selected":""}>${o(l)}</option>`).join("")}
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-sort">정렬</label>
              <select id="seller-sort" class="seller-select">
                <option value="replay_desc"${e.filters.sort==="replay_desc"?" selected":""}>조회수 높은순</option>
                <option value="market_asc"${e.filters.sort==="market_asc"?" selected":""}>마켓 이름순</option>
                <option value="crawled_desc"${e.filters.sort==="crawled_desc"?" selected":""}>크롤링 최신순</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-missing">정보 필터</label>
              <select id="seller-missing" class="seller-select">
                <option value="all"${e.filters.missingOnly?"":" selected"}>전체</option>
                <option value="missing"${e.filters.missingOnly?" selected":""}>빈 정보만</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-collection-status">수집 체크</label>
              <select id="seller-collection-status" class="seller-select">
                <option value="all"${e.filters.collectionStatus==="all"?" selected":""}>전체</option>
                <option value="done"${e.filters.collectionStatus==="done"?" selected":""}>완료만</option>
                <option value="pending"${e.filters.collectionStatus==="pending"?" selected":""}>미완료만</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-page-size">페이지 크기</label>
              <select id="seller-page-size" class="seller-select">
                ${j.map(l=>`<option value="${l}"${e.pageSize===l?" selected":""}>${l}행</option>`).join("")}
              </select>
            </div>
          </div>
        </section>

        <section class="seller-panel seller-table-shell">
          <div class="seller-table-meta">
            <div class="seller-meta-note">데이터 소스: ${o(e.sourceLabel)}</div>
            <div class="seller-badge">현재 ${i(r)}-${i(d)} / ${i(s)}행</div>
          </div>
          <div class="seller-pagination">
            <button class="seller-button seller-page-button" data-action="page-prev"${e.page<=1?" disabled":""}>이전</button>
            <div class="seller-page-label">페이지 ${i(e.page)} / ${i(n)}</div>
            <button class="seller-button seller-page-button" data-action="page-next"${e.page>=n?" disabled":""}>다음</button>
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
                ${a.length?a.map(l=>`
                            <tr>
                              <td>
                                <input class="seller-row-check" type="checkbox" data-action="toggle-row" data-row-key="${o(b(l))}"${$(l)?" checked":""} />
                              </td>
                              <td>${o(l.category)}</td>
                              <td>${o(l.market_name)}</td>
                              <td>${l.seller_name?o(l.seller_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${l.business_name?o(l.business_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${o(l.shoppinglive_seller_name)}</td>
                              <td>${i(l.replay_views)}</td>
                              <td>${o(A(l.crawled_at))}</td>
                              <td>
                                ${l.replay_url?`<a class="seller-link" href="${o(l.replay_url)}" target="_blank" rel="noreferrer">방송</a>`:""}
                                ${l.store_url?` · <a class="seller-link" href="${o(l.store_url)}" target="_blank" rel="noreferrer">스토어</a>`:""}
                                ${l.profile_url?` · <a class="seller-link" href="${o(l.profile_url)}" target="_blank" rel="noreferrer">프로필</a>`:""}
                              </td>
                            </tr>
                          `).join(""):'<tr><td colspan="9">표시할 데이터가 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <div class="seller-foot">
          GitHub Pages 공개본은 조회 전용입니다. 로컬 실행기로 연 페이지에서는 크롤링 실행과 CSV 저장이 가능합니다.
        </div>
      </section>
    </div>
  `,c.app.querySelector('[data-action="reload"]')?.addEventListener("click",()=>{S()}),c.app.querySelector('[data-action="reset-data"]')?.addEventListener("click",()=>{U()}),c.app.querySelector('[data-action="upload"]')?.addEventListener("change",l=>{ee(l)}),c.app.querySelector('[data-action="crawl"]')?.addEventListener("click",()=>{B()}),c.app.querySelector('[data-action="csv-all"]')?.addEventListener("click",()=>{X()}),c.app.querySelector('[data-action="csv"]')?.addEventListener("click",()=>{Q()}),c.app.querySelector("#seller-crawl-scope")?.addEventListener("change",l=>{e.crawlScope=l.currentTarget.value,u()}),c.app.querySelector("#seller-crawl-target")?.addEventListener("change",l=>{const g=Number.parseInt(l.currentTarget.value,10)||50;e.crawlTargetRowsPerCategory=Math.max(1,Math.min(200,g)),u()}),c.app.querySelector("#seller-query")?.addEventListener("input",l=>{f("query",l.currentTarget.value)}),c.app.querySelector("#seller-category")?.addEventListener("change",l=>{f("category",l.currentTarget.value)}),c.app.querySelector("#seller-sort")?.addEventListener("change",l=>{f("sort",l.currentTarget.value)}),c.app.querySelector("#seller-missing")?.addEventListener("change",l=>{f("missingOnly",l.currentTarget.value==="missing")}),c.app.querySelector("#seller-collection-status")?.addEventListener("change",l=>{f("collectionStatus",l.currentTarget.value)}),c.app.querySelector("#seller-page-size")?.addEventListener("change",l=>{e.pageSize=Number.parseInt(l.currentTarget.value,10)||25,e.page=1,m()}),c.app.querySelector('[data-action="page-prev"]')?.addEventListener("click",()=>{e.page=Math.max(1,e.page-1),m()}),c.app.querySelector('[data-action="page-next"]')?.addEventListener("click",()=>{e.page=Math.min(n,e.page+1),m()}),c.app.querySelectorAll('[data-action="toggle-row"]').forEach(l=>{l.addEventListener("change",g=>{const y=g.currentTarget,_=y.dataset.rowKey??"",v=e.payload?.rows.find(T=>b(T)===_);v&&z(v,y.checked)})})}function o(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}D();S().catch(()=>{R({rows:[]},"번들 없음")}).finally(()=>{u()});C();
//# sourceMappingURL=naver-shoppinglive-directory-zqkiG9lM.js.map

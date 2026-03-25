import"./modulepreload-polyfill-B5Qt9EMX.js";const m="./data/naver-shoppinglive-seller-directory-latest.json",l={payload:null,filteredRows:[],categories:[],crawlHealth:null,crawlAvailable:!1,crawlChecking:!0,crawlSubmitting:!1,filters:{query:"",category:"all",missingOnly:!1,sort:"replay_desc"},sourceLabel:"번들 스냅샷"},i={app:document.querySelector("#app")};function v(t){return t.replace(/\s+/g," ").trim()}function o(t){return new Intl.NumberFormat("ko-KR").format(t)}function u(t){if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?t:new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(a)}function y(t){return[...t.rows]}function b(t){if(!t.length)return"";const a=Object.keys(t[0]),e=s=>{const n=String(s);return/[",\n]/.test(n)?`"${n.replaceAll('"','""')}"`:n};return[a.join(","),...t.map(s=>a.map(n=>e(s[n])).join(","))].join(`
`)}function w(t,a){const e=new Blob([a],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(e),n=document.createElement("a");n.href=s,n.download=t,n.click(),URL.revokeObjectURL(s)}function h(){if(!l.payload){l.filteredRows=[],c();return}const t=v(l.filters.query).toLowerCase();let a=y(l.payload);l.filters.category!=="all"&&(a=a.filter(e=>e.category===l.filters.category)),t&&(a=a.filter(e=>[e.category,e.market_name,e.seller_name,e.business_name,e.shoppinglive_seller_name,e.replay_title].join(" ").toLowerCase().includes(t))),l.filters.missingOnly&&(a=a.filter(e=>!e.seller_name||!e.business_name)),a.sort((e,s)=>l.filters.sort==="market_asc"?e.market_name.localeCompare(s.market_name,"ko"):l.filters.sort==="crawled_desc"?Date.parse(s.crawled_at)-Date.parse(e.crawled_at):s.replay_views-e.replay_views),l.filteredRows=a,c()}async function p(){const t=await fetch(m,{cache:"no-store"});if(!t.ok)throw new Error(`Failed to load bundled data: ${t.status}`);const a=await t.json();g(a,"번들 스냅샷")}async function f(){try{const t=await fetch("./api/health",{cache:"no-store"});if(!t.ok)throw new Error(`health ${t.status}`);l.crawlHealth=await t.json(),l.crawlAvailable=!!l.crawlHealth.crawlEnabled}catch{l.crawlHealth=null,l.crawlAvailable=!1}finally{l.crawlChecking=!1,c()}}async function _(){if(!(!l.crawlAvailable||l.crawlSubmitting)){l.crawlSubmitting=!0,c();try{const t=await fetch("./api/crawl",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({})});if(!t.ok)throw new Error(`crawl ${t.status}`);await f(),$()}catch{l.crawlHealth={...l.crawlHealth??{},lastError:"크롤링 요청에 실패했습니다."}}finally{l.crawlSubmitting=!1,c()}}}function $(){const t=async()=>{if(await f(),l.crawlHealth?.running){window.setTimeout(()=>{t()},2500);return}await p().catch(()=>{})};t()}function k(){if(!l.filteredRows.length)return;const t=new Date().toISOString().slice(0,19).replaceAll(":","-");w(`naver-shoppinglive-seller-directory-${t}.csv`,b(l.filteredRows))}function g(t,a){l.payload=t,l.categories=[...new Set(t.rows.map(e=>e.category))].sort((e,s)=>e.localeCompare(s,"ko")),l.sourceLabel=a,h()}async function S(t){const a=t.currentTarget,e=a?.files?.[0];if(!e)return;const s=await e.text(),n=JSON.parse(s);g(n,`업로드: ${e.name}`),a&&(a.value="")}function d(t,a){l.filters[t]=a,h()}function A(){const t=l.payload?.rows??[];return{total:t.length,categories:new Set(t.map(a=>a.category)).size,missing:t.filter(a=>!a.seller_name||!a.business_name).length,generatedAt:l.payload?.generatedAt??t[0]?.crawled_at??""}}function L(){return l.crawlChecking?"크롤링 API 확인 중":l.crawlAvailable?l.crawlHealth?.running?`크롤링 실행 중 · 시작 ${u(l.crawlHealth.lastStartedAt??"")}`:l.crawlHealth?.lastError?`최근 오류 · ${l.crawlHealth.lastError}`:l.crawlHealth?.lastFinishedAt?`마지막 실행 완료 · ${u(l.crawlHealth.lastFinishedAt)}`:"크롤링 준비 완료":"정적 공개본에서는 크롤링 실행이 비활성화됩니다. 로컬 실행기에서 연 페이지에서만 사용할 수 있습니다."}function c(){if(!i.app)return;const t=A(),a=l.filteredRows;i.app.innerHTML=`
    <div class="seller-shell">
      <section class="seller-hero">
        <div class="seller-kicker">Naver Shopping Live Directory</div>
        <h1 class="seller-title">네이버 쇼핑라이브 셀러 디렉터리</h1>
        <p class="seller-subtitle">
          카테고리별 셀러 결과를 공용으로 탐색하는 정적 페이지입니다. 최신 번들 스냅샷을 바로 읽고,
          필요하면 JSON 파일을 업로드해서 같은 화면에서 검토할 수 있습니다.
        </p>
        <div class="seller-actions">
          <button class="seller-button" data-action="reload" data-tone="accent">번들 다시 불러오기</button>
          <button class="seller-button" data-action="crawl"${l.crawlAvailable&&!l.crawlHealth?.running&&!l.crawlSubmitting?"":" disabled"}>
            ${l.crawlHealth?.running?"크롤링 실행 중":l.crawlSubmitting?"요청 중":"크롤링 실행"}
          </button>
          <button class="seller-button" data-action="csv"${l.filteredRows.length?"":" disabled"}>
            현재 필터 CSV 저장
          </button>
          <label class="seller-file-label">
            JSON 업로드
            <input type="file" accept=".json,application/json" data-action="upload" />
          </label>
        </div>
        <div class="seller-status-strip">${r(L())}</div>
      </section>

      <section class="seller-grid">
        <div class="seller-stats">
          <article class="seller-stat">
            <span class="seller-stat-label">총 행 수</span>
            <strong class="seller-stat-value">${o(t.total)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">카테고리 수</span>
            <strong class="seller-stat-value">${o(t.categories)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">정보 미완성 행</span>
            <strong class="seller-stat-value">${o(t.missing)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">기준 시각</span>
            <strong class="seller-stat-value" style="font-size:1rem;">${u(t.generatedAt)}</strong>
          </article>
        </div>

        <section class="seller-panel seller-filter-shell">
          <div class="seller-filters">
            <div class="seller-field">
              <label for="seller-query">검색</label>
              <input id="seller-query" class="seller-input" type="search" placeholder="마켓 이름, 판매자 이름, 상호명, 방송 제목" value="${r(l.filters.query)}" />
            </div>
            <div class="seller-field">
              <label for="seller-category">카테고리</label>
              <select id="seller-category" class="seller-select">
                <option value="all"${l.filters.category==="all"?" selected":""}>전체</option>
                ${l.categories.map(e=>`<option value="${r(e)}"${l.filters.category===e?" selected":""}>${r(e)}</option>`).join("")}
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-sort">정렬</label>
              <select id="seller-sort" class="seller-select">
                <option value="replay_desc"${l.filters.sort==="replay_desc"?" selected":""}>조회수 높은순</option>
                <option value="market_asc"${l.filters.sort==="market_asc"?" selected":""}>마켓 이름순</option>
                <option value="crawled_desc"${l.filters.sort==="crawled_desc"?" selected":""}>크롤링 최신순</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-missing">정보 필터</label>
              <select id="seller-missing" class="seller-select">
                <option value="all"${l.filters.missingOnly?"":" selected"}>전체</option>
                <option value="missing"${l.filters.missingOnly?" selected":""}>빈 정보만</option>
              </select>
            </div>
          </div>
        </section>

        <section class="seller-panel seller-table-shell">
          <div class="seller-table-meta">
            <div class="seller-meta-note">데이터 소스: ${r(l.sourceLabel)}</div>
            <div class="seller-badge">현재 ${o(a.length)}행 표시</div>
          </div>
          <div class="seller-table-wrap">
            <table class="seller-table">
              <thead>
                <tr>
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
                ${a.length?a.map(e=>`
                            <tr>
                              <td>${r(e.category)}</td>
                              <td>${r(e.market_name)}</td>
                              <td>${e.seller_name?r(e.seller_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${e.business_name?r(e.business_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${r(e.shoppinglive_seller_name)}</td>
                              <td>${o(e.replay_views)}</td>
                              <td>${r(u(e.crawled_at))}</td>
                              <td>
                                ${e.replay_url?`<a class="seller-link" href="${r(e.replay_url)}" target="_blank" rel="noreferrer">방송</a>`:""}
                                ${e.store_url?` · <a class="seller-link" href="${r(e.store_url)}" target="_blank" rel="noreferrer">스토어</a>`:""}
                                ${e.profile_url?` · <a class="seller-link" href="${r(e.profile_url)}" target="_blank" rel="noreferrer">프로필</a>`:""}
                              </td>
                            </tr>
                          `).join(""):'<tr><td colspan="8">표시할 데이터가 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <div class="seller-foot">
          GitHub Pages 공개본은 조회 전용입니다. 로컬 실행기로 연 페이지에서는 크롤링 실행과 CSV 저장이 가능합니다.
        </div>
      </section>
    </div>
  `,i.app.querySelector('[data-action="reload"]')?.addEventListener("click",()=>{p()}),i.app.querySelector('[data-action="upload"]')?.addEventListener("change",e=>{S(e)}),i.app.querySelector('[data-action="crawl"]')?.addEventListener("click",()=>{_()}),i.app.querySelector('[data-action="csv"]')?.addEventListener("click",()=>{k()}),i.app.querySelector("#seller-query")?.addEventListener("input",e=>{d("query",e.currentTarget.value)}),i.app.querySelector("#seller-category")?.addEventListener("change",e=>{d("category",e.currentTarget.value)}),i.app.querySelector("#seller-sort")?.addEventListener("change",e=>{d("sort",e.currentTarget.value)}),i.app.querySelector("#seller-missing")?.addEventListener("change",e=>{d("missingOnly",e.currentTarget.value==="missing")})}function r(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}p().catch(()=>{g({rows:[]},"번들 없음")}).finally(()=>{c()});f();
//# sourceMappingURL=naver-shoppinglive-directory-eQTDpfcb.js.map

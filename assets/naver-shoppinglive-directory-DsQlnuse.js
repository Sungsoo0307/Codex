import"./modulepreload-polyfill-B5Qt9EMX.js";const w=[{code:"all",name:"전체 카테고리"},{code:"dc:1",name:"뷰티"},{code:"dc:2",name:"푸드"},{code:"dc:3",name:"패션"},{code:"dc:4",name:"라이프"},{code:"dc:5",name:"여행/체험"},{code:"dc:6",name:"키즈"},{code:"dc:7",name:"테크"},{code:"dc:8",name:"취미레저"},{code:"dc:9",name:"문화생활"}],y="./data/naver-shoppinglive-seller-directory-latest.json",e={payload:null,filteredRows:[],categories:[],crawlHealth:null,crawlAvailable:!1,crawlChecking:!0,crawlSubmitting:!1,crawlScope:"all",filters:{query:"",category:"all",missingOnly:!1,sort:"replay_desc"},sourceLabel:"번들 스냅샷"},n={app:document.querySelector("#app")};function b(t){return t.replace(/\s+/g," ").trim()}function o(t){return new Intl.NumberFormat("ko-KR").format(t)}function u(t){if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?t:new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(a)}function $(t){return[...t.rows]}function m(t){if(!t.length)return"";const a=Object.keys(t[0]),l=s=>{const c=String(s);return/[",\n]/.test(c)?`"${c.replaceAll('"','""')}"`:c};return[a.join(","),...t.map(s=>a.map(c=>l(s[c])).join(","))].join(`
`)}function h(t,a){const l=new Blob([a],{type:"text/csv;charset=utf-8"}),s=URL.createObjectURL(l),c=document.createElement("a");c.href=s,c.download=t,c.click(),URL.revokeObjectURL(s)}function v(){if(!e.payload){e.filteredRows=[],i();return}const t=b(e.filters.query).toLowerCase();let a=$(e.payload);e.filters.category!=="all"&&(a=a.filter(l=>l.category===e.filters.category)),t&&(a=a.filter(l=>[l.category,l.market_name,l.seller_name,l.business_name,l.shoppinglive_seller_name,l.replay_title].join(" ").toLowerCase().includes(t))),e.filters.missingOnly&&(a=a.filter(l=>!l.seller_name||!l.business_name)),a.sort((l,s)=>e.filters.sort==="market_asc"?l.market_name.localeCompare(s.market_name,"ko"):e.filters.sort==="crawled_desc"?Date.parse(s.crawled_at)-Date.parse(l.crawled_at):s.replay_views-l.replay_views),e.filteredRows=a,i()}async function p(){const t=await fetch(y,{cache:"no-store"});if(!t.ok)throw new Error(`Failed to load bundled data: ${t.status}`);const a=await t.json();g(a,"번들 스냅샷")}async function f(){try{const t=await fetch("./api/health",{cache:"no-store"});if(!t.ok)throw new Error(`health ${t.status}`);e.crawlHealth=await t.json(),e.crawlAvailable=!!e.crawlHealth.crawlEnabled}catch{e.crawlHealth=null,e.crawlAvailable=!1}finally{e.crawlChecking=!1,i()}}async function _(){if(!(!e.crawlAvailable||e.crawlSubmitting)){e.crawlSubmitting=!0,i();try{const t=await fetch("./api/crawl",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({categories:e.crawlScope==="all"?[]:[e.crawlScope]})});if(!t.ok)throw new Error(`crawl ${t.status}`);await f(),S()}catch{e.crawlHealth={...e.crawlHealth??{},lastError:"크롤링 요청에 실패했습니다."}}finally{e.crawlSubmitting=!1,i()}}}function S(){const t=async()=>{if(await f(),e.crawlHealth?.running){window.setTimeout(()=>{t()},2500);return}await p().catch(()=>{})};t()}function k(){if(!e.filteredRows.length)return;const t=new Date().toISOString().slice(0,19).replaceAll(":","-");h(`naver-shoppinglive-seller-directory-${t}.csv`,m(e.filteredRows))}function H(){if(!e.payload?.rows.length)return;const t=new Date().toISOString().slice(0,19).replaceAll(":","-");h(`naver-shoppinglive-seller-directory-all-${t}.csv`,m(e.payload.rows))}function g(t,a){e.payload=t,e.categories=[...new Set(t.rows.map(l=>l.category))].sort((l,s)=>l.localeCompare(s,"ko")),e.sourceLabel=a,v()}async function A(t){const a=t.currentTarget,l=a?.files?.[0];if(!l)return;const s=await l.text(),c=JSON.parse(s);g(c,`업로드: ${l.name}`),a&&(a.value="")}function d(t,a){e.filters[t]=a,v()}function C(){const t=e.payload?.rows??[];return{total:t.length,categories:new Set(t.map(a=>a.category)).size,missing:t.filter(a=>!a.seller_name||!a.business_name).length,generatedAt:e.payload?.generatedAt??t[0]?.crawled_at??""}}function L(){if(e.crawlChecking)return"크롤링 API 확인 중";if(!e.crawlAvailable)return"정적 공개본에서는 크롤링 실행이 비활성화됩니다. 로컬 실행기에서 연 페이지에서만 사용할 수 있습니다.";if(e.crawlHealth?.running){const t=e.crawlHealth.completedCategories??0,a=e.crawlHealth.totalCategories??0,l=e.crawlHealth.currentCategoryName?` · ${e.crawlHealth.currentCategoryName}`:"",s=e.crawlHealth.lastMessage?` · ${e.crawlHealth.lastMessage}`:"";return`크롤링 실행 중 ${t}/${a}${l}${s}`}if(e.crawlHealth?.lastError)return`최근 오류 · ${e.crawlHealth.lastError}`;if(e.crawlHealth?.lastFinishedAt){const t=e.crawlHealth.lastMessage?` · ${e.crawlHealth.lastMessage}`:"";return`마지막 실행 완료 · ${u(e.crawlHealth.lastFinishedAt)}${t}`}return"크롤링 준비 완료"}function q(){const t=e.crawlHealth?.totalCategories??0,a=e.crawlHealth?.completedCategories??0;return t?Math.max(0,Math.min(1,a/t)):0}function i(){if(!n.app)return;const t=C(),a=e.filteredRows;n.app.innerHTML=`
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
          <div class="seller-crawl-controls">
            <select id="seller-crawl-scope" class="seller-select seller-crawl-select"${e.crawlAvailable?"":" disabled"}>
              ${w.map(l=>`<option value="${l.code}"${e.crawlScope===l.code?" selected":""}>${r(l.name)}</option>`).join("")}
            </select>
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
        <div class="seller-status-strip">${r(L())}</div>
        <div class="seller-progress-track">
          <div class="seller-progress-bar" style="width:${Math.round(q()*100)}%"></div>
        </div>
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
              <input id="seller-query" class="seller-input" type="search" placeholder="마켓 이름, 판매자 이름, 상호명, 방송 제목" value="${r(e.filters.query)}" />
            </div>
            <div class="seller-field">
              <label for="seller-category">카테고리</label>
              <select id="seller-category" class="seller-select">
                <option value="all"${e.filters.category==="all"?" selected":""}>전체</option>
                ${e.categories.map(l=>`<option value="${r(l)}"${e.filters.category===l?" selected":""}>${r(l)}</option>`).join("")}
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
          </div>
        </section>

        <section class="seller-panel seller-table-shell">
          <div class="seller-table-meta">
            <div class="seller-meta-note">데이터 소스: ${r(e.sourceLabel)}</div>
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
                ${a.length?a.map(l=>`
                            <tr>
                              <td>${r(l.category)}</td>
                              <td>${r(l.market_name)}</td>
                              <td>${l.seller_name?r(l.seller_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${l.business_name?r(l.business_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${r(l.shoppinglive_seller_name)}</td>
                              <td>${o(l.replay_views)}</td>
                              <td>${r(u(l.crawled_at))}</td>
                              <td>
                                ${l.replay_url?`<a class="seller-link" href="${r(l.replay_url)}" target="_blank" rel="noreferrer">방송</a>`:""}
                                ${l.store_url?` · <a class="seller-link" href="${r(l.store_url)}" target="_blank" rel="noreferrer">스토어</a>`:""}
                                ${l.profile_url?` · <a class="seller-link" href="${r(l.profile_url)}" target="_blank" rel="noreferrer">프로필</a>`:""}
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
  `,n.app.querySelector('[data-action="reload"]')?.addEventListener("click",()=>{p()}),n.app.querySelector('[data-action="upload"]')?.addEventListener("change",l=>{A(l)}),n.app.querySelector('[data-action="crawl"]')?.addEventListener("click",()=>{_()}),n.app.querySelector('[data-action="csv-all"]')?.addEventListener("click",()=>{H()}),n.app.querySelector('[data-action="csv"]')?.addEventListener("click",()=>{k()}),n.app.querySelector("#seller-crawl-scope")?.addEventListener("change",l=>{e.crawlScope=l.currentTarget.value,i()}),n.app.querySelector("#seller-query")?.addEventListener("input",l=>{d("query",l.currentTarget.value)}),n.app.querySelector("#seller-category")?.addEventListener("change",l=>{d("category",l.currentTarget.value)}),n.app.querySelector("#seller-sort")?.addEventListener("change",l=>{d("sort",l.currentTarget.value)}),n.app.querySelector("#seller-missing")?.addEventListener("change",l=>{d("missingOnly",l.currentTarget.value==="missing")})}function r(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}p().catch(()=>{g({rows:[]},"번들 없음")}).finally(()=>{i()});f();
//# sourceMappingURL=naver-shoppinglive-directory-DsQlnuse.js.map

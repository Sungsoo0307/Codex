import"./modulepreload-polyfill-B5Qt9EMX.js";const g="./data/naver-shoppinglive-seller-directory-latest.json",s={payload:null,filteredRows:[],categories:[],filters:{query:"",category:"all",missingOnly:!1,sort:"replay_desc"},sourceLabel:"번들 스냅샷"},r={app:document.querySelector("#app")};function y(l){return l.replace(/\s+/g," ").trim()}function n(l){return new Intl.NumberFormat("ko-KR").format(l)}function p(l){if(!l)return"-";const t=new Date(l);return Number.isNaN(t.getTime())?l:new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(t)}function v(l){return[...l.rows]}function u(){if(!s.payload){s.filteredRows=[],c();return}const l=y(s.filters.query).toLowerCase();let t=v(s.payload);s.filters.category!=="all"&&(t=t.filter(e=>e.category===s.filters.category)),l&&(t=t.filter(e=>[e.category,e.market_name,e.seller_name,e.business_name,e.shoppinglive_seller_name,e.replay_title].join(" ").toLowerCase().includes(l))),s.filters.missingOnly&&(t=t.filter(e=>!e.seller_name||!e.business_name)),t.sort((e,i)=>s.filters.sort==="market_asc"?e.market_name.localeCompare(i.market_name,"ko"):s.filters.sort==="crawled_desc"?Date.parse(i.crawled_at)-Date.parse(e.crawled_at):i.replay_views-e.replay_views),s.filteredRows=t,c()}async function f(){const l=await fetch(g,{cache:"no-store"});if(!l.ok)throw new Error(`Failed to load bundled data: ${l.status}`);const t=await l.json();d(t,"번들 스냅샷")}function d(l,t){s.payload=l,s.categories=[...new Set(l.rows.map(e=>e.category))].sort((e,i)=>e.localeCompare(i,"ko")),s.sourceLabel=t,u()}async function h(l){const t=l.currentTarget,e=t?.files?.[0];if(!e)return;const i=await e.text(),m=JSON.parse(i);d(m,`업로드: ${e.name}`),t&&(t.value="")}function o(l,t){s.filters[l]=t,u()}function _(){const l=s.payload?.rows??[];return{total:l.length,categories:new Set(l.map(t=>t.category)).size,missing:l.filter(t=>!t.seller_name||!t.business_name).length,generatedAt:s.payload?.generatedAt??l[0]?.crawled_at??""}}function c(){if(!r.app)return;const l=_(),t=s.filteredRows;r.app.innerHTML=`
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
          <label class="seller-file-label">
            JSON 업로드
            <input type="file" accept=".json,application/json" data-action="upload" />
          </label>
        </div>
      </section>

      <section class="seller-grid">
        <div class="seller-stats">
          <article class="seller-stat">
            <span class="seller-stat-label">총 행 수</span>
            <strong class="seller-stat-value">${n(l.total)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">카테고리 수</span>
            <strong class="seller-stat-value">${n(l.categories)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">정보 미완성 행</span>
            <strong class="seller-stat-value">${n(l.missing)}</strong>
          </article>
          <article class="seller-stat">
            <span class="seller-stat-label">기준 시각</span>
            <strong class="seller-stat-value" style="font-size:1rem;">${p(l.generatedAt)}</strong>
          </article>
        </div>

        <section class="seller-panel seller-filter-shell">
          <div class="seller-filters">
            <div class="seller-field">
              <label for="seller-query">검색</label>
              <input id="seller-query" class="seller-input" type="search" placeholder="마켓 이름, 판매자 이름, 상호명, 방송 제목" value="${a(s.filters.query)}" />
            </div>
            <div class="seller-field">
              <label for="seller-category">카테고리</label>
              <select id="seller-category" class="seller-select">
                <option value="all"${s.filters.category==="all"?" selected":""}>전체</option>
                ${s.categories.map(e=>`<option value="${a(e)}"${s.filters.category===e?" selected":""}>${a(e)}</option>`).join("")}
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-sort">정렬</label>
              <select id="seller-sort" class="seller-select">
                <option value="replay_desc"${s.filters.sort==="replay_desc"?" selected":""}>조회수 높은순</option>
                <option value="market_asc"${s.filters.sort==="market_asc"?" selected":""}>마켓 이름순</option>
                <option value="crawled_desc"${s.filters.sort==="crawled_desc"?" selected":""}>크롤링 최신순</option>
              </select>
            </div>
            <div class="seller-field">
              <label for="seller-missing">정보 필터</label>
              <select id="seller-missing" class="seller-select">
                <option value="all"${s.filters.missingOnly?"":" selected"}>전체</option>
                <option value="missing"${s.filters.missingOnly?" selected":""}>빈 정보만</option>
              </select>
            </div>
          </div>
        </section>

        <section class="seller-panel seller-table-shell">
          <div class="seller-table-meta">
            <div class="seller-meta-note">데이터 소스: ${a(s.sourceLabel)}</div>
            <div class="seller-badge">현재 ${n(t.length)}행 표시</div>
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
                ${t.length?t.map(e=>`
                            <tr>
                              <td>${a(e.category)}</td>
                              <td>${a(e.market_name)}</td>
                              <td>${e.seller_name?a(e.seller_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${e.business_name?a(e.business_name):'<span class="seller-missing">없음</span>'}</td>
                              <td>${a(e.shoppinglive_seller_name)}</td>
                              <td>${n(e.replay_views)}</td>
                              <td>${a(p(e.crawled_at))}</td>
                              <td>
                                ${e.replay_url?`<a class="seller-link" href="${a(e.replay_url)}" target="_blank" rel="noreferrer">방송</a>`:""}
                                ${e.store_url?` · <a class="seller-link" href="${a(e.store_url)}" target="_blank" rel="noreferrer">스토어</a>`:""}
                                ${e.profile_url?` · <a class="seller-link" href="${a(e.profile_url)}" target="_blank" rel="noreferrer">프로필</a>`:""}
                              </td>
                            </tr>
                          `).join(""):'<tr><td colspan="8">표시할 데이터가 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <div class="seller-foot">
          브라우저 페이지는 조회 전용입니다. 데이터 갱신은 로컬 실행기에서 크롤러를 다시 돌린 뒤,
          최신 JSON을 번들에 다시 복사해서 반영합니다.
        </div>
      </section>
    </div>
  `,r.app.querySelector('[data-action="reload"]')?.addEventListener("click",()=>{f()}),r.app.querySelector('[data-action="upload"]')?.addEventListener("change",e=>{h(e)}),r.app.querySelector("#seller-query")?.addEventListener("input",e=>{o("query",e.currentTarget.value)}),r.app.querySelector("#seller-category")?.addEventListener("change",e=>{o("category",e.currentTarget.value)}),r.app.querySelector("#seller-sort")?.addEventListener("change",e=>{o("sort",e.currentTarget.value)}),r.app.querySelector("#seller-missing")?.addEventListener("change",e=>{o("missingOnly",e.currentTarget.value==="missing")})}function a(l){return l.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}f().catch(()=>{d({rows:[]},"번들 없음")}).finally(()=>{c()});
//# sourceMappingURL=naver-shoppinglive-directory-Dwl0s8j9.js.map

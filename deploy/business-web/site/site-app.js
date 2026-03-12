const libraryList = document.getElementById("libraryList");
const latestArticle = document.getElementById("latestArticle");
const productList = document.getElementById("productList");
const nearTermList = document.getElementById("nearTermList");
const rulesList = document.getElementById("rulesList");
const subscribeForm = document.getElementById("subscribeForm");
const subscribeStatus = document.getElementById("subscribeStatus");
const operatorLink = document.getElementById("operatorLink");
let siteConfig = {
  operatorUrl: "/openclaw/",
  subscribeApiUrl: "./api/subscribe",
};

function renderCardList(node, items) {
  if (!node) {
    return;
  }
  if (!Array.isArray(items) || items.length === 0) {
    node.innerHTML = `<article class="card"><p>Nothing published yet.</p></article>`;
    return;
  }
  node.innerHTML = items
    .map((item) => `<article class="card"><p>${item}</p></article>`)
    .join("");
}

async function loadLibrary() {
  if (!libraryList) {
    return;
  }

  try {
    const response = await fetch("./library.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`library:${response.status}`);
    }
    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) {
      libraryList.innerHTML = `
        <article class="card">
          <h3>No published articles yet</h3>
          <p>The operator can keep drafting privately until you mark an article as published.</p>
        </article>
      `;
      return;
    }

    libraryList.innerHTML = items
      .map(
        (item) => `
          <article class="card library-card">
            <p class="card-kicker">${item.category} · ${item.date}</p>
            <h3><a href="${item.url}">${item.title}</a></h3>
            <p>${item.summary}</p>
            <p class="card-meta">${item.readTime}</p>
          </article>
        `,
      )
      .join("");
  } catch {
    libraryList.innerHTML = `
      <article class="card">
        <h3>Library unavailable</h3>
        <p>Build the publication assets first so the public site can display the article catalog.</p>
      </article>
    `;
  }
}

async function loadSiteConfig() {
  try {
    const response = await fetch("./site-config.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`site-config:${response.status}`);
    }
    const data = await response.json();
    siteConfig = {
      ...siteConfig,
      ...data,
    };
  } catch {
    // Keep defaults for local-only fallback.
  }

  if (operatorLink && siteConfig.operatorUrl) {
    operatorLink.href = siteConfig.operatorUrl;
  }
}

async function loadLatest() {
  if (!latestArticle) {
    return;
  }
  try {
    const response = await fetch("./latest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`latest:${response.status}`);
    }
    const item = await response.json();
    if (!item) {
      latestArticle.innerHTML = "<p>No latest article available yet.</p>";
      return;
    }
    latestArticle.innerHTML = `
      <p class="card-kicker">${item.category} · ${item.date}</p>
      <h4><a href="${item.url}">${item.title}</a></h4>
      <p>${item.summary}</p>
      <p class="card-meta">${item.readTime}</p>
    `;
  } catch {
    latestArticle.innerHTML = "<p>Latest article metadata is unavailable.</p>";
  }
}

async function loadProducts() {
  if (!productList) {
    return;
  }
  try {
    const response = await fetch("./products.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`products:${response.status}`);
    }
    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) {
      productList.innerHTML = `<span class="chip">No product ideas yet</span>`;
      return;
    }
    productList.innerHTML = items.map((item) => `<span class="chip">${item.label}</span>`).join("");
  } catch {
    productList.innerHTML = `<span class="chip">Products unavailable</span>`;
  }
}

async function loadMonetization() {
  try {
    const response = await fetch("./monetization.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`monetization:${response.status}`);
    }
    const data = await response.json();
    renderCardList(nearTermList, data.nearTerm);
    renderCardList(rulesList, data.rules);
  } catch {
    renderCardList(nearTermList, []);
    renderCardList(rulesList, []);
  }
}

async function setupSubscribeForm() {
  if (!subscribeForm || !subscribeStatus) {
    return;
  }

  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    subscribeStatus.textContent = "Saving your subscription...";

    const formData = new FormData(subscribeForm);
    const payload = Object.fromEntries(formData.entries());
    payload.source = "website";

    try {
      const response = await fetch(siteConfig.subscribeApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`subscribe:${response.status}`);
      }

      subscribeForm.reset();
      subscribeStatus.textContent =
        "Subscribed. OpenClaw can now log this reader signal in the workspace.";
    } catch {
      subscribeStatus.textContent =
        "Subscription failed. Check the gateway, hook token, and hook config.";
    }
  });
}

await loadSiteConfig();
await Promise.all([loadLibrary(), loadLatest(), loadProducts(), loadMonetization()]);
await setupSubscribeForm();

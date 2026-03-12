#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "deploy/business-web");
const articlesDir = path.join(rootDir, "workspace", "content", "articles");
const siteDir = path.join(rootDir, "site");
const generatedDir = path.join(siteDir, "library");
const manifestPath = path.join(siteDir, "library.json");
const latestPath = path.join(siteDir, "latest.json");
const productsPath = path.join(siteDir, "products.json");
const monetizationPath = path.join(siteDir, "monetization.json");
const siteConfigPath = path.join(siteDir, "site-config.json");
const sitemapPath = path.join(siteDir, "sitemap.xml");
const feedPath = path.join(siteDir, "feed.xml");
const robotsPath = path.join(siteDir, "robots.txt");
const noJekyllPath = path.join(siteDir, ".nojekyll");
const cnamePath = path.join(siteDir, "CNAME");
const productsSourcePath = path.join(rootDir, "workspace", "content", "products.md");
const monetizationSourcePath = path.join(rootDir, "workspace", "business", "monetization.md");
const baseUrl = String(process.env.PUBLIC_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
const customDomain = String(process.env.PUBLIC_CUSTOM_DOMAIN || "").trim();
const operatorUrl = String(process.env.PUBLIC_OPERATOR_URL || "/openclaw/").trim();
const subscribeApiUrl = String(process.env.PUBLIC_SUBSCRIBE_API_URL || "./api/subscribe").trim();
const siteTitle = "OpenClaw Content Engine";
const siteDescription =
  "An autonomous content engine that compounds articles, short-form assets, and digital product ideas.";

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function parseFrontMatter(text) {
  if (!text.startsWith("---\n")) {
    return { meta: {}, body: text };
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    return { meta: {}, body: text };
  }
  const header = text.slice(4, end).trim();
  const body = text.slice(end + 5).trim();
  const meta = {};
  for (const line of header.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) {
      continue;
    }
    const key = line.slice(0, idx).trim();
    const raw = line.slice(idx + 1).trim();
    meta[key] = raw.replace(/^"(.*)"$/, "$1");
  }
  return { meta, body };
}

function extractBulletItems(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function markdownToHtml(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      html.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      html.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      html.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
      continue;
    }
    flushList();
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  flushList();
  return html.join("\n");
}

function buildPage(article) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(article.title)}</title>
    <meta name="description" content="${escapeHtml(article.summary)}" />
    <link rel="canonical" href="${escapeHtml(article.absoluteUrl)}" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <div class="shell article-shell">
      <header class="panel article-hero">
        <p class="eyebrow">${escapeHtml(article.category)}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p class="lede">${escapeHtml(article.summary)}</p>
        <p class="article-meta">Published ${escapeHtml(article.date)} · ${escapeHtml(article.readTime)}</p>
        <a class="button button-secondary" href="../">Back to library</a>
      </header>
      <article class="panel article-body">
        ${article.bodyHtml}
      </article>
    </div>
  </body>
</html>
`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readArticles() {
  await ensureDir(articlesDir);
  const entries = await fs.readdir(articlesDir, { withFileTypes: true });
  const articles = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }
    const sourcePath = path.join(articlesDir, entry.name);
    const source = await fs.readFile(sourcePath, "utf8");
    const { meta, body } = parseFrontMatter(source);
    const title = meta.title || entry.name.replace(/\.md$/, "");
    const status = (meta.status || "draft").toLowerCase();
    const slug = meta.slug || slugify(title);
    const date = meta.date || new Date().toISOString().slice(0, 10);
    const category = meta.category || "Essay";
    const summary = meta.summary || body.split("\n").find(Boolean) || "No summary provided.";
    const readTime = meta.readTime || "5 min read";

    articles.push({
      title,
      status,
      slug,
      date,
      category,
      summary,
      readTime,
      bodyHtml: markdownToHtml(body),
    });
  }

  articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return articles;
}

async function writeManifest(publishedArticles) {
  const manifest = publishedArticles.map((article) => ({
    title: article.title,
    slug: article.slug,
    date: article.date,
    category: article.category,
    summary: article.summary,
    readTime: article.readTime,
    url: `./library/${article.slug}.html`,
    absoluteUrl: `${baseUrl}/library/${article.slug}.html`,
  }));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  await fs.writeFile(latestPath, JSON.stringify(manifest[0] ?? null, null, 2) + "\n", "utf8");
}

async function writeSiteConfig() {
  const config = {
    operatorUrl,
    subscribeApiUrl,
    baseUrl,
  };
  await fs.writeFile(siteConfigPath, JSON.stringify(config, null, 2) + "\n", "utf8");
}

async function writeBusinessData() {
  const productsSource = await fs.readFile(productsSourcePath, "utf8");
  const monetizationSource = await fs.readFile(monetizationSourcePath, "utf8");

  const products = extractBulletItems(productsSource).map((label) => ({
    label,
    slug: slugify(label),
  }));

  const monetization = {
    nearTerm: [],
    midTerm: [],
    rules: [],
  };

  let section = "";
  for (const line of monetizationSource.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "## Near-term") {
      section = "nearTerm";
      continue;
    }
    if (trimmed === "## Mid-term") {
      section = "midTerm";
      continue;
    }
    if (trimmed === "## Rules") {
      section = "rules";
      continue;
    }
    if (trimmed.startsWith("- ") && section) {
      monetization[section].push(trimmed.slice(2).trim());
    }
  }

  await fs.writeFile(productsPath, JSON.stringify(products, null, 2) + "\n", "utf8");
  await fs.writeFile(monetizationPath, JSON.stringify(monetization, null, 2) + "\n", "utf8");
}

async function writePages(publishedArticles) {
  await fs.rm(generatedDir, { recursive: true, force: true });
  await ensureDir(generatedDir);
  for (const article of publishedArticles) {
    const targetPath = path.join(generatedDir, `${article.slug}.html`);
    await fs.writeFile(targetPath, buildPage(article), "utf8");
  }
}

async function writeFeed(publishedArticles) {
  const items = publishedArticles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.absoluteUrl)}</link>
      <guid>${escapeXml(article.absoluteUrl)}</guid>
      <pubDate>${escapeXml(new Date(article.date).toUTCString())}</pubDate>
      <description>${escapeXml(article.summary)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    ${items}
  </channel>
</rss>
`;
  await fs.writeFile(feedPath, xml, "utf8");
}

async function writeSitemap(publishedArticles) {
  const urls = [
    { loc: `${baseUrl}/`, lastmod: new Date().toISOString().slice(0, 10) },
    ...publishedArticles.map((article) => ({
      loc: article.absoluteUrl,
      lastmod: article.date,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await fs.writeFile(sitemapPath, xml, "utf8");
}

async function writeRobots() {
  const text = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  await fs.writeFile(robotsPath, text, "utf8");
}

async function writeNoJekyll() {
  await fs.writeFile(noJekyllPath, "\n", "utf8");
}

async function writeCname() {
  if (!customDomain) {
    await fs.rm(cnamePath, { force: true });
    return;
  }
  await fs.writeFile(cnamePath, `${customDomain}\n`, "utf8");
}

async function main() {
  await ensureDir(siteDir);
  const articles = await readArticles();
  const publishedArticles = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      ...article,
      absoluteUrl: `${baseUrl}/library/${article.slug}.html`,
    }));
  await writeManifest(publishedArticles);
  await writeBusinessData();
  await writeSiteConfig();
  await writePages(publishedArticles);
  await writeFeed(publishedArticles);
  await writeSitemap(publishedArticles);
  await writeRobots();
  await writeNoJekyll();
  await writeCname();
  console.log(`publication-ok:${publishedArticles.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

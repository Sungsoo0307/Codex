#!/usr/bin/env -S node --import tsx
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  CATEGORIES,
  DIRECTORY_HEADERS,
  runCli as runSellerDirectoryCli,
} from "./naver-shoppinglive-seller-directory.ts";

type Args = {
  host: string;
  port: number;
  publicDir: string;
  outputBase: string;
  targetRowsPerCategory: number;
  maxReplaysPerCategory: number;
  maxScrollPasses: number;
  settleMs: number;
  timeoutMs: number;
  headful: boolean;
};

type CrawlState = {
  running: boolean;
  lastStartedAt: string;
  lastFinishedAt: string;
  lastError: string;
  totalCategories: number;
  completedCategories: number;
  currentCategoryCode: string;
  currentCategoryName: string;
  lastMessage: string;
  activeTargetRowsPerCategory: number;
  activeCategoryCodes: string[];
  startRowCount: number;
  lastAddedRows: number;
  lastCategoryResults: CategoryResultSummary[];
};

type CategoryResultSummary = {
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
};

const MIME_TYPES = new Map<string, string>([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

function parseArgs(argv: string[]): Args {
  const args: Args = {
    host: "127.0.0.1",
    port: 4181,
    publicDir: "deploy/naver-shoppinglive-pages",
    outputBase: "tmp/naver-shoppinglive-seller-directory-50",
    targetRowsPerCategory: 50,
    maxReplaysPerCategory: 80,
    maxScrollPasses: 30,
    settleMs: 1_500,
    timeoutMs: 20_000,
    headful: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--host" && argv[i + 1]) {
      args.host = argv[++i] ?? args.host;
      continue;
    }
    if (arg === "--port" && argv[i + 1]) {
      args.port = Number.parseInt(argv[++i] ?? "", 10) || args.port;
      continue;
    }
    if (arg === "--public-dir" && argv[i + 1]) {
      args.publicDir = argv[++i] ?? args.publicDir;
      continue;
    }
    if (arg === "--output-base" && argv[i + 1]) {
      args.outputBase = argv[++i] ?? args.outputBase;
      continue;
    }
    if (arg === "--target-rows-per-category" && argv[i + 1]) {
      args.targetRowsPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.targetRowsPerCategory;
      continue;
    }
    if (arg === "--max-replays-per-category" && argv[i + 1]) {
      args.maxReplaysPerCategory =
        Number.parseInt(argv[++i] ?? "", 10) || args.maxReplaysPerCategory;
      continue;
    }
    if (arg === "--max-scroll-passes" && argv[i + 1]) {
      args.maxScrollPasses = Number.parseInt(argv[++i] ?? "", 10) || args.maxScrollPasses;
      continue;
    }
    if (arg === "--settle-ms" && argv[i + 1]) {
      args.settleMs = Number.parseInt(argv[++i] ?? "", 10) || args.settleMs;
      continue;
    }
    if (arg === "--timeout-ms" && argv[i + 1]) {
      args.timeoutMs = Number.parseInt(argv[++i] ?? "", 10) || args.timeoutMs;
      continue;
    }
    if (arg === "--headful") {
      args.headful = true;
      continue;
    }
    if (arg === "--help") {
      console.log(`Usage:
  node --import tsx scripts/naver-shoppinglive-directory-web-server.ts [options]

Options:
  --host <value>                    Bind host (default: 127.0.0.1)
  --port <n>                        Bind port (default: 4181)
  --public-dir <path>               Static bundle directory (default: deploy/naver-shoppinglive-pages)
  --output-base <path>              Crawl output base without extension (default: tmp/naver-shoppinglive-seller-directory-50)
  --target-rows-per-category <n>    Target unique rows per category (default: 50)
  --max-replays-per-category <n>    Replay seed limit (default: 80)
  --max-scroll-passes <n>           Category scroll limit (default: 30)
  --headful                         Launch visible browser for crawling
`);
      process.exit(0);
    }
  }

  return args;
}

function jsonResponse(
  response: http.ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function safeStat(filePath: string) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

async function readLatestPayloadMetadata(publicDir: string) {
  const jsonPath = path.join(publicDir, "data", "naver-shoppinglive-seller-directory-latest.json");
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(raw) as { generatedAt?: string; rows?: unknown[] };
    return {
      generatedAt: String(parsed.generatedAt ?? ""),
      rowCount: Array.isArray(parsed.rows) ? parsed.rows.length : 0,
    };
  } catch {
    return { generatedAt: "", rowCount: 0 };
  }
}

async function syncOutputToPublicDir(outputBase: string, publicDir: string) {
  const sourceBase = path.resolve(outputBase);
  const targetDir = path.join(path.resolve(publicDir), "data");
  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(
    `${sourceBase}.csv`,
    path.join(targetDir, "naver-shoppinglive-seller-directory-latest.csv"),
  );
  await fs.copyFile(
    `${sourceBase}.json`,
    path.join(targetDir, "naver-shoppinglive-seller-directory-latest.json"),
  );
}

async function writeEmptyOutput(outputBase: string) {
  const sourceBase = path.resolve(outputBase);
  const generatedAt = new Date().toISOString();
  await fs.mkdir(path.dirname(sourceBase), { recursive: true });
  await fs.writeFile(`${sourceBase}.csv`, `${DIRECTORY_HEADERS.join(",")}\n`, "utf8");
  await fs.writeFile(
    `${sourceBase}.json`,
    JSON.stringify(
      {
        generatedAt,
        rows: [],
      },
      null,
      2,
    ),
    "utf8",
  );
}

function contentTypeFor(filePath: string): string {
  return MIME_TYPES.get(path.extname(filePath)) ?? "application/octet-stream";
}

async function serveStatic(response: http.ServerResponse, publicDir: string, pathname: string) {
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(path.resolve(publicDir), safePath);
  const stat = await safeStat(filePath);
  if (!stat || !stat.isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const body = await fs.readFile(filePath);
  response.writeHead(200, { "content-type": contentTypeFor(filePath) });
  response.end(body);
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const publicDir = path.resolve(args.publicDir);
  const crawlState: CrawlState = {
    running: false,
    lastStartedAt: "",
    lastFinishedAt: "",
    lastError: "",
    totalCategories: 0,
    completedCategories: 0,
    currentCategoryCode: "",
    currentCategoryName: "",
    lastMessage: "",
    activeTargetRowsPerCategory: args.targetRowsPerCategory,
    activeCategoryCodes: [],
    startRowCount: 0,
    lastAddedRows: 0,
    lastCategoryResults: [],
  };

  try {
    await syncOutputToPublicDir(args.outputBase, publicDir);
  } catch {
    // Ignore missing output on first boot. The page can still load its existing bundle.
  }

  async function startCrawl(categoryCodes: string[] = [], targetRowsPerCategory?: number) {
    if (crawlState.running) {
      return false;
    }
    const selectedCategories = categoryCodes.length
      ? CATEGORIES.filter((category) => categoryCodes.includes(category.code))
      : CATEGORIES;
    const effectiveTargetRowsPerCategory = Math.max(
      1,
      targetRowsPerCategory ?? args.targetRowsPerCategory,
    );
    const beforeMetadata = await readLatestPayloadMetadata(publicDir);
    crawlState.running = true;
    crawlState.lastStartedAt = new Date().toISOString();
    crawlState.lastError = "";
    crawlState.totalCategories = selectedCategories.length;
    crawlState.completedCategories = 0;
    crawlState.currentCategoryCode = "";
    crawlState.currentCategoryName = "";
    crawlState.lastMessage = "크롤링 준비 중";
    crawlState.activeTargetRowsPerCategory = effectiveTargetRowsPerCategory;
    crawlState.activeCategoryCodes = selectedCategories.map((category) => category.code);
    crawlState.startRowCount = beforeMetadata.rowCount;
    crawlState.lastAddedRows = 0;
    crawlState.lastCategoryResults = [];

    void (async () => {
      try {
        const crawlArgs = [
          "--output",
          `${args.outputBase}.csv`,
          "--target-rows-per-category",
          String(effectiveTargetRowsPerCategory),
          "--max-replays-per-category",
          String(args.maxReplaysPerCategory),
          "--max-scroll-passes",
          String(args.maxScrollPasses),
          "--settle-ms",
          String(args.settleMs),
          "--timeout-ms",
          String(args.timeoutMs),
        ];
        if (args.headful) {
          crawlArgs.push("--headful");
        }
        if (categoryCodes.length) {
          crawlArgs.push("--categories", categoryCodes.join(","));
        }

        await runSellerDirectoryCli(crawlArgs, {
          onProgress(event) {
            if (event.phase === "start") {
              crawlState.totalCategories = event.totalCategories;
              crawlState.completedCategories = 0;
              crawlState.lastMessage = "크롤링 시작";
              return;
            }
            if (event.phase === "category_start") {
              crawlState.currentCategoryCode = event.categoryCode;
              crawlState.currentCategoryName = event.categoryName;
              crawlState.lastMessage = `${event.categoryName} 수집 중`;
              return;
            }
            if (event.phase === "category_skip") {
              crawlState.currentCategoryCode = event.categoryCode;
              crawlState.currentCategoryName = event.categoryName;
              crawlState.completedCategories = event.categoryIndex;
              crawlState.lastMessage = `${event.categoryName} 건너뜀`;
              crawlState.lastCategoryResults.push({
                categoryCode: event.categoryCode,
                categoryName: event.categoryName,
                existingRows: event.existingRows,
                replaySeeds: 0,
                addedRows: 0,
                targetRows: event.targetRows,
                reason: "목표 달성으로 skip",
                noSourceCount: 0,
                provisionalDuplicateCount: 0,
                finalDuplicateCount: 0,
                identityErrorCount: 0,
              });
              return;
            }
            if (event.phase === "category_complete") {
              crawlState.currentCategoryCode = event.categoryCode;
              crawlState.currentCategoryName = event.categoryName;
              crawlState.completedCategories = event.categoryIndex;
              crawlState.lastMessage = `${event.categoryName} 완료`;
              const duplicateCount = event.provisionalDuplicateCount + event.finalDuplicateCount;
              let reason = "신규 행 추가";
              if (event.addedRows === 0) {
                if (event.replaySeeds === 0) {
                  reason = "시드 부족";
                } else if (
                  duplicateCount > 0 &&
                  duplicateCount >= event.replaySeeds - event.noSourceCount
                ) {
                  reason = "전부 중복";
                } else if (event.noSourceCount >= event.replaySeeds) {
                  reason = "유효 상품 소스 부족";
                } else {
                  reason = "추가 가능한 신규 행 없음";
                }
              } else if (event.identityErrorCount > 0) {
                reason = "신규 행 추가, 일부 프로필 차단";
              }
              crawlState.lastCategoryResults.push({
                categoryCode: event.categoryCode,
                categoryName: event.categoryName,
                existingRows: event.existingRows,
                replaySeeds: event.replaySeeds,
                addedRows: event.addedRows,
                targetRows: event.targetRows,
                reason,
                noSourceCount: event.noSourceCount,
                provisionalDuplicateCount: event.provisionalDuplicateCount,
                finalDuplicateCount: event.finalDuplicateCount,
                identityErrorCount: event.identityErrorCount,
              });
              return;
            }
            if (event.phase === "write") {
              crawlState.lastMessage = "결과 파일 저장 중";
              return;
            }
            if (event.phase === "done") {
              crawlState.completedCategories = crawlState.totalCategories;
              crawlState.lastMessage = `크롤링 완료 · ${event.totalRows}행`;
            }
          },
        });
        await syncOutputToPublicDir(args.outputBase, publicDir);
        const afterMetadata = await readLatestPayloadMetadata(publicDir);
        crawlState.lastAddedRows = Math.max(0, afterMetadata.rowCount - crawlState.startRowCount);
        crawlState.lastMessage = `크롤링 완료 · 신규 ${crawlState.lastAddedRows}행`;
      } catch (error) {
        crawlState.lastError = error instanceof Error ? error.message : String(error);
        console.error(crawlState.lastError);
      } finally {
        crawlState.running = false;
        crawlState.lastFinishedAt = new Date().toISOString();
        crawlState.currentCategoryCode = "";
        crawlState.currentCategoryName = "";
      }
    })();

    return true;
  }

  const server = http.createServer(async (request, response) => {
    try {
      const method = request.method ?? "GET";
      const url = new URL(request.url ?? "/", `http://${args.host}:${args.port}`);

      if (method === "GET" && url.pathname === "/api/health") {
        const latest = await readLatestPayloadMetadata(publicDir);
        jsonResponse(response, 200, {
          ok: true,
          crawlEnabled: true,
          running: crawlState.running,
          lastStartedAt: crawlState.lastStartedAt,
          lastFinishedAt: crawlState.lastFinishedAt,
          lastError: crawlState.lastError,
          generatedAt: latest.generatedAt,
          rowCount: latest.rowCount,
          totalCategories: crawlState.totalCategories,
          completedCategories: crawlState.completedCategories,
          currentCategoryCode: crawlState.currentCategoryCode,
          currentCategoryName: crawlState.currentCategoryName,
          lastMessage: crawlState.lastMessage,
          activeTargetRowsPerCategory: crawlState.activeTargetRowsPerCategory,
          activeCategoryCodes: crawlState.activeCategoryCodes,
          lastAddedRows: crawlState.lastAddedRows,
          lastCategoryResults: crawlState.lastCategoryResults,
        });
        return;
      }

      if (method === "POST" && url.pathname === "/api/crawl") {
        const chunks: Buffer[] = [];
        for await (const chunk of request) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const bodyText = Buffer.concat(chunks).toString("utf8");
        const parsed = bodyText
          ? (JSON.parse(bodyText) as {
              categories?: string[];
              targetRowsPerCategory?: number;
            })
          : {};
        const accepted = await startCrawl(
          Array.isArray(parsed.categories)
            ? parsed.categories.map((value) => String(value).trim()).filter(Boolean)
            : [],
          Number.isFinite(parsed.targetRowsPerCategory)
            ? Number(parsed.targetRowsPerCategory)
            : undefined,
        );
        if (!accepted) {
          jsonResponse(response, 409, { ok: false, message: "crawl_already_running" });
          return;
        }
        jsonResponse(response, 202, { ok: true, message: "crawl_started" });
        return;
      }

      if (method === "GET" && url.pathname === "/api/export.csv") {
        const csvPath = path.join(
          publicDir,
          "data",
          "naver-shoppinglive-seller-directory-latest.csv",
        );
        const stat = await safeStat(csvPath);
        if (!stat) {
          response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
          response.end("CSV not found");
          return;
        }
        const body = await fs.readFile(csvPath);
        response.writeHead(200, {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition":
            'attachment; filename="naver-shoppinglive-seller-directory-latest.csv"',
        });
        response.end(body);
        return;
      }

      if (method === "POST" && url.pathname === "/api/reset-data") {
        if (crawlState.running) {
          jsonResponse(response, 409, {
            ok: false,
            message: "crawl_running_reset_blocked",
          });
          return;
        }
        await writeEmptyOutput(args.outputBase);
        await syncOutputToPublicDir(args.outputBase, publicDir);
        crawlState.lastStartedAt = "";
        crawlState.lastFinishedAt = "";
        crawlState.lastError = "";
        crawlState.totalCategories = 0;
        crawlState.completedCategories = 0;
        crawlState.currentCategoryCode = "";
        crawlState.currentCategoryName = "";
        crawlState.lastMessage = "";
        crawlState.lastAddedRows = 0;
        crawlState.lastCategoryResults = [];
        jsonResponse(response, 200, { ok: true, message: "data_reset" });
        return;
      }

      await serveStatic(response, publicDir, url.pathname);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, message }));
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(args.port, args.host, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        console.log(`Server listening on http://${args.host}:${address.port}/`);
      }
      resolve();
    });
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

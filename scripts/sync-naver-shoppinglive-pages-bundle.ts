#!/usr/bin/env -S node --import tsx
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type Args = {
  sourceDir: string;
  targetDir: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    sourceDir: "dist/control-ui",
    targetDir: "deploy/naver-shoppinglive-pages",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--source-dir" && argv[i + 1]) {
      args.sourceDir = argv[++i];
      continue;
    }
    if (arg === "--target-dir" && argv[i + 1]) {
      args.targetDir = argv[++i];
      continue;
    }
    if (arg === "--help") {
      console.log(`Usage:
  node --import tsx scripts/sync-naver-shoppinglive-pages-bundle.ts [options]

Options:
  --source-dir <path>   Built control UI directory (default: dist/control-ui)
  --target-dir <path>   Pages bundle directory (default: deploy/naver-shoppinglive-pages)
`);
      process.exit(0);
    }
  }

  return args;
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const sourceDir = path.resolve(args.sourceDir);
  const targetDir = path.resolve(args.targetDir);
  const pageEntry = path.join(targetDir, "naver-shoppinglive-directory.html");
  const indexEntry = path.join(targetDir, "index.html");

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  await fs.cp(sourceDir, targetDir, { recursive: true });
  await fs.copyFile(pageEntry, indexEntry);
  await fs.writeFile(path.join(targetDir, ".nojekyll"), "");

  console.log(`Copied ${sourceDir} -> ${targetDir}`);
  console.log(`Repointed index.html -> ${pageEntry}`);
  console.log(`Wrote ${path.join(targetDir, ".nojekyll")}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

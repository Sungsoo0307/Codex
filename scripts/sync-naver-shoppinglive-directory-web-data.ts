#!/usr/bin/env -S node --import tsx
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type Args = {
  sourceBase: string;
  targetDir: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    sourceBase: "tmp/naver-shoppinglive-seller-directory-50",
    targetDir: "ui/public/data",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--source-base" && argv[i + 1]) {
      args.sourceBase = argv[++i];
      continue;
    }
    if (arg === "--target-dir" && argv[i + 1]) {
      args.targetDir = argv[++i];
      continue;
    }
    if (arg === "--help") {
      console.log(`Usage:
  node --import tsx scripts/sync-naver-shoppinglive-directory-web-data.ts [options]

Options:
  --source-base <path>   Source file base without extension (default: tmp/naver-shoppinglive-seller-directory-50)
  --target-dir <path>    Target directory (default: ui/public/data)
`);
      process.exit(0);
    }
  }

  return args;
}

async function runCli(argv: string[]) {
  const args = parseArgs(argv);
  const sourceBase = path.resolve(args.sourceBase);
  const targetDir = path.resolve(args.targetDir);

  const sourceCsv = `${sourceBase}.csv`;
  const sourceJson = `${sourceBase}.json`;
  const targetCsv = path.join(targetDir, "naver-shoppinglive-seller-directory-latest.csv");
  const targetJson = path.join(targetDir, "naver-shoppinglive-seller-directory-latest.json");

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(sourceCsv, targetCsv);
  await fs.copyFile(sourceJson, targetJson);

  console.log(`Copied ${sourceCsv} -> ${targetCsv}`);
  console.log(`Copied ${sourceJson} -> ${targetJson}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { runCli };

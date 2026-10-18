#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
if (process.argv.includes("--version")) {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  console.log(pkg.version);
} else if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: elera-example [--help] [--version]");
} else {
  await import(resolve(root, "src/app.mjs"));
}

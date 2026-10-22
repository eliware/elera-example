#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseCliArguments } from "../src/cli/arguments.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { action, unsupportedArguments } = parseCliArguments(process.argv.slice(2));
if (action === "invalid") {
  console.error(`Unsupported argument: ${unsupportedArguments[0]}`);
  process.exitCode = 2;
} else if (action === "version") {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  console.log(pkg.version);
} else if (action === "help") {
  console.log("Usage: elera-example [--help] [--version]");
} else if (action === "start") {
  await import(resolve(root, "src/app.mjs"));
}

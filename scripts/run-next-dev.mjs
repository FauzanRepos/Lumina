import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const webpackCacheDir = path.join(projectRoot, ".next", "cache", "webpack");
const binaryName = process.platform === "win32" ? "next.cmd" : "next";
const binaryPath = path.resolve(projectRoot, "node_modules", ".bin", binaryName);

async function main() {
  await rm(webpackCacheDir, { force: true, recursive: true });

  const child = spawn(binaryPath, ["dev"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => forwardSignal("SIGINT"));
  process.on("SIGTERM", () => forwardSignal("SIGTERM"));

  child.on("error", (error) => {
    console.error("[next-dev] failed to start Next dev server", error);
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("[next-dev] failed to reset webpack cache", error);
  process.exit(1);
});
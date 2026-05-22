#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function bin(name) {
  const binName = process.platform === "win32" ? `${name}.cmd` : name;
  return path.resolve(projectRoot, "node_modules", ".bin", binName);
}

function spawnProcess(cmd, args, name) {
  console.log(`[run] starting ${name}: ${cmd} ${args.join(" ")}`);
  const child = spawn(cmd, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    console.log(`[run] ${name} exited with code=${code} signal=${signal}`);
    if (code !== 0) {
      console.error(`[run] ${name} failed, shutting down other processes`);
      shutdown(code ?? 1);
    }
  });

  child.on("error", (err) => {
    console.error(`[run] ${name} start error`, err);
    shutdown(1);
  });

  return child;
}

const children = new Set();

function track(child) {
  children.add(child);
  child.on("exit", () => children.delete(child));
}

function shutdown(exitCode = 0) {
  for (const c of Array.from(children)) {
    try {
      if (!c.killed) c.kill("SIGTERM");
    } catch (e) {
      // ignore
    }
  }
  process.exit(exitCode);
}

process.on("SIGINT", () => {
  console.log("[run] SIGINT received");
  shutdown(0);
});

process.on("SIGTERM", () => {
  console.log("[run] SIGTERM received");
  shutdown(0);
});

async function runBuildMode() {
  const script = path.resolve(__dirname, "build-site.mjs");
  const child = spawn(process.execPath, [script], { cwd: projectRoot, stdio: "inherit" });
  return new Promise((resolve, reject) => {
    child.on("exit", (code) => (code === 0 ? resolve() : reject(code)));
    child.on("error", reject);
  });
}

function runDevMode() {
  // Next dev
  const next = spawnProcess(process.execPath, [path.resolve(__dirname, "run-next-dev.mjs")], "next");
  track(next);

  // Hugo server for insight
  const hugo = spawnProcess(bin("hugo"), ["server", "--source", "insight", "--buildDrafts", "--disableFastRender"], "hugo");
  track(hugo);

  // Decap proxy
  const decap = spawnProcess(process.execPath, [path.resolve(__dirname, "run-decap-server.mjs")], "decap");
  track(decap);

  // Upload/watch trigger
  const watchInsight = spawnProcess(process.execPath, [path.resolve(__dirname, "watch-insight-trigger.mjs")], "insight-watch");
  track(watchInsight);
}

function runWatchMode() {
  // Watcher that rebuilds site into out
  const watcher = spawnProcess(process.execPath, [path.resolve(__dirname, "watch-static-site.mjs")], "watch-static");
  track(watcher);

  // Serve the out directory with live-server
  const liveServerBin = bin("live-server");
  const live = spawnProcess(liveServerBin, ["out", "--host=127.0.0.1", "--port=4173", "--no-browser"], "live-server");
  track(live);
}

async function main() {
  const mode = process.argv[2] || "dev";

  if (mode === "build") {
    try {
      await runBuildMode();
      process.exit(0);
    } catch (code) {
      process.exit(code || 1);
    }
  }

  if (mode === "watch") {
    runWatchMode();
    return;
  }

  // default: dev
  runDevMode();
}

void main();

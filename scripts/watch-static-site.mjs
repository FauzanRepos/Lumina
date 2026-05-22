import { spawn } from "node:child_process";

import chokidar from "chokidar";
import path from "node:path";

const watchPaths = [
  "components",
  "data",
  "insight",
  "lib",
  "pages",
  "public",
  "styles",
  "types",
  "next.config.mjs",
  "package.json",
  "tailwind.config.cjs",
];

let activeBuild = null;
let queuedReason = null;

function runBuild(reason) {
  if (activeBuild) {
    queuedReason = reason;
    console.log(`[static-watch] queued rebuild after: ${reason}`);
    return;
  }

  console.log(`[static-watch] rebuilding site: ${reason}`);

  const buildScript = path.resolve(process.cwd(), "scripts", "build-site.mjs");

  activeBuild = spawn(process.execPath, [buildScript], {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  activeBuild.on("exit", (code) => {
    activeBuild = null;

    if (code === 0) {
      console.log("[static-watch] build completed");
    } else {
      console.error(`[static-watch] build failed with exit code ${code}`);
    }

    if (queuedReason) {
      const nextReason = queuedReason;
      queuedReason = null;
      runBuild(`queued change after ${nextReason}`);
    }
  });

  activeBuild.on("error", (error) => {
    activeBuild = null;
    console.error("[static-watch] failed to start build", error);
  });
}

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  ignored: [".git/**", ".next/**", "node_modules/**", "out/**"],
  awaitWriteFinish: {
    stabilityThreshold: 800,
    pollInterval: 100,
  },
});

watcher.on("all", (eventName, filePath) => {
  runBuild(`${eventName} ${filePath}`);
});

const shutdown = async (signal) => {
  console.log(`[static-watch] shutting down on ${signal}`);
  await watcher.close();

  if (activeBuild) {
    activeBuild.kill(signal);
  }

  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

console.log("[static-watch] watching source files for changes");
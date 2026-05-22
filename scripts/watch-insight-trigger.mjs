import chokidar from "chokidar";
import fs from "node:fs/promises";
import path from "node:path";

const watchPaths = ["insight/content", "insight/static"];
const triggerFile = path.join(process.cwd(), "pages", "insight", "_insight_trigger.ts");

const uploadsSrcDir = path.join(process.cwd(), "insight", "static", "uploads");
const uploadsDestDir = path.join(process.cwd(), "public", "insight", "uploads");

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function syncUploadEvent(eventName, filePath) {
  try {
    const abs = path.resolve(process.cwd(), filePath);
    if (!abs.startsWith(uploadsSrcDir)) return false;

    const rel = path.relative(uploadsSrcDir, abs);
    const destPath = path.join(uploadsDestDir, rel);

    if (eventName === "add" || eventName === "change" || eventName === "addDir") {
      await ensureDir(path.dirname(destPath));
      // copy file or directory; for files use copyFile, for directories ensure dir
      const stat = await fs.stat(abs);
      if (stat.isDirectory()) {
        await ensureDir(destPath);
        console.log(`[insight-watch] synced upload dir ${rel}`);
      } else {
        await fs.copyFile(abs, destPath);
        console.log(`[insight-watch] synced upload file ${rel}`);
      }
      return true;
    }

    if (eventName === "unlink") {
      // remove from dest
      await fs.rm(destPath, { force: true });
      console.log(`[insight-watch] removed upload file ${rel}`);
      return true;
    }

    if (eventName === "unlinkDir") {
      await fs.rm(destPath, { recursive: true, force: true });
      console.log(`[insight-watch] removed upload dir ${rel}`);
      return true;
    }
  } catch (err) {
    console.error("[insight-watch] failed to sync upload", err);
  }

  return false;
}

async function writeTrigger() {
  const timestamp = new Date().toISOString();
  const content = `export const INSIGHT_DEV_TRIGGER = ${JSON.stringify(timestamp)};\n`;
  await fs.mkdir(path.dirname(triggerFile), { recursive: true });
  await fs.writeFile(triggerFile, content, "utf8");
  console.log(`[insight-watch] wrote trigger ${timestamp}`);
}

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  ignored: [".git/**", "**/.DS_Store"],
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100,
  },
});

watcher.on("all", async (eventName, filePath) => {
  console.log(`[insight-watch] ${eventName} ${filePath}`);
  try {
    // If this was an uploads change, sync it into public for Next to serve
    const synced = await syncUploadEvent(eventName, filePath);
    if (synced) {
      // let hugo also rebuild; still write trigger so Next recompiles
      await writeTrigger();
      return;
    }

    await writeTrigger();
  } catch (err) {
    console.error("[insight-watch] failed to write trigger", err);
  }
});

process.on("SIGINT", async () => {
  console.log("[insight-watch] shutting down");
  await watcher.close();
  process.exit(0);
});

// create initial trigger
async function initialSyncUploads() {
  try {
    const stat = await fs.stat(uploadsSrcDir).catch(() => null);
    if (!stat) return;

    async function copyRecursive(src, dest) {
      const s = await fs.stat(src);
      if (s.isDirectory()) {
        await ensureDir(dest);
        const items = await fs.readdir(src);
        for (const it of items) {
          await copyRecursive(path.join(src, it), path.join(dest, it));
        }
      } else {
        await ensureDir(path.dirname(dest));
        await fs.copyFile(src, dest);
      }
    }

    await copyRecursive(uploadsSrcDir, uploadsDestDir);
    console.log("[insight-watch] initial upload sync completed");
  } catch (err) {
    console.error("[insight-watch] initial upload sync failed", err);
  }
}

void (async () => {
  await initialSyncUploads();
  await writeTrigger();
})();

console.log("[insight-watch] watching insight content for changes");

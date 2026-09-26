#!/usr/bin/env node
/**
 * Lumina Web - Decap CMS Backend Server
 * Express.js server following netlify-cms-proxy-server pattern
 */

import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pkg from "netlify-cms-proxy-server/dist/middlewares.js";
const { registerLocalFs } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.ADMIN_PORT || 8081;

// Git configuration
const GIT_REMOTE_URL = process.env.GIT_REMOTE_URL || "";
const GIT_SSH_KEY_PATH = process.env.GIT_SSH_KEY_PATH || "";
const GIT_TOKEN = process.env.GIT_TOKEN || "";
const GIT_COMMIT_ON_DEPLOY = process.env.GIT_COMMIT_ON_DEPLOY === "true";
const GIT_BRANCH = process.env.GIT_BRANCH || "main";

// Preview and Production URLs
const PREVIEW_URL = process.env.PREVIEW_URL || "http://localhost:3000";
const PRODUCTION_URL = process.env.PRODUCTION_URL || "";

// CORS middleware - allow requests from localhost on any port
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Ensure necessary directories exist
const uploadsDir = path.resolve(__dirname, "public/content/upload");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbDir = path.resolve(__dirname, "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database Setup (SQLite)
const dbPath = path.resolve(dbDir, "deployments.db");
const db = new sqlite3.Database(dbPath);

const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

// Initialize Database Tables
await dbRun(`
  CREATE TABLE IF NOT EXISTS deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL,
    trigger_time TEXT NOT NULL,
    completion_time TEXT,
    log TEXT,
    git_commit TEXT
  )
`);

// Middleware config
const jsonParser = express.json({ limit: "50mb" });
const urlencodedParser = express.urlencoded({ extended: true });
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1')) return next();
  jsonParser(req, res, (err) => {
    if (err) return next(err);
    urlencodedParser(req, res, next);
  });
});

// Git automation helper
const triggerGitSync = (commitMsg = "content: CMS update") => {
  return new Promise((resolve, reject) => {
    console.log(`[Git Automation] Triggering git commit & sync: "${commitMsg}"`);
    const repoRoot = path.resolve(__dirname);

    const safeMsg = String(commitMsg).replace(/"/g, '\\"');

    const authorCmds = [];
    if (process.env.GIT_AUTHOR_NAME) authorCmds.push(`git config user.name "${process.env.GIT_AUTHOR_NAME}"`);
    if (process.env.GIT_AUTHOR_EMAIL) authorCmds.push(`git config user.email "${process.env.GIT_AUTHOR_EMAIL}"`);
    const gitUserConfig = authorCmds.join(' && ');
    const commitCmd = `git add -A && if ! git diff --cached --quiet; then git commit -m "${safeMsg}"; else echo "[Git Automation] Nothing to commit"; fi`;

    let remoteCmd = `echo "[Git Automation] No remote URL configured, skipped push."`;
    if (GIT_REMOTE_URL) {
      let remoteUrlForConfig = GIT_REMOTE_URL;
      if (GIT_REMOTE_URL.startsWith("https://") && GIT_TOKEN) {
        const token = encodeURIComponent(GIT_TOKEN);
        remoteUrlForConfig = GIT_REMOTE_URL.replace(/^https:\/\//, `https://${token}@`);
      }
      remoteCmd = `(git remote set-url origin "${remoteUrlForConfig}" || git remote add origin "${remoteUrlForConfig}") && git push origin ${GIT_BRANCH}`;
    }

    const cmdParts = [];
    if (gitUserConfig) cmdParts.push(gitUserConfig);
    cmdParts.push(commitCmd);
    cmdParts.push(remoteCmd);
    const fullCmd = cmdParts.filter(Boolean).join(' && ');

    const execOptions = { cwd: repoRoot, env: { ...process.env } };
    if (GIT_SSH_KEY_PATH) {
      execOptions.env.GIT_SSH_COMMAND = `ssh -i "${GIT_SSH_KEY_PATH}" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null`;
    }

    exec(fullCmd, execOptions, (err, stdout, stderr) => {
      if (err) {
        console.error("[Git Automation] Error during git operation:", err);
        return reject({ error: err, stdout, stderr });
      }
      console.log("[Git Automation] Git sync completed:", stdout || stderr);
      return resolve({ stdout, stderr });
    });
  });
};

// Intercept CMS writes to trigger Git automation
const gitAutoCommitMiddleware = (req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    res.json = oldJson;
    const result = res.json(data);

    const { action } = req.body || {};

    if (res.statusCode === 200 && ["persistEntry", "persistMedia", "deleteFile", "deleteFiles"].includes(action)) {
      let commitMessage = `content: CMS update (${action})`;
      if (req.body.params?.options?.commitMessage) {
        commitMessage = req.body.params.options.commitMessage;
      }
      if (GIT_COMMIT_ON_DEPLOY) {
        triggerGitSync(commitMessage).catch((err) => {
          console.error('[Git Automation] Error during async git sync:', err);
        });
      }
    }
    return result;
  };
  next();
};

// Root: forward to the CMS
app.get('/', (req, res) => {
  return res.redirect('/admin');
});

// Admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/admin/index.html'));
});

// Serve Decap CMS configuration file
app.get("/config.yml", (req, res) => {
  const configPath = path.join(__dirname, "public/admin/config.yml");
  if (fs.existsSync(configPath)) {
    res.type("text/yaml").sendFile(configPath);
  } else {
    res.status(404).json({ error: "Configuration not found" });
  }
});

// Configuration endpoint
app.get('/api/config', (req, res) => {
  res.json({
    serverPort: PORT,
    gitBranch: GIT_BRANCH,
    gitAutoCommit: GIT_COMMIT_ON_DEPLOY,
    previewUrl: PREVIEW_URL,
    productionUrl: PRODUCTION_URL
  });
});

// Deployment API Endpoints
app.get("/api/deploy/history", async (req, res) => {
  try {
    const history = await dbAll("SELECT id, status, trigger_time, completion_time, git_commit FROM deployments ORDER BY id DESC LIMIT 10");
    res.json(history);
  } catch (err) {
    console.error("[Deployment API] Error reading history:", err);
    res.status(500).json({ error: "Failed to read deployment history" });
  }
});

// Deployment log detail
app.get("/api/deploy/log/:id", async (req, res) => {
  try {
    const deploy = await dbGet("SELECT log FROM deployments WHERE id = ?", [req.params.id]);
    if (deploy) {
      res.json({ log: deploy.log });
    } else {
      res.status(404).json({ error: "Log not found" });
    }
  } catch (err) {
    console.error("[Deployment API] Error reading log:", err);
    res.status(500).json({ error: "Failed to read log" });
  }
});

// Active status
app.get("/api/deploy/status", async (req, res) => {
  try {
    const active = await dbGet("SELECT id, status, trigger_time FROM deployments ORDER BY id DESC LIMIT 1");
    if (active) {
      res.json(active);
    } else {
      res.json({ status: "idle" });
    }
  } catch (err) {
    console.error("[Deployment API] Error reading status:", err);
    res.status(500).json({ error: "Failed to read status" });
  }
});

// Trigger build manually via API
app.post("/api/deploy", async (req, res) => {
  try {
    const active = await dbGet("SELECT id FROM deployments WHERE status = 'building'");
    if (active) {
      return res.status(400).json({ error: "A deployment is already in progress." });
    }

    const triggerTime = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const result = await dbRun(
      "INSERT INTO deployments (status, trigger_time, log, git_commit) VALUES ('building', ?, '', '')",
      [triggerTime]
    );
    const deployId = result.lastID;

    res.json({ success: true, deployId });

    const repoRoot = path.resolve(__dirname);
    let buildLog = `--- Deployment Build Log ID ${deployId} ---\n`;
    buildLog += `Triggered at: ${triggerTime}\n\n`;

    let commitInfo = "";
    try {
      exec("git rev-parse HEAD", { cwd: repoRoot }, (err, stdout) => {
        if (!err && stdout) {
          commitInfo = stdout.trim().substring(0, 8);
        }
      });
    } catch (e) {
      // Git not available
    }

    if (GIT_COMMIT_ON_DEPLOY) {
      const deployCommitMsg = `deploy: trigger build (id:${deployId})`;
      buildLog += `--- Git Operation: starting commit & push ---\n`;
      try {
        const gitResult = await triggerGitSync(deployCommitMsg);
        if (gitResult.stdout) buildLog += `Git stdout:\n${gitResult.stdout}\n`;
        if (gitResult.stderr) buildLog += `Git stderr:\n${gitResult.stderr}\n`;
        buildLog += `--- Git Operation: completed ---\n\n`;
      } catch (gitErr) {
        buildLog += `--- Git Operation: failed ---\n`;
        buildLog += `${gitErr?.error?.message || gitErr?.message || String(gitErr)}\n`;
        if (gitErr?.stderr) buildLog += `Git stderr:\n${gitErr.stderr}\n`;
        buildLog += `--- Proceeding with build despite git failure ---\n\n`;
        await dbRun("UPDATE deployments SET log = ? WHERE id = ?", [buildLog, deployId]).catch(() => {});
      }
    } else {
      buildLog += `--- Git Operation: skipped (staging mode) ---\n\n`;
    }

    console.log(`[Deployment] Started build job ID: ${deployId}`);

    const buildCmd = `npm run build`;
    const child = exec(buildCmd, { cwd: repoRoot });

    child.stdout.on("data", (data) => {
      buildLog += data;
      dbRun("UPDATE deployments SET log = ? WHERE id = ?", [buildLog, deployId]).catch(() => {});
    });

    child.stderr.on("data", (data) => {
      buildLog += `[ERROR] ${data}`;
      dbRun("UPDATE deployments SET log = ? WHERE id = ?", [buildLog, deployId]).catch(() => {});
    });

    child.on("close", (code) => {
      const completionTime = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      const finalStatus = code === 0 ? "success" : "failed";
      buildLog += `\nFinished build with exit code: ${code}\n`;
      buildLog += `Completed at: ${completionTime}\n`;

      dbRun(
        "UPDATE deployments SET status = ?, completion_time = ?, log = ?, git_commit = ? WHERE id = ?",
        [finalStatus, completionTime, buildLog, commitInfo, deployId]
      ).then(() => {
        console.log(`[Deployment] Build job ID: ${deployId} completed with status: ${finalStatus}`);
      }).catch((err) => {
        console.error("[Deployment] Error updating DB status:", err);
      });
    });
  } catch (err) {
    console.error("[Deployment API] Error triggering deployment:", err);
    res.status(500).json({ error: "Failed to trigger deployment" });
  }
});

// Serve uploaded media
app.use("/content/upload", express.static(uploadsDir));

// Apply git auto-commit middleware to CMS proxy
app.use("/api", gitAutoCommitMiddleware);

// Netlify CMS Filesystem Proxy middleware
process.env.GIT_REPO_DIRECTORY = path.resolve(__dirname);
registerLocalFs(app);

const server = app.listen(PORT, () => {
  console.log(`[Server] Decap CMS Admin running at http://localhost:${PORT}`);
  console.log(`[Server] Content repository: ${process.env.GIT_REPO_DIRECTORY}`);
  console.log(`[Server] Database: ${dbPath}`);
  console.log(`[Server] Git: Branch=${GIT_BRANCH}, Remote=${GIT_REMOTE_URL ? "configured" : "not configured"}, Auto-commit=${GIT_COMMIT_ON_DEPLOY}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Server] Shutting down gracefully...');
  server.close(() => {
    db.close(() => {
      console.log('[Server] Database closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  server.close(() => {
    db.close(() => {
      process.exit(0);
    });
  });
});

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const nextBinary = path.resolve(projectRoot, "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
const hugoBinary = path.resolve(projectRoot, "node_modules", ".bin", process.platform === "win32" ? "hugo.cmd" : "hugo");

function runCommand(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", cwd: projectRoot, ...opts });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });

    child.on("error", (err) => reject(err));
  });
}

async function main() {
  try {
    console.log("[build-site] running Next build...");
    await runCommand(nextBinary, ["build"]);

    console.log("[build-site] preparing insight output...");
    await runCommand(process.execPath, [path.resolve(scriptDir, "prepare-insight-output.mjs")]);

    console.log("[build-site] running Hugo to build insight site...");
    await runCommand(hugoBinary, ["--source", "insight", "--minify"]);

    console.log("[build-site] build complete");
  } catch (err) {
    console.error("[build-site] build failed", err);
    process.exit(1);
  }
}

main();

import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.DECAP_SERVER_PORT || 8081);
const host = process.env.DECAP_SERVER_HOST || "127.0.0.1";

function canConnect(targetPort, targetHost) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: targetHost, port: targetPort });

    const finish = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", (error) => {
      if (error.code === "ECONNREFUSED" || error.code === "EHOSTUNREACH") {
        finish(false);
        return;
      }

      finish(false);
    });

    socket.setTimeout(1000);
  });
}

function keepProcessAlive() {
  const interval = setInterval(() => {}, 60_000);

  const stop = () => {
    clearInterval(interval);
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

async function main() {
  if (await canConnect(port, host)) {
    console.log(`[decap-proxy] reusing existing server on ${host}:${port}`);
    keepProcessAlive();
    return;
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const binaryName = process.platform === "win32" ? "decap-server.cmd" : "decap-server";
  const binaryPath = path.resolve(scriptDir, "../node_modules/.bin", binaryName);
  const child = spawn(binaryPath, [], {
    stdio: "inherit",
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => forwardSignal("SIGINT"));
  process.on("SIGTERM", () => forwardSignal("SIGTERM"));

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    console.error("[decap-proxy] failed to start decap-server", error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error("[decap-proxy] unexpected failure", error);
  process.exit(1);
});
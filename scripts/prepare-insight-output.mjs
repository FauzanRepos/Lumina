import { rmSync } from "node:fs";
import { resolve } from "node:path";

rmSync(resolve(process.cwd(), "out/insight"), {
  recursive: true,
  force: true,
});
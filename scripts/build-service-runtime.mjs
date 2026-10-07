import fs from "node:fs";
import path from "node:path";

const [, , serviceName] = process.argv;

if (!serviceName) {
  console.error("Usage: node scripts/build-service-runtime.mjs <service-name>");
  process.exit(1);
}

const root = process.cwd();
const serviceDir = path.join(root, "services", serviceName);
const sourceFiles = [
  "src/runtime.mjs",
  "src/index.ts",
  "src/providers.ts",
  "src/prompts.ts",
  "src/orchestrator.ts",
].filter((file) => fs.existsSync(path.join(serviceDir, file)));

const distDir = path.join(serviceDir, "dist");
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const file of sourceFiles) {
  const src = path.join(serviceDir, file);
  const out = path.join(distDir, path.basename(file));
  fs.copyFileSync(src, out);
}

const buildInfo = {
  service: serviceName,
  builtAt: new Date().toISOString(),
  files: sourceFiles.map((file) => path.basename(file)),
};

fs.writeFileSync(
  path.join(distDir, "build-info.json"),
  JSON.stringify(buildInfo, null, 2) + "\n",
  "utf8",
);

console.log(`Built ${serviceName} runtime artifact(s).`);

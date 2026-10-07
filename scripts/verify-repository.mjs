import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const requiredPaths = [
  "package.json",
  "README.md",
  "PROJECT_INDEX.md",
  "CHANGELOG.md",
  "LICENSE.md",
  ".gitignore",
  "apps",
  "services",
  "packages",
  "docs",
  "assets",
];

const missing = requiredPaths.filter((entry) => !existsSync(resolve(root, entry)));

const requiredFolders = [
  "apps/web",
  "apps/admin",
  "services/api",
  "services/ai",
  "packages/ui",
  "packages/database",
  "docs/brand",
  "docs/architecture",
  "docs/validation",
];

const missingFolders = requiredFolders.filter((entry) => !existsSync(resolve(root, entry)));

if (missing.length > 0 || missingFolders.length > 0) {
  console.error("Repository validation failed.");
  if (missing.length > 0) {
    console.error("Missing files:", missing.join(", "));
  }
  if (missingFolders.length > 0) {
    console.error("Missing folders:", missingFolders.join(", "));
  }
  process.exit(1);
}

console.log("Repository structure validated successfully.");
console.log("Root entries:", readdirSync(root).slice(0, 20).join(", "));

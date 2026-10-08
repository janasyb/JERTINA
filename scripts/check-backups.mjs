import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  ".env.example",
  ".env.local.example",
  ".env.production.example",
  "docs/ops/Backup-Recovery-Plan.md",
  "infrastructure/backup/policies/retention-policy.example.json",
];

const missing = required.filter((entry) => !fs.existsSync(path.join(root, entry)));

if (missing.length > 0) {
  console.error("Backup validation failed.");
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}

console.log("Backup validation passed.");

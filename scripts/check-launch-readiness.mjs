import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "docs/launch/Go-Live-Checklist.md",
  "docs/ops/Production-Cutover-Plan.md",
  "docs/ops/Rollback-Plan.md",
  "docs/launch/Launch-Readiness.md",
  "infrastructure/release/README.md",
  "infrastructure/release/release-gate.example.json",
  "scripts/check-performance.mjs",
  "scripts/check-accessibility.mjs",
  "scripts/check-compliance.mjs",
  "scripts/check-backups.mjs",
];

const missing = required.filter((entry) => !fs.existsSync(path.join(root, entry)));

if (missing.length > 0) {
  console.error("Launch readiness validation failed.");
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}

const gate = JSON.parse(fs.readFileSync(path.join(root, "infrastructure/release/release-gate.example.json"), "utf8"));
const requiredFlags = ["ci", "smoke", "build", "test", "typecheck", "security", "backup", "performance", "accessibility", "monitoring", "rollbackPlan", "cutoverPlan"];
const missingFlags = requiredFlags.filter((flag) => gate[flag] !== true);

if (missingFlags.length > 0) {
  console.error("Launch gate is not ready.");
  console.error("Unset flags:", missingFlags.join(", "));
  process.exit(1);
}

console.log("Launch readiness validation passed.");

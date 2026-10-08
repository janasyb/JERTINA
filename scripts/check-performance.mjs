import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "docs/quality/Performance-Budgets.md",
  "docs/accessibility/Accessibility-Standard.md",
  "docs/qa/Launch-QA-Checklist.md",
  "infrastructure/qa/performance-budgets.example.json",
  "scripts/check-health.mjs",
];

const missing = required.filter((entry) => !fs.existsSync(path.join(root, entry)));

if (missing.length > 0) {
  console.error("Performance/QA validation failed.");
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}

console.log("Performance/QA validation passed.");

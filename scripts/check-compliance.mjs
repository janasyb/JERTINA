import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const required = [
  "docs/security/Security-Policy.md",
  "docs/security/Compliance-Checklist.md",
  "docs/security/Vulnerability-Disclosure.md",
  "docs/ops/Incident-Response-Runbook.md",
  "docs/ops/Backup-Recovery-Plan.md",
  "infrastructure/security/README.md",
  "scripts/scan-secrets.mjs",
  "scripts/check-backups.mjs",
];

const missing = required.filter((entry) => !fs.existsSync(path.join(root, entry)));

if (missing.length > 0) {
  console.error("Compliance validation failed.");
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}

console.log("Compliance validation passed.");

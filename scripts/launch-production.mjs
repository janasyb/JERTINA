import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const gateFile = path.join(root, "infrastructure/release/production-gate.example.json");

if (!fs.existsSync(gateFile)) {
  console.error("Production gate file is missing.");
  process.exit(1);
}

const gate = JSON.parse(fs.readFileSync(gateFile, "utf8"));
const required = [
  "ci",
  "smoke",
  "build",
  "test",
  "typecheck",
  "security",
  "backup",
  "performance",
  "accessibility",
  "monitoring",
  "rollbackPlan",
  "cutoverPlan",
  "supportPlan",
];

const missing = required.filter((flag) => gate[flag] !== true);

if (missing.length > 0) {
  console.error("Production launch blocked.");
  console.error("Unset readiness flags:", missing.join(", "));
  process.exit(1);
}

if (gate.founderApproval !== true) {
  console.error("Production launch blocked: founder approval is required.");
  process.exit(1);
}

if (gate.domainsConfigured !== true) {
  console.error("Production launch blocked: production domains are not configured.");
  process.exit(1);
}

console.log("Production launch gate passed.");
console.log("JERTINA is ready for production cutover.");

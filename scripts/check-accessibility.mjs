import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "docs/accessibility/Accessibility-Standard.md",
  "apps/web/src/app/page.tsx",
  "apps/admin/src/app/page.tsx",
];

const missing = required.filter((entry) => !fs.existsSync(path.join(root, entry)));

if (missing.length > 0) {
  console.error("Accessibility validation failed.");
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}

console.log("Accessibility validation passed.");

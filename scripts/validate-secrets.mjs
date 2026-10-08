import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const templates = [".env.example", ".env.local.example", ".env.production.example"];

const missing = templates.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error("Missing environment templates:", missing.join(", "));
  process.exit(1);
}

console.log("Secrets templates validated successfully.");

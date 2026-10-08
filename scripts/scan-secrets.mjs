import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [".env", ".env.local", ".env.production", "apps", "services", "packages", "docs", "infrastructure", "scripts"];
const secretPatterns = [/api[_-]?key/i, /secret/i, /password/i, /token/i];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".turbo" || entry.name === ".next") {
      continue;
    }
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const findings = [];
for (const target of targets) {
  const full = path.join(root, target);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isFile()) {
    const content = fs.readFileSync(full, "utf8");
    if (secretPatterns.some((pattern) => pattern.test(content))) {
      findings.push(target);
    }
    continue;
  }
  for (const file of walk(full)) {
    const content = fs.readFileSync(file, "utf8");
    if (secretPatterns.some((pattern) => pattern.test(content)) && !file.endsWith(".example")) {
      findings.push(path.relative(root, file));
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secret-like strings found:");
  for (const item of findings.slice(0, 25)) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("Secret scan passed.");

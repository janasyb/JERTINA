import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "README.md",
  "PROJECT_INDEX.md",
  "CHANGELOG.md",
  "LICENSE.md",
  "apps/web/package.json",
  "apps/admin/package.json",
  "services/api/package.json",
  "services/ai/package.json",
  "packages/design-tokens/package.json",
  "packages/ui/package.json",
  "packages/database/package.json",
];

const requiredSources = [
  "packages/design-tokens/src/index.ts",
  "packages/ui/src/index.ts",
  "packages/types/src/index.ts",
  "packages/utils/src/index.ts",
  "packages/config/src/index.ts",
  "packages/database/src/index.ts",
  "services/api/src/index.ts",
  "services/api/src/server.ts",
  "services/ai/src/index.ts",
  "services/ai/src/orchestrator.ts",
  "services/ai/src/providers.ts",
  "services/ai/src/prompts.ts",
  "services/auth/src/index.ts",
  "services/commerce/src/index.ts",
  "services/orders/src/index.ts",
  "services/inventory/src/index.ts",
  "services/payments/src/index.ts",
  "services/notifications/src/index.ts",
  "services/search/src/index.ts",
  "apps/web/src/app/page.tsx",
  "apps/admin/src/app/page.tsx",
];

const missingFiles = requiredFiles.filter((entry) => !existsSync(resolve(root, entry)));
const missingSources = requiredSources.filter((entry) => !existsSync(resolve(root, entry)));

if (missingFiles.length > 0 || missingSources.length > 0) {
  console.error("Workspace smoke test failed.");
  if (missingFiles.length > 0) {
    console.error("Missing required files:", missingFiles.join(", "));
  }
  if (missingSources.length > 0) {
    console.error("Missing required source files:", missingSources.join(", "));
  }
  process.exit(1);
}

const packageChecks = [
  "packages/design-tokens/package.json",
  "packages/ui/package.json",
  "packages/types/package.json",
  "packages/utils/package.json",
  "packages/config/package.json",
  "packages/database/package.json",
  "services/api/package.json",
  "services/ai/package.json",
  "apps/web/package.json",
  "apps/admin/package.json",
];

const packageNames = packageChecks.map((file) => {
  const parsed = JSON.parse(readFileSync(resolve(root, file), "utf8"));
  return `${parsed.name}@${parsed.version}`;
});

console.log("Workspace smoke test passed.");
console.log("Validated packages:", packageNames.join(", "));

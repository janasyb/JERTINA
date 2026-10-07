import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const requiredEntrypoints = [
  "packages/design-tokens/src/index.ts",
  "packages/ui/src/index.ts",
  "packages/types/src/index.ts",
  "packages/utils/src/index.ts",
  "packages/config/src/index.ts",
  "packages/database/src/index.ts",
  "services/api/src/index.ts",
  "services/ai/src/index.ts",
  "services/auth/src/index.ts",
  "services/commerce/src/index.ts",
  "services/orders/src/index.ts",
  "services/inventory/src/index.ts",
  "services/payments/src/index.ts",
  "services/notifications/src/index.ts",
  "services/search/src/index.ts",
  "apps/web/src/app/page.tsx",
  "apps/admin/src/app/page.tsx"
];

const missing = requiredEntrypoints.filter((entry) => !existsSync(resolve(root, entry)));

if (missing.length > 0) {
  console.error("Workspace smoke test failed.");
  console.error("Missing entrypoints:", missing.join(", "));
  process.exit(1);
}

const loadChecks = [
  await import(resolve(root, "packages/design-tokens/src/index.ts")),
  await import(resolve(root, "packages/ui/src/index.ts")),
  await import(resolve(root, "packages/types/src/index.ts")),
  await import(resolve(root, "packages/utils/src/index.ts")),
  await import(resolve(root, "packages/config/src/index.ts")),
  await import(resolve(root, "packages/database/src/index.ts")),
  await import(resolve(root, "services/ai/src/orchestrator.ts")),
];

const names = loadChecks.map((module, index) => `module-${index + 1}:${Object.keys(module).length}`);
console.log("Workspace smoke test passed.");
console.log("Loaded modules:", names.join(", "));

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const projects = [
  "apps/web",
  "apps/admin",
  "services/api",
  "services/ai",
  "services/auth",
  "services/commerce",
  "services/orders",
  "services/inventory",
  "services/payments",
  "services/notifications",
  "services/search",
  "packages/config",
  "packages/database",
  "packages/design-tokens",
  "packages/types",
  "packages/ui",
  "packages/utils",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

for (const project of projects) {
  const projectDir = path.join(root, project);
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) continue;

  const packageJson = readJson(packageJsonPath);
  packageJson.scripts ??= {};
  packageJson.scripts.typecheck = "tsc --noEmit -p tsconfig.json";
  writeJson(packageJsonPath, packageJson);

  const tsconfigPath = path.join(projectDir, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    const isApp = project.startsWith("apps/");
    const tsconfig = isApp
      ? {
          extends: "../../tsconfig.base.json",
          compilerOptions: {
            jsx: "preserve",
            baseUrl: ".",
            paths: {
              "@/*": ["./src/*"],
            },
          },
          include: ["src", "next-env.d.ts"],
          exclude: ["node_modules"],
        }
      : {
          extends: "../../tsconfig.base.json",
          include: ["src"],
          exclude: ["node_modules"],
        };

    writeJson(tsconfigPath, tsconfig);
  }
}

console.log("Workspace tsconfig files updated.");

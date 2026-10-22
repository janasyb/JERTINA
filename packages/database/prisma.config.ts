import { defineConfig } from "prisma/config";

// The fallback is for this repository's local Docker development database only.
// Production deployments must supply DATABASE_URL through their secret manager.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5433/jertina";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});

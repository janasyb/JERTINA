import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const localDevelopmentUrl =
  "postgresql://postgres:postgres@localhost:5433/jertina";
const connectionString = process.env.DATABASE_URL ?? localDevelopmentUrl;
const globalForPrisma = globalThis;

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.__jertinaPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__jertinaPrisma = prisma;
}

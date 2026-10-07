export interface DatabaseConfig {
  provider: "postgresql";
  url: string;
  shadowUrl?: string;
}

export interface DatabasePackageInfo {
  packageName: "@jertina/database";
  version: string;
  status: "scaffold" | "ready" | "live";
}

export const databasePackageInfo: DatabasePackageInfo = {
  packageName: "@jertina/database",
  version: "0.2.0",
  status: "scaffold",
};

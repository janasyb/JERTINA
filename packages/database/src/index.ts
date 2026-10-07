export type DatabaseHealth = "healthy" | "degraded" | "offline";

export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  database: string;
}

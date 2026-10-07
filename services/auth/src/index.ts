export interface AuthServiceStatus {
  service: "@jertina/auth";
  status: "scaffold" | "ready" | "live";
}

export const authServiceStatus: AuthServiceStatus = {
  service: "@jertina/auth",
  status: "scaffold",
};

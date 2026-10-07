export interface SearchServiceStatus {
  service: "@jertina/search";
  status: "scaffold" | "ready" | "live";
}

export const searchServiceStatus: SearchServiceStatus = {
  service: "@jertina/search",
  status: "scaffold",
};

export interface InventoryServiceStatus {
  service: "@jertina/inventory";
  status: "scaffold" | "ready" | "live";
}

export const inventoryServiceStatus: InventoryServiceStatus = {
  service: "@jertina/inventory",
  status: "scaffold",
};

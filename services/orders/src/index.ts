export interface OrdersServiceStatus {
  service: "@jertina/orders";
  status: "scaffold" | "ready" | "live";
}

export const ordersServiceStatus: OrdersServiceStatus = {
  service: "@jertina/orders",
  status: "scaffold",
};

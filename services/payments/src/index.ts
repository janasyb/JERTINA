export interface PaymentsServiceStatus {
  service: "@jertina/payments";
  status: "scaffold" | "ready" | "live";
}

export const paymentsServiceStatus: PaymentsServiceStatus = {
  service: "@jertina/payments",
  status: "scaffold",
};

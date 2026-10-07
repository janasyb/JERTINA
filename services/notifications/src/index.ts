export interface NotificationsServiceStatus {
  service: "@jertina/notifications";
  status: "scaffold" | "ready" | "live";
}

export const notificationsServiceStatus: NotificationsServiceStatus = {
  service: "@jertina/notifications",
  status: "scaffold",
};

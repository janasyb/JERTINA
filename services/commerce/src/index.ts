export interface CommerceDomainStatus {
  service: "@jertina/commerce";
  status: "scaffold" | "ready" | "live";
}

export const commerceDomainStatus: CommerceDomainStatus = {
  service: "@jertina/commerce",
  status: "scaffold",
};

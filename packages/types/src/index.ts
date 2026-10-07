export type Id = string;

export type Timestamp = string;

export interface EntityBase {
  id: Id;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

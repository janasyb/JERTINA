export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

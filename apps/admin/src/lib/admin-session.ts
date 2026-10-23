import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "jertina_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

function sessionSecret(): string | null {
  const value = process.env.JERTINA_ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

function signatureFor(expiry: string, secret: string): string {
  return createHmac("sha256", secret).update(expiry).digest("base64url");
}

export function createAdminSession(): { value: string; maxAge: number } | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const maxAge = ADMIN_SESSION_TTL_SECONDS;
  const expiry = String(Math.floor(Date.now() / 1000) + maxAge);
  return { value: `${expiry}.${signatureFor(expiry, secret)}`, maxAge };
}

export function isValidAdminSession(cookieValue: string | undefined): boolean {
  const secret = sessionSecret();
  if (!secret || !cookieValue) return false;
  const match = /^(\d{10,12})\.([A-Za-z0-9_-]{43})$/.exec(cookieValue);
  if (!match) return false;

  const expiry = Number(match[1]);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(signatureFor(match[1], secret), "base64url");
  const provided = Buffer.from(match[2], "base64url");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export function constantTimeTextEqual(supplied: string, expected: string): boolean {
  const left = Buffer.from(supplied, "utf8");
  const right = Buffer.from(expected, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

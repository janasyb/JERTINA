import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  constantTimeTextEqual,
} from "../../../../lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.JERTINA_ADMIN_UI_PASSWORD?.trim();
  const sessionSecret = process.env.JERTINA_ADMIN_SESSION_SECRET?.trim();
  if (!configuredPassword || configuredPassword.length < 20 || !sessionSecret || sessionSecret.length < 32) {
    return NextResponse.json(
      { error: "Admin login is not configured. Set JERTINA_ADMIN_UI_PASSWORD and JERTINA_ADMIN_SESSION_SECRET in the local .env file, then restart the admin container." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON request." }, { status: 400 });
  }
  const password = body && typeof body === "object" && "password" in body && typeof body.password === "string"
    ? body.password
    : "";
  if (!constantTimeTextEqual(password, configuredPassword)) {
    return NextResponse.json(
      { error: "The password was not accepted." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const session = createAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin session signing is not configured." }, { status: 503 });
  }

  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = request.nextUrl.protocol === "https:" || forwardedProtocol === "https";
  const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

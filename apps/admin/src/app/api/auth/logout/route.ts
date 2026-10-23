import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = request.nextUrl.protocol === "https:" || forwardedProtocol === "https";
  const response = NextResponse.json({ authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

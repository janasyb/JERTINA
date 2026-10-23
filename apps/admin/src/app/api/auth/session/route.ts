import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "../../../../lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { authenticated: isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

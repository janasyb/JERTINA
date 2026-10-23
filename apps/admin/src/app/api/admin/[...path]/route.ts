import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "../../../../lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyAdminRequest(request: NextRequest, context: RouteContext) {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(sessionCookie)) {
    return NextResponse.json({ error: "Sign in to manage the JERTINA catalog." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const adminToken = process.env.JERTINA_ADMIN_API_TOKEN?.trim();
  if (!adminToken) {
    return NextResponse.json({ error: "The admin API token is not configured on the server." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const { path = [] } = await context.params;
  if (path.length === 0 || path.some((segment) => !/^[A-Za-z0-9_-]{1,180}$/.test(segment))) {
    return NextResponse.json({ error: "Invalid admin API path." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const base = (process.env.JERTINA_API_URL || "http://api:4000").replace(/\/+$/, "");
  const upstreamUrl = `${base}/api/admin/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers({ Authorization: `Bearer ${adminToken}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
    const responseBody = await upstream.text();
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Admin API proxy request failed", {
      method: request.method,
      path: path.join("/"),
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "The product API could not be reached. Confirm the API container is running." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyAdminRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyAdminRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyAdminRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyAdminRequest(request, context);
}

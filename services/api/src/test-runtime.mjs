import assert from "node:assert/strict";
import { createApiServer } from "./runtime.mjs";
import { prisma } from "@jertina/database/client";

const server = createApiServer(0);

try {
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object", "server should listen on a TCP port");
  const origin = `http://127.0.0.1:${address.port}`;

  const rootResponse = await fetch(`${origin}/`);
  assert.equal(rootResponse.status, 200, "root endpoint should respond with HTTP 200");
  const rootPayload = await rootResponse.json();
  assert.equal(rootPayload.service, "@jertina/api");
  assert.equal(rootPayload.status, "running");

  const preflightResponse = await fetch(`${origin}/api/admin/products`, {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:3001" },
  });
  assert.equal(preflightResponse.status, 204, "CORS preflight should be supported");
  assert.equal(
    preflightResponse.headers.get("access-control-allow-origin"),
    "http://localhost:3001",
  );

  const adminResponse = await fetch(`${origin}/api/admin/products`);
  assert.ok(
    adminResponse.status === 401 || adminResponse.status === 503,
    "admin endpoint must reject requests without a valid configured Bearer token",
  );

  const missingResponse = await fetch(`${origin}/not-a-real-route`);
  assert.equal(missingResponse.status, 404, "unknown routes should return HTTP 404");

  console.log("API runtime tests passed: health response, CORS preflight, admin access guard, and 404 handling.");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
}

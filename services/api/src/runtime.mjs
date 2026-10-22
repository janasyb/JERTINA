import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import { prisma } from "@jertina/database/client";

const MAX_BODY_BYTES = 1024 * 1024;
const VALID_PRODUCT_STATUSES = new Set(["DRAFT", "ACTIVE", "ARCHIVED"]);
const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(res, status, payload) {
  if (res.headersSent) return;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(payload));
}

function applyCors(req, res) {
  const configured = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([...DEFAULT_CORS_ORIGINS, ...configured]);
  const origin = req.headers.origin;

  res.setHeader("Vary", "Origin");
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "600");
  }
}

function requireAdmin(req, res) {
  const expectedToken = process.env.JERTINA_ADMIN_API_TOKEN?.trim();
  if (!expectedToken) {
    sendJson(res, 503, {
      error: "Admin API is not configured. Set JERTINA_ADMIN_API_TOKEN before using admin endpoints.",
    });
    return false;
  }

  const authorization = req.headers.authorization ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  if (!match) {
    sendJson(res, 401, { error: "A valid Bearer token is required." });
    return false;
  }

  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(match[1].trim());
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    sendJson(res, 401, { error: "A valid Bearer token is required." });
    return false;
  }

  return true;
}

async function readJson(req) {
  const contentType = String(req.headers["content-type"] ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    throw new HttpError(415, "Content-Type must be application/json.");
  }

  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      throw new HttpError(413, "Request body is too large.");
    }
    chunks.push(chunk);
  }

  if (bytes === 0) throw new HttpError(400, "A JSON request body is required.");
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("The body must be a JSON object.");
    }
    return value;
  } catch {
    throw new HttpError(400, "Request body contains invalid JSON or is not a JSON object.");
  }
}

function requiredText(value, field, maxLength) {
  if (typeof value !== "string") throw new HttpError(400, `${field} is required.`);
  const result = value.trim();
  if (!result) throw new HttpError(400, `${field} is required.`);
  if (result.length > maxLength) {
    throw new HttpError(400, `${field} must be ${maxLength} characters or fewer.`);
  }
  return result;
}

function optionalText(value, field, maxLength) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") throw new HttpError(400, `${field} must be text or null.`);
  const result = value.trim();
  if (result.length > maxLength) {
    throw new HttpError(400, `${field} must be ${maxLength} characters or fewer.`);
  }
  return result || null;
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180)
    .replace(/-+$/g, "");
}

function productSlug(value, field = "slug") {
  const slug = slugify(requiredText(value, field, 180));
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new HttpError(400, `${field} must contain letters, numbers, and hyphens only.`);
  }
  return slug;
}

function productSku(value) {
  const sku = requiredText(value, "sku", 64).toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9._-]*$/.test(sku)) {
    throw new HttpError(400, "sku may contain only letters, numbers, dots, underscores, and hyphens.");
  }
  return sku;
}

function productPrice(value) {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, "price is required and must be greater than zero.");
  }
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0 || price > 9_999_999_999.99) {
    throw new HttpError(400, "price must be a valid positive number.");
  }
  if (Math.abs(price * 100 - Math.round(price * 100)) > 1e-7) {
    throw new HttpError(400, "price may have no more than two decimal places.");
  }
  return price.toFixed(2);
}

function stockQuantity(value) {
  const qty = value === undefined ? 0 : Number(value);
  if (!Number.isInteger(qty) || qty < 0 || qty > 100_000_000) {
    throw new HttpError(400, "stockQty must be a non-negative whole number.");
  }
  return qty;
}

function currencyCode(value) {
  const currency = requiredText(value ?? "USD", "currency", 3).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new HttpError(400, "currency must be a three-letter currency code, such as USD or GHS.");
  }
  return currency;
}

function productStatus(value, fallback = "DRAFT") {
  const status = String(value ?? fallback).toUpperCase();
  if (!VALID_PRODUCT_STATUSES.has(status)) {
    throw new HttpError(400, "status must be DRAFT, ACTIVE, or ARCHIVED.");
  }
  return status;
}

function categoryId(value) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return requiredText(value, "categoryId", 64);
}

function normalizeImages(value) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 10) {
    throw new HttpError(400, "images must be an array containing no more than 10 image URLs.");
  }

  return value.map((item, index) => {
    const rawUrl = typeof item === "string" ? item : item?.url;
    const url = requiredText(rawUrl, `images[${index}].url`, 2048);
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new HttpError(400, `images[${index}].url must be a valid absolute URL.`);
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new HttpError(400, `images[${index}].url must use HTTP or HTTPS.`);
    }
    const rawAlt = typeof item === "object" && item !== null ? item.altText : undefined;
    const altText = rawAlt === undefined ? null : optionalText(rawAlt, `images[${index}].altText`, 300);
    return { url: parsed.toString(), altText, sortOrder: index };
  });
}

function pageOptions(url) {
  const pageRaw = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(url.searchParams.get("limit") ?? "50", 10);
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? Math.min(pageRaw, 1_000_000) : 1;
  const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 50;
  return { page, limit, skip: (page - 1) * limit };
}

function mapDatabaseError(error) {
  if (error instanceof HttpError) return { status: error.status, message: error.message };
  if (error?.code === "P2002") return { status: 409, message: "A record with that name, slug, or SKU already exists." };
  if (error?.code === "P2003") return { status: 400, message: "The request references a related record that does not exist." };
  if (error?.code === "P2025") return { status: 404, message: "The requested record was not found." };
  if (["P1000", "P1001", "P1002", "P1003", "P2024"].includes(error?.code)) {
    return { status: 503, message: "The database is unavailable. Check that PostgreSQL is running and DATABASE_URL is correct." };
  }
  return { status: 500, message: "The server could not complete the request." };
}

async function writeAudit(tx, action, entityType, entityId, metadata) {
  await tx.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      metadata,
    },
  });
}

async function handleAdmin(req, res, url, segments) {
  if (!requireAdmin(req, res)) return;
  const resource = segments[2];
  const recordId = segments[3];

  if (resource === "overview" && req.method === "GET" && segments.length === 3) {
    const [totalProducts, activeProducts, draftProducts, lowStockProducts, orders, customers] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.product.count({ where: { status: "DRAFT" } }),
        prisma.product.count({ where: { status: "ACTIVE", stockQty: { lte: 5 } } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
      ]);
    return sendJson(res, 200, {
      products: { total: totalProducts, active: activeProducts, draft: draftProducts, lowStock: lowStockProducts },
      orders,
      customers,
    });
  }

  if (resource === "products" && req.method === "GET" && segments.length === 3) {
    const { page, limit, skip } = pageOptions(url);
    const statusParam = (url.searchParams.get("status") ?? "ALL").toUpperCase();
    if (statusParam !== "ALL" && !VALID_PRODUCT_STATUSES.has(statusParam)) {
      throw new HttpError(400, "status must be ALL, DRAFT, ACTIVE, or ARCHIVED.");
    }
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
    const where = {
      ...(statusParam === "ALL" ? {} : { status: statusParam }),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.product.count({ where }),
    ]);
    return sendJson(res, 200, { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  }

  if (resource === "products" && req.method === "POST" && segments.length === 3) {
    const body = await readJson(req);
    const name = requiredText(body.name, "name", 160);
    const slug = productSlug(body.slug ?? name);
    const sku = productSku(body.sku);
    const data = {
      name,
      slug,
      sku,
      description: optionalText(body.description, "description", 5000) ?? null,
      status: productStatus(body.status),
      price: productPrice(body.price),
      currency: currencyCode(body.currency ?? "USD"),
      stockQty: stockQuantity(body.stockQty),
      categoryId: categoryId(body.categoryId) ?? null,
    };
    const images = normalizeImages(body.images ?? []);
    if (images?.length) data.images = { create: images };
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data, include: { category: true, images: true } });
      await writeAudit(tx, "PRODUCT_CREATED", "Product", created.id, { name: created.name, sku: created.sku, status: created.status });
      return created;
    });
    return sendJson(res, 201, { item: product });
  }

  if (resource === "products" && recordId && req.method === "PATCH" && segments.length === 4) {
    const body = await readJson(req);
    const data = {};
    if (Object.hasOwn(body, "name")) data.name = requiredText(body.name, "name", 160);
    if (Object.hasOwn(body, "slug")) data.slug = productSlug(body.slug);
    if (Object.hasOwn(body, "sku")) data.sku = productSku(body.sku);
    if (Object.hasOwn(body, "description")) data.description = optionalText(body.description, "description", 5000);
    if (Object.hasOwn(body, "price")) data.price = productPrice(body.price);
    if (Object.hasOwn(body, "currency")) data.currency = currencyCode(body.currency);
    if (Object.hasOwn(body, "stockQty")) data.stockQty = stockQuantity(body.stockQty);
    if (Object.hasOwn(body, "status")) data.status = productStatus(body.status);
    if (Object.hasOwn(body, "categoryId")) data.categoryId = categoryId(body.categoryId);
    if (Object.hasOwn(body, "images")) {
      const images = normalizeImages(body.images);
      data.images = { deleteMany: {}, ...(images?.length ? { create: images } : {}) };
    }
    if (Object.keys(data).length === 0) throw new HttpError(400, "Provide at least one supported product field to update.");

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({ where: { id: recordId }, data, include: { category: true, images: true } });
      const action = updated.status === "ARCHIVED" ? "PRODUCT_ARCHIVED" : "PRODUCT_UPDATED";
      await writeAudit(tx, action, "Product", updated.id, { changedFields: Object.keys(data) });
      return updated;
    });
    return sendJson(res, 200, { item: product });
  }

  if (resource === "products" && recordId && req.method === "DELETE" && segments.length === 4) {
    const product = await prisma.$transaction(async (tx) => {
      const archived = await tx.product.update({ where: { id: recordId }, data: { status: "ARCHIVED" } });
      await writeAudit(tx, "PRODUCT_ARCHIVED", "Product", archived.id, { name: archived.name, sku: archived.sku });
      return archived;
    });
    return sendJson(res, 200, { item: product, message: "Product archived; historical order records were preserved." });
  }

  if (resource === "categories" && req.method === "GET" && segments.length === 3) {
    const items = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return sendJson(res, 200, { items });
  }

  if (resource === "categories" && req.method === "POST" && segments.length === 3) {
    const body = await readJson(req);
    const name = requiredText(body.name, "name", 120);
    const slug = productSlug(body.slug ?? name);
    const description = optionalText(body.description, "description", 2000) ?? null;
    const item = await prisma.$transaction(async (tx) => {
      const created = await tx.category.create({ data: { name, slug, description } });
      await writeAudit(tx, "CATEGORY_CREATED", "Category", created.id, { name: created.name, slug: created.slug });
      return created;
    });
    return sendJson(res, 201, { item });
  }

  if (resource === "categories" && recordId && req.method === "PATCH" && segments.length === 4) {
    const body = await readJson(req);
    const data = {};
    if (Object.hasOwn(body, "name")) data.name = requiredText(body.name, "name", 120);
    if (Object.hasOwn(body, "slug")) data.slug = productSlug(body.slug);
    if (Object.hasOwn(body, "description")) data.description = optionalText(body.description, "description", 2000);
    if (Object.keys(data).length === 0) throw new HttpError(400, "Provide at least one category field to update.");
    const item = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({ where: { id: recordId }, data });
      await writeAudit(tx, "CATEGORY_UPDATED", "Category", updated.id, { changedFields: Object.keys(data) });
      return updated;
    });
    return sendJson(res, 200, { item });
  }

  throw new HttpError(404, "Admin API route not found.");
}

async function handleRequest(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  let url;
  let segments;
  try {
    url = new URL(req.url ?? "/", "http://localhost");
    segments = url.pathname.split("/").filter(Boolean).map((segment) => decodeURIComponent(segment));
  } catch {
    throw new HttpError(400, "Request URL is invalid.");
  }

  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (req.method === "GET" && (path === "/" || path === "/health")) {
    return sendJson(res, 200, {
      service: "@jertina/api",
      status: "running",
      timestamp: new Date().toISOString(),
    });
  }

  if (path.startsWith("/api/admin/")) {
    return handleAdmin(req, res, url, segments);
  }

  if (path === "/api/categories" && req.method === "GET") {
    const items = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true },
      orderBy: { name: "asc" },
    });
    return sendJson(res, 200, { items });
  }

  if (path === "/api/products" && req.method === "GET") {
    const { page, limit, skip } = pageOptions(url);
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
    const categorySlug = (url.searchParams.get("category") ?? "").trim().slice(0, 180);
    const where = {
      status: "ACTIVE",
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      ...(categorySlug ? { category: { is: { slug: categorySlug } } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.product.count({ where }),
    ]);
    return sendJson(res, 200, { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  }

  if (segments.length === 3 && segments[0] === "api" && segments[1] === "products" && req.method === "GET") {
    const slug = segments[2];
    const item = await prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!item) throw new HttpError(404, "Active product was not found.");
    return sendJson(res, 200, { item });
  }

  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PATCH" && req.method !== "DELETE") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }
  throw new HttpError(404, "API route not found.");
}

export function createApiServer(port = Number(process.env.PORT ?? 4000)) {
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((error) => {
      const mapped = mapDatabaseError(error);
      if (mapped.status >= 500 && !(error instanceof HttpError)) {
        console.error("JERTINA API request failed", {
          method: req.method,
          path: String(req.url ?? "/").split("?")[0],
          code: error?.code ?? "UNKNOWN",
        });
      }
      sendJson(res, mapped.status, { error: mapped.message });
    });
  });

  server.listen(port);
  return server;
}

const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
  const server = createApiServer();
  server.once("listening", () => {
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : process.env.PORT ?? 4000;
    console.log(`@jertina/api listening on port ${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      prisma.$disconnect().finally(() => process.exit(0));
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

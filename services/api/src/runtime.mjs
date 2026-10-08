import http from "node:http";
import { fileURLToPath } from "node:url";

export function createApiServer(port = Number(process.env.PORT ?? 4000)) {
  const server = http.createServer((req, res) => {
    const payload = {
      service: "@jertina/api",
      status: "running",
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload, null, 2));
  });

  server.listen(port);
  return server;
}

const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  createApiServer();
  console.log("@jertina/api listening");
}

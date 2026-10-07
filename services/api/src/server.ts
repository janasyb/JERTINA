import http from "node:http";

export interface ApiServerOptions {
  port: number;
}

export function createApiServer({ port }: ApiServerOptions): http.Server {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        service: "@jertina/api",
        status: "running",
        method: req.method,
        url: req.url,
      }),
    );
  });

  server.listen(port);
  return server;
}

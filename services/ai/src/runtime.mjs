import http from "node:http";

const port = Number(process.env.PORT ?? 4100);

const server = http.createServer((req, res) => {
  const payload = {
    service: "@jertina/ai",
    status: "running",
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload, null, 2));
});

server.listen(port, () => {
  console.log(`@jertina/ai listening on http://localhost:${port}`);
});

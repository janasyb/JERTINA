import { createApiServer } from "./runtime.mjs";

const server = createApiServer(0);

await new Promise((resolve, reject) => {
  server.once("listening", resolve);
  server.once("error", reject);
});

await new Promise((resolve) => server.close(resolve));

console.log("API runtime test passed.");

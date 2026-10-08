import http from "node:http";

const targets = [
  { name: "web", url: process.env.WEB_URL ?? "http://localhost:3000" },
  { name: "admin", url: process.env.ADMIN_URL ?? "http://localhost:3001" },
  { name: "api", url: process.env.API_URL ?? "http://localhost:4000" },
];

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve({ statusCode: res.statusCode });
    });
    req.on("error", reject);
    req.setTimeout(3000, () => {
      req.destroy(new Error(`Timeout reaching ${url}`));
    });
  });
}

for (const target of targets) {
  try {
    const result = await request(target.url);
    console.log(`${target.name}: ${result.statusCode}`);
  } catch (error) {
    console.error(`${target.name}: unavailable - ${error.message}`);
    process.exitCode = 1;
  }
}

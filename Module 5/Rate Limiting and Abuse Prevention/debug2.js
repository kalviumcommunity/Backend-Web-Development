"use strict";
process.env.PORT = "3102";
const http = require("http");
const app = require("./src/app");
function request(method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: "localhost",
      port: 3102,
      method,
      path,
      headers: { "Content-Type": "application/json" },
    };
    const req = http.request(opts, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () =>
        resolve({ status: res.statusCode, headers: res.headers, body: buf }),
      );
    });
    req.on("error", (e) =>
      resolve({ status: 0, headers: {}, body: e.message }),
    );
    if (data) req.write(data);
    req.end();
  });
}
const server = app.listen(3102);
(async () => {
  for (let i = 1; i <= 6; i++) {
    const r = await request("POST", "/auth/login", {
      email: "alice@example.com",
      password: "wrong",
    });
    console.log(i, r.status, r.headers["retry-after"], r.body.slice(0, 80));
  }
  server.close();
  process.exit(0);
})();

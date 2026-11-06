"use strict";
// mimic tests/run.js exactly, but print statuses
process.env.PORT = "3104";
const http = require("http");
const app = require("../src/app");

function request(method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: "localhost",
      port: 3104,
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

const server = app.listen(3104);
(async () => {
  for (let i = 0; i < 5; i++) {
    const r = await request("POST", "/auth/login", {
      email: "alice@example.com",
      password: "wrong",
    });
    console.error("fail-req", i + 1, r.status);
  }
  const r6 = await request("POST", "/auth/login", {
    email: "alice@example.com",
    password: "wrong",
  });
  console.error("6th:", r6.status, JSON.stringify(r6.headers));
  server.close();
  process.exit(0);
})();

const http = require("http");

const BASE = "http://localhost:3000";
let passed = 0,
  failed = 0;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      `${BASE}${path}`,
      {
        method,
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        let chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch (_) {}
          resolve({ status: res.statusCode, body: json ?? text });
        });
      },
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function check(name, expected, actual) {
  if (expected === actual) {
    console.log(`PASS: ${name} (${actual})`);
    passed++;
  } else {
    console.log(`FAIL: ${name} (expected ${expected}, got ${actual})`);
    failed++;
  }
}

async function main() {
  // 1. Register with valid details -> 201, safe response
  const reg = await request("POST", "/auth/register", {
    name: "Alex",
    email: "  Alex@Test.COM  ",
    password: "correct horse battery staple",
  });
  check("register valid -> 201", 201, reg.status);
  const u = reg.body.user || {};
  console.log("   register body:", JSON.stringify(reg.body));
  check(
    "register returns id/name/email, no hash",
    true,
    u.id != null &&
      u.name === "Alex" &&
      u.email === "alex@test.com" &&
      !("password" in u) &&
      !("passwordHash" in u) &&
      !JSON.stringify(reg.body).match(/passwordHash|\$2[aby]\$/),
  );

  // 2. Register duplicate email (different case/whitespace) -> 409
  const dup = await request("POST", "/auth/register", {
    name: "Sam2",
    email: "sam@example.com",
    password: "x",
  });
  check("register duplicate email -> 409", 409, dup.status);

  // 3. Register missing fields -> 400
  const missing = await request("POST", "/auth/register", {
    name: "",
    email: "",
    password: "",
  });
  check("register missing fields -> 400", 400, missing.status);
  const missing2 = await request("POST", "/auth/register", {
    email: "a@b.com",
    password: "x",
  });
  check("register missing name -> 400", 400, missing2.status);

  // 4. Login correct credentials -> 200, safe response
  const login = await request("POST", "/auth/login", {
    email: "  SAM@example.com ",
    password: "correct horse battery staple",
  });
  check("login correct -> 200", 200, login.status);
  console.log("   login body:", JSON.stringify(login.body));
  check(
    "login returns id/name/email, no hash",
    true,
    login.body.user &&
      login.body.user.id != null &&
      !("passwordHash" in login.body.user),
  );

  // 5. Login wrong password -> 401 with exact required body
  const wrong = await request("POST", "/auth/login", {
    email: "sam@example.com",
    password: "wrong",
  });
  check("login wrong password -> 401", 401, wrong.status);
  check(
    "wrong password body = INVALID_CREDENTIALS",
    true,
    JSON.stringify(wrong.body) ===
      JSON.stringify({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      }),
  );

  // 6. Login unknown email -> identical generic 401
  const unknown = await request("POST", "/auth/login", {
    email: "nobody@nowhere.com",
    password: "x",
  });
  check("login unknown email -> 401", 401, unknown.status);
  check(
    "unknown email body identical to wrong password",
    true,
    JSON.stringify(wrong.body) === JSON.stringify(unknown.body),
  );

  // 7. Login with missing fields -> 401 (same generic body, not 500)
  const loginMissing = await request("POST", "/auth/login", {
    email: "",
    password: "",
  });
  check("login missing fields -> 401", 401, loginMissing.status);

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

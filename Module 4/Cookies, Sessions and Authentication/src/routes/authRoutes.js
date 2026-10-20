const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const sessionStore = require("../session/sessionStore");
const requireSession = require("../middleware/requireSession");

const router = express.Router();

const cookieSecure =
  process.env.COOKIE_SECURE === "true" ||
  process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: "lax",
  path: "/",
  signed: true,
  maxAge: Number(process.env.SESSION_TTL_MS || 3600000),
};

const clearCookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: "lax",
  path: "/",
};

router.post("/login", async (req, res, next) => {
  try {
    const email = typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const password = typeof req.body?.password === "string"
      ? req.body.password
      : "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { sessionId } = sessionStore.create(user.id);
    res.cookie("sid", sessionId, cookieOptions);

    return res.status(200).json({
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireSession, (req, res) => {
  return res.status(200).json({ data: req.user });
});

router.post("/logout", (req, res) => {
  const sessionId = req.signedCookies?.sid;
  if (typeof sessionId === "string") sessionStore.destroy(sessionId);
  res.clearCookie("sid", clearCookieOptions);
  return res.status(204).end();
});

module.exports = router;

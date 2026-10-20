const sessionStore = require("../session/sessionStore");
const prisma = require("../db/prisma");

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies?.sid;

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const session = sessionStore.get(sessionId);

    if (!session) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      sessionStore.destroy(sessionId);
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

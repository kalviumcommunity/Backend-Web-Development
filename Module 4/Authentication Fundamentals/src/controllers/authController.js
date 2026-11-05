const authService = require("../services/authService");

const sendError = (res, error) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Do not expose internal Prisma or bcrypt errors
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    }
  });
};

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body || {});

    return res.status(201).json(user);
  } catch (error) {
    return sendError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const user = await authService.login(req.body || {});

    return res.status(200).json(user);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  register,
  login
};
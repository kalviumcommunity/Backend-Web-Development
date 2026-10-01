const express = require("express");
const postRoutes = require("./routes/postRoutes");
const { sendError } = require("./utils/http");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/", postRoutes);

  // Consistent 404 for unknown routes
  app.use((req, res) => {
    return sendError(
      res,
      404,
      "ROUTE_NOT_FOUND",
      "Route not found"
    );
  });

  // Prevent internal error details from reaching clients
  app.use((err, req, res, next) => {
    console.error("Unhandled API error:", err.message);

    if (res.headersSent) {
      return next(err);
    }

    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred"
    );
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData: require("./data/postStore").resetData,
};
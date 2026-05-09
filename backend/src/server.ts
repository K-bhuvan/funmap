import express from "express";
import { recommendationsRouter } from "./routes/recommendations.js";
import { interactionsRouter } from "./routes/interactions.js";
import { geocodeRouter } from "./routes/geocode.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { applyHttpSecurity } from "./middleware/httpSecurity.js";

export function createApp() {
  const app = express();

  applyHttpSecurity(app);
  app.use(express.json({ limit: "32kb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      service: "funmap-backend",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/v1/recommendations", recommendationsRouter);
  app.use("/v1/interactions", interactionsRouter);
  app.use("/v1/geocode", geocodeRouter);

  // must be registered after all routes
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

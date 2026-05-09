import type { Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const isProd = process.env.NODE_ENV === "production";

function allowedCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!isProd) {
    return ["http://localhost:3000", "http://127.0.0.1:3000"];
  }
  return [];
}

export function applyHttpSecurity(app: Express): void {
  if (process.env.TRUST_PROXY === "1") {
    app.set("trust proxy", 1);
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  const origins = allowedCorsOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        if (origins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    }),
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 400 : 5000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests", message: "Rate limit exceeded. Try again later." },
  });

  app.use("/v1", apiLimiter);
}

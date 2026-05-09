import { NextFunction, Request, Response } from "express";

function getHttpStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) {
    return undefined;
  }
  const e = err as { status?: unknown; statusCode?: unknown };
  if (typeof e.statusCode === "number" && Number.isFinite(e.statusCode)) {
    return e.statusCode;
  }
  if (typeof e.status === "number" && Number.isFinite(e.status)) {
    return e.status;
  }
  return undefined;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  console.error("[error]", err);

  const status = getHttpStatus(err) ?? 500;

  if (status === 413) {
    res.status(413).json({
      error: "Payload too large",
      message: "Request body exceeds the size limit.",
    });
    return;
  }

  const errType = typeof err === "object" && err !== null ? (err as { type?: unknown }).type : undefined;
  const isBadJson =
    status === 400 &&
    (errType === "entity.parse.failed" || err instanceof SyntaxError);
  if (isBadJson) {
    res.status(400).json({
      error: "Invalid JSON",
      message: "Request body must be valid JSON.",
    });
    return;
  }

  if (status >= 500) {
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong. Please try again.",
    });
    return;
  }

  res.status(status).json({
    error: "Request error",
    message: "Something went wrong. Please try again.",
  });
}

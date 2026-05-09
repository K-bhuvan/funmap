import { Router } from "express";
import { validateSwipeRequest } from "../validation/interactionValidation.js";

export const interactionsRouter = Router();

interactionsRouter.post("/swipe", (req, res) => {
  const validation = validateSwipeRequest(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: "Invalid request", message: validation.message });
  }

  const { placeId, sessionId, direction } = validation.data;

  // In a future step this will persist to the database.
  // For now we log and acknowledge so the frontend loop is complete.
  console.log("[swipe]", { sessionId, placeId, direction });

  return res.status(200).json({
    received: true,
    placeId,
    sessionId,
    direction,
    recordedAt: new Date().toISOString(),
  });
});

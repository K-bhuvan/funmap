import { Router } from "express";
import { generateMockRecommendationResponse } from "../services/recommendationService.js";
import { validateQueryRequest } from "../validation/recommendationValidation.js";

export const recommendationsRouter = Router();

recommendationsRouter.post("/query", (req, res) => {
  const validation = validateQueryRequest(req.body);

  if (!validation.ok) {
    return res.status(400).json({
      error: "Invalid request",
      message: validation.message,
    });
  }

  const response = generateMockRecommendationResponse(validation.data);

  return res.status(200).json(response);
});

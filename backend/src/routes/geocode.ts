import { Router } from "express";
import { GeocodeError, geocodePostalCode } from "../services/geocodeService.js";
import { validatePostalGeocodeBody } from "../validation/geocodeValidation.js";

export const geocodeRouter = Router();

geocodeRouter.post("/postal", async (req, res, next) => {
  try {
    const validation = validatePostalGeocodeBody(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: "Invalid request", message: validation.message });
    }

    const { postalCode, countryCode } = validation.data;
    const result = await geocodePostalCode(postalCode, countryCode);
    return res.status(200).json({
      lat: result.lat,
      lng: result.lng,
      label: result.label,
      postalCode,
      countryCode: countryCode.toUpperCase(),
    });
  } catch (err) {
    if (err instanceof GeocodeError) {
      return res.status(err.status).json({
        error: err.status === 404 ? "Not found" : "Geocoding failed",
        message: err.message,
      });
    }
    next(err);
  }
});

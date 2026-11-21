import { AppError } from "../utils/AppError.js";

/** Forwards unmatched requests as a standard not-found error. */
export function notFound(req, res, next) {
  next(new AppError(404, "Route not found"));
}

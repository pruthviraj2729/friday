import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

/** Rejects invalid request fields using the shared error envelope. */
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((error) => ({ field: error.path, message: error.msg }));
  return next(new AppError(422, "Validation failed", errors));
}

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { config } from "../config/env.js";

/** Converts operational and known database/JWT failures to the shared envelope. */
export function errorMiddleware(error, req, res, next) {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = [];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error && error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "email";
    message = "A user with this value already exists";
    errors = [{ field, message: "This value is already in use" }];
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid value";
    errors = [{ field: error.path, message: "Invalid value" }];
  } else if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Invalid or expired token";
  } else {
    console.error(error);
  }

  const body = { success: false, message, errors };
  if (config.nodeEnv !== "production" && error instanceof Error) body.stack = error.stack;
  return res.status(statusCode).json(body);
}

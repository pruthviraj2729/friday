import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { config } from "../config/env.js";

/** Creates a 15-minute bearer access token. */
export function createAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, config.accessTokenSecret, { expiresIn: "15m" });
}

/** Creates a seven-day refresh token. */
export function createRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.refreshTokenSecret,
    { expiresIn: "7d", jwtid: randomUUID() }
  );
}

/** Verifies an access token and returns its identity payload. */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

/** Verifies a refresh token and returns its identity payload. */
export function verifyRefreshToken(token, options = {}) {
  return jwt.verify(token, config.refreshTokenSecret, options);
}

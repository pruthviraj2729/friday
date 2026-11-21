import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import {
  clearRefreshToken,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithRefreshToken,
  updateRefreshToken
} from "../DAO/user.dao.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const COOKIE_NAME = "friday_refresh";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth"
};

function toPublicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

async function issueTokens(user, res) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  await updateRefreshToken(user._id, refreshToken);
  res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
  return { accessToken, user: toPublicUser(user) };
}

/** Registers a user and returns an access token with public profile data. */
export async function register(req, res) {
  const user = await createUser({ name: req.body.name, email: req.body.email, password: req.body.password });
  const data = await issueTokens(user, res);
  return sendSuccess(res, 201, "Registration successful", data);
}

/** Authenticates credentials and returns an access token with public profile data. */
export async function login(req, res) {
  const user = await findUserByEmail(req.body.email);
  if (!user) throw new AppError(401, "Invalid credentials");
  const passwordMatches = await user.comparePassword(req.body.password);
  if (!passwordMatches) throw new AppError(401, "Invalid credentials");
  const data = await issueTokens(user, res);
  return sendSuccess(res, 200, "Login successful", data);
}

/** Verifies and rotates the persisted refresh token. */
export async function refresh(req, res) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new AppError(401, "Invalid or expired token");
  const payload = verifyRefreshToken(token);
  const user = await findUserByIdWithRefreshToken(payload.id);
  if (!user || user.refreshToken !== token) throw new AppError(401, "Invalid or expired token");
  const data = await issueTokens(user, res);
  return sendSuccess(res, 200, "Token refreshed", data);
}

/** Invalidates the current refresh token and clears its cookie. */
export async function logout(req, res) {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      const payload = verifyRefreshToken(token, { ignoreExpiration: true });
      await clearRefreshToken(payload.id);
    } catch (error) {
      if (!(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError)) throw error;
    }
  }
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });
  return sendSuccess(res, 200, "Logout successful", {});
}

/** Returns the authenticated user's public profile. */
export async function me(req, res) {
  const user = await findUserById(req.user._id);
  if (!user) throw new AppError(404, "User not found");
  return sendSuccess(res, 200, "Profile loaded", toPublicUser(user));
}

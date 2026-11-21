import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../DAO/user.dao.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Authenticates a bearer token and attaches its public user to the request. */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) throw new AppError(401, "Authentication required");
  const payload = verifyAccessToken(token);
  const user = await findUserById(payload.id);
  if (!user) throw new AppError(401, "Authentication required");
  req.user = user;
  next();
});

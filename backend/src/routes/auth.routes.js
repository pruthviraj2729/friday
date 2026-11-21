import { Router } from "express";
import { login, logout, me, refresh, register } from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";

const router = Router();

/** Registers a new account. */
router.post("/register", registerValidator, validate, asyncHandler(register));
/** Authenticates an existing account. */
router.post("/login", loginValidator, validate, asyncHandler(login));
/** Rotates the refresh and access tokens. */
router.post("/refresh", asyncHandler(refresh));
/** Ends the current session. */
router.post("/logout", asyncHandler(logout));
/** Returns the currently authenticated profile. */
router.get("/me", requireAuth, asyncHandler(me));

export default router;

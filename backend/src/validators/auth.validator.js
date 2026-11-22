import { body } from "express-validator";

/** Validates registration name, email, and password. */
export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("Password must include a letter and a number")
];

/** Validates login email and non-empty password. */
export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

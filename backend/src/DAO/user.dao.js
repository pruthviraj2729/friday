import { UserModel } from "../models/user.model.js";

/** Creates and persists a user. */
export async function createUser(input) {
  const user = new UserModel(input);
  return user.save();
}

/** Finds a user by normalized email. */
export async function findUserByEmail(email) {
  return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
}

/** Finds a user by identifier. */
export async function findUserById(id) {
  return UserModel.findById(id);
}

/** Finds a user including the private refresh token. */
export async function findUserByIdWithRefreshToken(id) {
  return UserModel.findById(id).select("+refreshToken");
}

/** Persists the user's current refresh token. */
export async function updateRefreshToken(id, refreshToken) {
  return UserModel.findByIdAndUpdate(id, { refreshToken }, { new: true }).select("+refreshToken");
}

/** Invalidates the user's current refresh token. */
export async function clearRefreshToken(id) {
  return UserModel.findByIdAndUpdate(id, { refreshToken: null }, { new: true }).select("+refreshToken");
}

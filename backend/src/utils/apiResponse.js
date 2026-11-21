/** Sends the standard success response envelope. */
export function sendSuccess(res, statusCode, message, data) {
  return res.status(statusCode).json({ success: true, message, data });
}

import "dotenv/config";


const required = ["MONGODB_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "GROQ_API_KEY"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

/** Validated runtime configuration. */
export const config = Object.freeze({
  mongodbUri: process.env.MONGODB_URI,
  port,
  nodeEnv: process.env.NODE_ENV || "development",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  groqApiKey: process.env.GROQ_API_KEY,
  TAVILY_URL: process.env.TAVILY_URL,
  COHORE_API_KEY: process.env.COHORE_API_KEY
});

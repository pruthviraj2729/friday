import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { config } from "./config/env.js";
import routes from "./routes/index.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorMiddleware);

export default app;

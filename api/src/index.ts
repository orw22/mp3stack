import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import cacheControl from "./cacheControl";
import errorHandler from "./errorHandler";
import logger from "./logger";
import memuraiClient from "./memuraiClient";
import { authRouter } from "./routers/auth";
import { playlistRouter } from "./routers/playlist";
import { sseRouter } from "./routers/sse";
import { tokenRouter } from "./routers/token";
import { trackRouter } from "./routers/track";
import { userRouter } from "./routers/user";
import { initialiseTrackBucket } from "./trackBucket";

// load config vars
dotenv.config();

// create app
const app = express();
const PORT = process.env.PORT ?? 3000;

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI ?? "");
mongoose.connection.on("open", () => {
  logger.info("Connected to mp3stack database");
  initialiseTrackBucket();
});
mongoose.connection.on("error", () => {
  logger.error("Failed to connect to mp3stack database");
});

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// cookie parsing
app.use(cookieParser());

// helmet security
app.use(helmet());

// gzip compression (production only)
if (process.env.NODE_ENV === "production") app.use(compression());

// parse request bodies as JSON
app.use(express.json());

// browser caching (Cache-Control header)
app.use(cacheControl);

// connection header default close
app.use((req, res, next) => {
  if (!req.url.startsWith("/sse")) {
    res.setHeader("Connection", "close");
  }
  next();
});

// routers
app.use("/tracks", trackRouter);
app.use("/playlists", playlistRouter);
app.use("/users", authRouter);
app.use("/users", userRouter);
app.use("/sse", sseRouter);
app.use("/", tokenRouter);

// error handling
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// graceful shutdown
async function shutdown() {
  logger.info("Shutting down...");
  await memuraiClient.flushAll();
  await memuraiClient.disconnect();
  mongoose.disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

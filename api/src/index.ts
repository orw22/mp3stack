import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import errorHandler from "./errorHandler";
import logger from "./logger";
import { authRouter } from "./routers/auth";
import { playlistRouter } from "./routers/playlist";
import { tokenRouter } from "./routers/token";
import { trackRouter } from "./routers/track";
import { userRouter } from "./routers/user";

// load config vars
dotenv.config();

// create app
const app = express();
const PORT = process.env.PORT ?? 3000;

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI ?? "");
mongoose.connection.on("open", () => {
  logger.info("Connected to mp3stack database");
});
mongoose.connection.on("error", () => {
  logger.error("Failed to connect to mp3stack database");
});

// cors
app.use(cors());

// helmet security
app.use(helmet());

// gzip compression (production only)
if (process.env.NODE_ENV === "production") app.use(compression());

// parse request bodies as JSON
app.use(express.json());

// routers
app.use("/tracks", trackRouter);
app.use("/playlists", playlistRouter);
app.use("/users", authRouter);
app.use("/users", userRouter);
app.use("/", tokenRouter);

// error handling
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

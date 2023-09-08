import { Response, Router } from "express";
import { authenticate } from "../auth";
import logger from "../logger";
import { IPlaylist, IUser } from "../types";

const router = Router();
router.use(authenticate(true));

const sseSessions = new Map<string, Response>();

// server sent events connection endpoint
router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ message: "Connected to SSE" })}\n\n`);

  // store live response object in sseSessions
  sseSessions.set(req.userId, res);
  logger.info(`${req.userId} connected`);

  req.on("close", () => {
    // on disconnect, remove client from sseSessions
    sseSessions.delete(req.userId);
    logger.info(`${req.userId} disconnected`);
  });
});

function sendSSE(userId: string, eventName: string, data: IUser | IPlaylist) {
  const res = sseSessions.get(userId);
  if (res) res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  else logger.warn(`SSE: No session found for ${userId}`);
}

export { sendSSE, router as sseRouter };

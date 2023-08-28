import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../auth";
import TrackController from "../controllers/TrackController";

const router = Router();

let trackController: TrackController;

mongoose.connection.on("open", () => {
  trackController = new TrackController();
});

router.get("/:trackId", authenticate, (req, res, next) =>
  trackController.getTrack(req.params.trackId, res, next)
);

// admin (temp)
router.delete("/all", async (_, res) => {
  await trackController.clearBucket();
  res.status(204).send();
});

export { router as trackRouter };

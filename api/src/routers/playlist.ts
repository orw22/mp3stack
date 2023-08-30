import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../auth";
import PlaylistController from "../controllers/PlaylistController";
import { IPlaylist } from "../types";

const router = Router();

let playlistController: PlaylistController;

mongoose.connection.on("open", () => {
  playlistController = new PlaylistController();
});

// New playlist
router.post("/", authenticate, async (req, res, next) => {
  await playlistController.createPlaylist(
    {
      name: req.body.name,
      userId: req.userId,
      private: true,
      tracks: [],
    } as IPlaylist,
    res,
    next
  );
});

// Get playlist
router.get("/:playlistId", authenticate, async (req, res, next) => {
  await playlistController.getPlaylist(
    req.params.playlistId,
    req.userId,
    res,
    next
  );
});

// Update playlist (non-tracks)
router.put("/:playlistId", authenticate, async (req, res, next) => {
  await playlistController.updatePlaylist(
    req.params.playlistId,
    req.userId,
    req.body as IPlaylist,
    res,
    next
  );
});

// Add track
router.post("/:playlistId/tracks", authenticate, async (req, res, next) => {
  playlistController.addTrackToPlaylist(req, res, next);
});

// Remove track
router.delete(
  "/:playlistId/tracks/:trackId",
  authenticate,
  async (req, res, next) => {
    await playlistController.deleteTrackFromPlaylist(
      req.params.playlistId,
      req.params.trackId,
      req.userId,
      res,
      next
    );
  }
);

// Delete playlist
router.delete("/:playlistId", authenticate, async (req, res, next) => {
  await playlistController.deletePlaylist(
    req.params.playlistId,
    req.userId,
    res,
    next
  );
});

export { router as playlistRouter };

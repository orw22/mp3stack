import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../auth";
import PlaylistController from "../controllers/PlaylistController";

const router = Router();
router.use(authenticate());

let playlistController: PlaylistController;

mongoose.connection.on("open", () => {
  playlistController = new PlaylistController();
});

// New playlist
router.post("/", async (req, res, next) => {
  await playlistController.create(req, res, next);
});

// Get playlist
router.get("/:playlistId", async (req, res, next) => {
  await playlistController.get(req, res, next);
});

// Update playlist (non-tracks)
router.put("/:playlistId", async (req, res, next) => {
  await playlistController.update(req, res, next);
});

// Add track
router.post("/:playlistId/tracks", async (req, res, next) => {
  playlistController.addTrackToPlaylist(req, res, next);
});

// Remove track
router.delete("/:playlistId/tracks/:trackId", async (req, res, next) => {
  await playlistController.deleteTrackFromPlaylist(
    req.params.playlistId,
    req.params.trackId,
    req.userId,
    res,
    next
  );
});

// Follow/unfollow playlist
router.put("/:playlistId/follow", async (req, res, next) => {
  await playlistController.toggleFollowStatus(
    req.params.playlistId,
    req.userId,
    res,
    next
  );
});

// Delete playlist
router.delete("/:playlistId", async (req, res, next) => {
  await playlistController.delete(req, res, next);
});

export { router as playlistRouter };

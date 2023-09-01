import { Router } from "express";
import mongoose from "mongoose";
import { authenticate } from "../auth";
import PlaylistController from "../controllers/PlaylistController";
import { IPlaylist } from "../types";

const router = Router();
router.use(authenticate);

let playlistController: PlaylistController;

mongoose.connection.on("open", () => {
  playlistController = new PlaylistController();
});

// New playlist
router.post("/", async (req, res, next) => {
  await playlistController.createPlaylist(
    { name: req.body.name, userId: req.userId } as IPlaylist,
    res,
    next
  );
});

// Get playlist
router.get("/:playlistId", async (req, res, next) => {
  await playlistController.getPlaylist(
    req.params.playlistId,
    req.userId,
    res,
    next
  );
});

// Update playlist (non-tracks)
router.put("/:playlistId", async (req, res, next) => {
  await playlistController.updatePlaylist(
    req.params.playlistId,
    req.userId,
    req.body as IPlaylist,
    res,
    next
  );
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
  await playlistController.deletePlaylist(
    req.params.playlistId,
    req.userId,
    res,
    next
  );
});

export { router as playlistRouter };

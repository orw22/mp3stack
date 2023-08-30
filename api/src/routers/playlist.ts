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
    { name: req.body.name, userId: req.userId, tracks: [] } as IPlaylist,
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

// Update playlist (rename or add track)
router.put("/:playlistId", authenticate, async (req, res, next) => {
  if (req.body.newName) {
    // rename
    await playlistController.renamePlaylist(
      req.params.playlistId,
      req.userId,
      req.body.newName,
      res,
      next
    );
  } else {
    // add track
    playlistController.addTrackToPlaylist(req, res, next);
  }
});

// Remove track
router.put("/:playlistId/:trackId", authenticate, async (req, res, next) => {
  await playlistController.deleteTrackFromPlaylist(
    req.params.playlistId,
    req.params.trackId,
    req.userId,
    res,
    next
  );
});

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

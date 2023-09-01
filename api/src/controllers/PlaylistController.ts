import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import { Playlist } from "../models/Playlist";
import { IPlaylist } from "../types";
import TrackController from "./TrackController";

export default class PlaylistController {
  trackController: TrackController;

  constructor() {
    this.trackController = new TrackController();
  }

  private async updatePlaylistCallback(
    playlistId: string,
    trackId: mongoose.mongo.ObjectId,
    trackName: string,
    userId: string,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Playlist.updateOne(
      { _id: playlistId, userId: userId },
      { $push: { tracks: { _id: trackId.toString(), name: trackName } } }
    )
      .then(() => {
        res.status(201).send({
          message: "Track added to playlist",
        });
      })
      .catch(next);
  }

  async createPlaylist(playlist: IPlaylist, res: Response, next: NextFunction) {
    await Playlist.create(playlist)
      .then((playlist: IPlaylist) => {
        res.status(201).send({ message: "Playlist created", playlist });
      })
      .catch(next);
  }

  async getPlaylist(
    playlistId: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    await Playlist.findOne({ _id: playlistId })
      .then((document) => {
        const playlist = document?.toObject();
        if (!playlist || (playlist.private && userId !== playlist.userId))
          return next(createError(404, "Playlist not found"));
        res.status(200).send({
          ...playlist,
          following: playlist.followers?.includes(userId),
        });
      })
      .catch(next);
  }

  addTrackToPlaylist(req: Request, res: Response, next: NextFunction) {
    // TODO: Do not upload track if playlist userId not matching req.userId
    this.trackController.addTrack(req, res, next, this.updatePlaylistCallback);
  }

  async deleteTrackFromPlaylist(
    playlistId: string,
    trackId: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    await Playlist.updateOne(
      { _id: playlistId, userId: userId },
      { $pull: { tracks: { _id: trackId.toString() } } }
    )
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }

  async updatePlaylist(
    playlistId: string,
    userId: string,
    playlist: IPlaylist,
    res: Response,
    next: NextFunction
  ) {
    if (playlist.private) {
      // if making private, remove followers
      playlist.followers = [];
    }
    await Playlist.updateOne(
      { _id: playlistId, userId: userId },
      { $set: playlist }
    )
      .then(() => res.status(204).send())
      .catch(next);
  }

  async toggleFollowStatus(
    playlistId: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    await Playlist.updateOne(
      { _id: playlistId },
      [
        {
          $set: {
            followers: {
              $cond: {
                if: {
                  $and: [
                    { $not: { $in: [userId, "$followers"] } },
                    {
                      $and: [
                        { $not: "$private" },
                        { $ne: [userId, "$userId"] },
                      ],
                    },
                  ],
                },
                then: { $concatArrays: ["$followers", [userId]] },
                else: {
                  $filter: {
                    input: "$followers",
                    as: "id",
                    cond: {
                      $ne: ["$$id", userId],
                    },
                  },
                },
              },
            },
          },
        },
      ],
      { new: true }
    )
      .then((update) => {
        if (update.modifiedCount > 0) res.status(204).send();
        else res.status(400).send({ message: "Playlist not updated" });
      })
      .catch(next);
  }

  async deletePlaylist(
    playlistId: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    await Playlist.deleteOne({ _id: playlistId, userId: userId })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }
}

import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import { Playlist } from "../models/Playlist";
import { IPlaylist } from "../types";
import Controller from "./Controller";
import TrackController from "./TrackController";

/**
 * @class PlaylistController
 * @description Controller for playlist routes
 */
export default class PlaylistController implements Controller {
  trackController: TrackController;

  /**
   * Initialise the TrackController
   */
  constructor() {
    this.trackController = new TrackController();
  }

  /**
   * @private
   * Callback function to update playlist after track saved to GridFS bucket and object ID received
   *
   * @param playlistId
   * @param trackId
   * @param trackName
   * @param userId
   * @param res
   * @param next
   */
  private async updatePlaylistCallback(
    playlistId: string,
    trackId: mongoose.mongo.ObjectId,
    trackName: string,
    trackDuration: number,
    userId: string,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await Playlist.updateOne(
      { _id: playlistId, userId: userId },
      {
        $push: {
          tracks: {
            _id: trackId.toString(),
            name: trackName,
            duration: trackDuration,
          },
        },
      }
    )
      .then(() => {
        res.status(201).send({
          message: "Track added to playlist",
        });
      })
      .catch(next);
  }

  /**
   * Creates a new playlist
   *
   * @param req
   * @param res
   * @param next
   */
  async create(req: Request, res: Response, next: NextFunction) {
    await Playlist.create({
      name: req.body.name,
      userId: req.userId,
    } as IPlaylist)
      .then((playlist: IPlaylist) => {
        res.status(201).send({ message: "Playlist created", playlist });
      })
      .catch(next);
  }

  /**
   * Fetches a playlist by ID
   *
   * Also takes in userId to check if the playlist can be returned or not
   * (i.e. private playlists are visible to the owner only)
   *
   * @param req
   * @param res
   * @param next
   */
  async get(req: Request, res: Response, next: NextFunction) {
    await Playlist.findOne({ _id: req.params.playlistId })
      .then((document) => {
        const playlist = document?.toObject();
        if (!playlist || (playlist.private && req.userId !== playlist.userId))
          return next(createError(404, "Playlist not found"));
        res.status(200).send({
          ...playlist,
          following: playlist.followers?.includes(req.userId),
        });
      })
      .catch(next);
  }

  /**
   * Adds a track to the GridFS bucket and updates the playlist with track name and ID
   * via callback function
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  addTrackToPlaylist(req: Request, res: Response, next: NextFunction) {
    // TODO: Do not upload track if playlist userId not matching req.userId
    this.trackController.addTrack(req, res, next, this.updatePlaylistCallback);
  }

  /**
   * Removes a track from the playlist with $pull operation
   *
   * (post method deletes the track from the GridFS bucket - @see Playlist.ts)
   *
   * @param playlistId
   * @param trackId
   * @param userId
   * @param res
   * @param next
   */
  async deleteTrackFromPlaylist(
    playlistId: string,
    trackId: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    await Playlist.updateOne({ _id: playlistId, userId: userId }, { $pull: { tracks: { _id: trackId.toString() } } })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }

  /**
   * Update playlist by ID
   *
   * Used when changing playlist name and privacy status
   * If the playlist is made private, removes all followers
   *
   * @param req
   * @param res
   * @param next
   */
  async update(req: Request, res: Response, next: NextFunction) {
    const playlist = req.body as IPlaylist;
    if (playlist.private) {
      // if making private, remove followers
      playlist.followers = [];
    }
    // cannot update userId or tracks via this method
    playlist.userId = req.userId;
    delete playlist.tracks;

    await Playlist.updateOne({ _id: req.params.playlistId, userId: req.userId }, { $set: playlist })
      .then(() => res.status(204).send())
      .catch(next);
  }

  /**
   * Toggle follow status
   *
   * If not following, playlist is public and not owned by user, add user to followers
   * Otherwise remove user from followers
   *
   * @param playlistId
   * @param userId
   * @param res
   * @param next
   */
  async toggleFollowStatus(playlistId: string, userId: string, res: Response, next: NextFunction) {
    await Playlist.updateOne({ _id: playlistId }, [
      {
        $set: {
          followers: {
            $cond: {
              if: {
                $or: [
                  { $in: [userId, "$followers"] },
                  {
                    $or: ["$private", { $eq: [userId, "$userId"] }],
                  },
                ],
              },
              then: {
                $filter: {
                  input: "$followers",
                  as: "id",
                  cond: {
                    $ne: ["$$id", userId],
                  },
                },
              },
              else: { $concatArrays: ["$followers", [userId]] },
            },
          },
        },
      },
    ])
      .then((update) => {
        if (update.modifiedCount > 0) res.status(204).send();
        else
          res.status(400).send({
            message: "Follow status change failed. Playlist is private or user is owner.",
          });
      })
      .catch(next);
  }

  /**
   * Delete playlist by ID
   *
   * Post method deletes all tracks in the playlist from GridFS bucket - @see Playlist.ts
   *
   * @param req
   * @param res
   * @param next
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    await Playlist.deleteOne({ _id: req.params.playlistId, userId: req.userId })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }
}

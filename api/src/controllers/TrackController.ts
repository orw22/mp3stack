import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import multer from "multer";
import { IAudioMetadata, parseStream } from "music-metadata";
import { Readable } from "stream";
import { GRIDFS_BUCKET_NAME } from "../constants";
import logger from "../logger";

const MAX_FILE_SIZE = 15000000; // 15MB

/**
 * @class TrackController
 * @description Controller for track routes
 */
export default class TrackController {
  bucket: mongoose.mongo.GridFSBucket;
  storage: multer.StorageEngine;
  upload: multer.Multer;

  /**
   * Initializes the MongoDB GridFS bucket and multer for file uploads.
   */
  constructor() {
    this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: GRIDFS_BUCKET_NAME,
    });
    this.storage = multer.memoryStorage();
    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    });
  }

  /**
   * Retrieve and stream a track's audio content to the client.
   *
   * This function takes a track ID and streams the audio content of the track
   * to the HTTP response.
   *
   * @param trackId - The ID of the track to retrieve.
   * @param res - The response object for sending the audio data.
   * @param next - The next function
   */
  getTrack(trackId: string, res: Response, next: NextFunction) {
    let trackObjId;
    try {
      trackObjId = new mongoose.mongo.ObjectId(trackId);
    } catch (error) {
      return next(
        createError(
          400,
          "Invalid track ID. It must be a single string of 12 bytes or 24 hex characters"
        )
      );
    }

    res.set("Content-Type", "audio/mpeg");
    res.set("Accept-Ranges", "bytes");

    let downloadStream = this.bucket.openDownloadStream(trackObjId);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });
    downloadStream.on("error", (error) => {
      // TODO: Process error and send correct response
      return next(createError(404, "Track not found"));
    });
    downloadStream.on("end", () => {
      res.end();
    });
  }

  /**
   * Add an MP3 file to the MongoDB GridFS tracks bucket and call a callback function
   * on finishing the upload.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   * @param callback - A callback function to execute after successful upload.
   */
  addTrack(
    req: Request,
    res: Response,
    next: NextFunction,
    callback: (
      playlistId: string,
      trackId: mongoose.mongo.ObjectId,
      trackName: string,
      trackDuration: number,
      userId: string,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) {
    this.upload.single("track")(req, res, async (error) => {
      logger.info(JSON.stringify(req.body));
      if (error) {
        logger.error(error.message);
        return next(createError(400, error.message));
      } else if (!req.body.name) {
        return next(createError(400, "No track name in request body"));
      }

      const trackStream = new Readable();
      trackStream.push(req.file?.buffer);
      trackStream.push(null);

      let metadata: IAudioMetadata;
      try {
        metadata = await parseStream(trackStream, "audio/mpeg");
      } catch (error) {
        return next(createError(500, "Something went wrong"));
      }

      let uploadStream = this.bucket.openUploadStream(req.body.name);
      trackStream.pipe(uploadStream);

      uploadStream.on("error", () => {
        return next(createError(500, "Error uploading file"));
      });

      uploadStream.on("finish", () => {
        callback(
          req.params.playlistId,
          uploadStream.id,
          req.body.name,
          metadata.format.duration ?? 0,
          req.userId,
          res,
          next
        );
      });
    });
  }

  // async clearBucket() {
  //   await this.bucket.drop();
  // }
}

import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import multer from "multer";
import { IAudioMetadata, parseStream } from "music-metadata";
import { Readable } from "stream";
import logger from "../logger";
import memuraiClient from "../memuraiClient";
import { trackBucket } from "../trackBucket";

const MAX_FILE_SIZE = 15000000; // 15MB

/**
 * @class TrackController
 * @description Controller for track routes
 */
export default class TrackController {
  storage: multer.StorageEngine;
  upload: multer.Multer;

  /**
   * Initializes the MongoDB GridFS bucket and multer for file uploads.
   */
  constructor() {
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
  async getTrack(trackId: string, res: Response, next: NextFunction) {
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

    const cachedTrack = await memuraiClient.get(trackId);

    if (cachedTrack) {
      const trackBuffer = Buffer.from(cachedTrack, "base64");
      const downloadStream = new Readable();

      // stream the track data to the response
      downloadStream.push(trackBuffer);
      downloadStream.push(null); // end stream

      downloadStream.on("data", (chunk) => {
        res.write(chunk);
      });

      downloadStream.on("end", () => {
        res.end();
      });
    } else {
      let downloadStream = trackBucket.openDownloadStream(trackObjId);
      let base64Str = "";

      downloadStream.on("data", (chunk) => {
        res.write(chunk);
        base64Str += chunk.toString("base64");
      });
      downloadStream.on("error", (error) => {
        logger.error(error.message);
        return next(createError(500, "Error streaming track"));
      });
      downloadStream.on("end", async () => {
        res.end();
        // add track base64 string to cache (expires in 24 hours)
        await memuraiClient
          .set(trackId, base64Str, { EX: 86400, NX: true })
          .catch((error) => logger.error("Error saving track to cache", error));
      });
    }
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

      let uploadStream = trackBucket.openUploadStream(req.body.name);
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

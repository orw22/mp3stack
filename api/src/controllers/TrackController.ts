import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import logger from "../logger";

export default class TrackController {
  bucket: mongoose.mongo.GridFSBucket;
  storage: multer.StorageEngine;
  upload: multer.Multer;

  constructor() {
    this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "tracks",
    });
    this.storage = multer.memoryStorage();
    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 10000000, files: 1 },
    });
  }

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

  addTrack(
    req: Request,
    res: Response,
    next: NextFunction,
    callback: (
      playlistId: string,
      trackId: mongoose.mongo.ObjectId,
      trackName: string,
      userId: string,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) {
    this.upload.single("track")(req, res, (error) => {
      logger.info(JSON.stringify(req.body));
      if (error) {
        return next(createError(400, "Invalid upload request"));
      } else if (!req.body.name) {
        return next(createError(400, "No track name in request body"));
      }

      const trackStream = new Readable();
      trackStream.push(req.file?.buffer);
      trackStream.push(null);

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
          req.userId,
          res,
          next
        );
      });
    });
  }

  // admin
  async clearBucket() {
    await this.bucket.drop();
  }
}

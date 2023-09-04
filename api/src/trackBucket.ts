import mongoose from "mongoose";

const BUCKET_NAME = "mp3stackTracks";

let trackBucket: mongoose.mongo.GridFSBucket;

function initTrackBucket() {
  trackBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: BUCKET_NAME,
  });
}

export { initTrackBucket, trackBucket };

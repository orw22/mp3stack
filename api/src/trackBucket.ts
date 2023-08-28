import mongoose from "mongoose";

let trackBucket!: mongoose.mongo.GridFSBucket;

mongoose.connection.on("open", () => {
  trackBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });
});

export default trackBucket;

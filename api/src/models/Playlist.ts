import mongoose from "mongoose";
import validator from "validator";
import { IPlaylist } from "../types";

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export const playlistSchema = new mongoose.Schema<IPlaylist>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (name: string) => validator.isAlphanumeric(name),
      message: "Invalid name (must be alphanumeric)",
    },
  },
  userId: {
    type: String,
    required: true,
    validate: {
      validator: (userId: string) => mongoose.Types.ObjectId.isValid(userId),
      message: "Invalid user ID",
    },
  },
  private: { type: Boolean, required: true, default: true },
  tracks: [trackSchema],
  followers: [String],
});

// post remove track, delete from GridFS bucket
playlistSchema.post("updateOne", async function () {
  const data = this.getUpdate() as { $pull?: { tracks: { _id: string } } };
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });
  if (data?.$pull && data.$pull.tracks)
    await bucket.delete(new mongoose.mongo.ObjectId(data.$pull.tracks._id));
});

// pre delete playlist, delete all tracks from GridFS bucket
playlistSchema.pre("deleteOne", async function (next) {
  const _id = this.getFilter()["_id"];
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "tracks",
  });
  const playlist = await Playlist.findOne({ _id }).exec().catch(next);
  playlist?.tracks?.forEach(
    async (track) => await bucket.delete(track._id).catch(next)
  );

  return next();
});

export const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);

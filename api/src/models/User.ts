import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import logger from "../logger";
import { sendSSE } from "../routers/sse";
import { trackBucket } from "../trackBucket";
import { IUser, IUserFuncs } from "../types";
import { Playlist } from "./Playlist";

const SALT_ROUNDS = 10;
const MAX_NAME_LENGTH = 48;
const MIN_PASSWORD_LENGTH = 10;

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (name: string) =>
          validator.isAlpha(name) && name.length <= MAX_NAME_LENGTH,
        message: `Invalid name (must be alphabetic and less than ${MAX_NAME_LENGTH} characters)`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (password: string) =>
          validator.isStrongPassword(password, {
            minLength: MIN_PASSWORD_LENGTH,
          }),
        message: "Password too weak. Please enter a strong password",
      },
    },
  },
  {
    methods: {
      verifyPassword: function (
        password: string,
        callback: (error: Error, same: boolean) => void
      ) {
        bcrypt.compare(
          password,
          this.password,
          (error: Error | undefined, same: boolean) => {
            if (error) return callback(error, false);
            callback(null as any, same);
          }
        );
      },
      generateToken: function () {
        return jwt.sign(
          { _id: this._id.toString() },
          process.env.JWT_SECRET ?? "",
          {
            expiresIn: "1d",
          }
        );
      },
    },
  }
);

// hash password before save
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  return bcrypt.hash(user.password, SALT_ROUNDS, (hashError, hash) => {
    if (hashError) return next(hashError);

    user.password = hash;
    return next();
  });
});

// hash password before update
userSchema.pre("updateOne", function (next) {
  const data = this.getUpdate() as { $set: { password: string } };
  if (!data?.$set.password) {
    return next();
  } else if (
    !validator.isStrongPassword(data.$set.password, {
      minLength: MIN_PASSWORD_LENGTH,
    })
  ) {
    return next(
      createError(400, "Password too weak. Please enter a stronger password")
    );
  }

  return bcrypt.hash(data.$set.password, SALT_ROUNDS, (hashError, hash) => {
    if (hashError) return next(hashError);

    data.$set.password = hash;
    return next();
  });
});

// send SSE with fresh user data on user update
userSchema.post("updateOne", async function () {
  await this.model
    .findById(this.getQuery()._id, { password: 0 })
    .then((user) => {
      if (user) sendSSE(user._id.toString(), "userUpdate", user);
    })
    .catch((error) => {
      logger.error("Error sending SSE: ", error.message);
    });
});

// clear storage (playlists and tracks) post user deletion
userSchema.post("deleteOne", async function () {
  const userId = this.getFilter()["_id"];
  const playlists = await Playlist.find({ userId }).exec();

  if (!playlists || playlists.length === 0) {
    return;
  } else {
    playlists.forEach((playlist) => {
      playlist.tracks?.forEach(
        async (track) => await trackBucket.delete(track._id)
      );
    });

    await Playlist.deleteMany({ userId }).exec();
  }
});

export const User = mongoose.model<IUser & IUserFuncs>("User", userSchema);

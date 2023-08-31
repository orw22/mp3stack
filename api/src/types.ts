import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserFuncs {
  verifyPassword(
    password: string,
    callback: (error: Error, same: boolean) => void
  ): void;
  generateToken(): string;
}

export interface ITrack {
  _id: mongoose.mongo.ObjectId;
  name: string;
}

export interface IPlaylist {
  name: string;
  userId: string;
  private: boolean;
  tracks?: ITrack[];
  followers?: string[];
}

export interface Login {
  email: string;
  password: string;
}

import mongoose from "mongoose";

/**
 * Represents a user
 * @interface
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
}

/**
 * Defines function signatures for user model
 * @interface
 */
export interface IUserFuncs {
  /**
   * Verifies a password by comparing it with the stored password hash.
   * @param {string} password - The password to verify.
   * @param {(error: Error, same: boolean) => void} callback - A callback function to handle the result.
   */
  verifyPassword(
    password: string,
    callback: (error: Error, same: boolean) => void
  ): void;

  /**
   * Generates a JWT for the user.
   * @returns {string} - The signed token.
   */
  generateToken(): string;
}

/**
 * Represents a track
 * @interface
 */
export interface ITrack extends mongoose.Document {
  name: string;
  duration: number;
}

/**
 * Represents a playlist
 * @interface
 */
export interface IPlaylist {
  name: string;
  userId: string;
  private: boolean;
  tracks?: ITrack[];
  followers?: string[];
}

/**
 * Represents login credentials for authentication
 * @interface
 */
export interface Login {
  email: string;
  password: string;
}

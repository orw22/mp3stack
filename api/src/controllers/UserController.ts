import { NextFunction, Response } from "express";
import createError from "http-errors";
import { Playlist } from "../models/Playlist";
import { User } from "../models/User";
import { IUser, Login } from "../types";

/**
 * @class UserController
 * @description Provides controller methods for user authentication, registration, profile retrieval,
 * user search, and other user-related actions.
 */
export default class UserController {
  /**
   * Logs in a user. Uses verifyPassword function to check if the password is correct.
   * If the password is correct, a JWT is generated and sent to the client.
   *
   * @param login
   * @param res
   * @param next
   */
  async login(login: Login, res: Response, next: NextFunction) {
    const user = await User.findOne({ email: login.email }).catch(next);
    if (!user) return next(createError(404, "User not found"));

    user.verifyPassword(login.password, function (error: Error, same: boolean) {
      if (same && !error) {
        return res.status(200).send({ token: user.generateToken() });
      } else {
        return next(createError(401, "Incorrect password"));
      }
    });
  }

  /**
   * Creates a new user and sends a token back to the client if creation succeeds.
   *
   * @param user
   * @param res
   * @param next
   */
  async register(user: IUser, res: Response, next: NextFunction) {
    await User.create(user)
      .then((user) => {
        res.status(201).send({ token: user.generateToken() });
      })
      .catch(next);
  }

  /**
   * Finds users by name (not case-sensitive)
   * If name is null or empty string, an empty array is sent back to the client.
   *
   * @param name
   * @param userId
   * @param res
   * @param next
   */
  async findByName(
    name: string,
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    if (!name) {
      return res.status(200).send([]);
    }
    await User.find(
      { name: { $regex: `^${name}`, $options: "i" }, _id: { $ne: userId } },
      {
        email: 0,
        password: 0,
      }
    )
      .then((users) => {
        res.status(200).send(users);
      })
      .catch(next);
  }

  /**
   * Fetches a single user by ID
   *
   * If user is not found, a 404 error is sent back to the client.
   *
   * @param userId
   * @param res
   * @param next
   */
  async getUser(userId: string, res: Response, next: NextFunction) {
    await User.findById(userId, {
      password: 0,
    })
      .then((user: IUser | null) => {
        if (!user) return next(createError(404, "User not found"));

        res.status(200).send(user);
      })
      .catch(next);
  }

  /**
   * Gets other user along with their playlists
   *
   * Used when searching for users and viewing their profiles
   * (hence email and password not included in response)
   *
   * @param userId
   * @param res
   * @param next
   */
  async getOtherUserAndPlaylists(
    userId: string,
    res: Response,
    next: NextFunction
  ) {
    try {
      const [user, playlists] = await Promise.all([
        User.findById(userId, {
          email: 0,
          password: 0,
        }),
        Playlist.find({ userId: userId, private: false }),
      ]);

      if (!user) {
        return next(createError(404, "User not found"));
      }

      res.status(200).send({ ...user?.toObject(), playlists });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a user's playlists by user ID
   *
   * @param userId
   * @param res
   * @param next
   */
  async getUserPlaylists(userId: string, res: Response, next: NextFunction) {
    try {
      const [playlists, following] = await Promise.all([
        Playlist.find({ userId: userId }),
        Playlist.find({ followers: { $in: [userId] } }),
      ]);

      res.status(200).send({ playlists, following });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates user by ID, returns 204 response if successful
   *
   * @param userId
   * @param user
   * @param res
   * @param next
   */
  async updateUser(
    userId: string,
    user: IUser,
    res: Response,
    next: NextFunction
  ) {
    await User.updateOne({ _id: userId }, { $set: user })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }

  /**
   * Deletes user by ID, returns 204 response if successful
   *
   * @param userId
   * @param res
   * @param next
   */
  async deleteUser(userId: string, res: Response, next: NextFunction) {
    await User.deleteOne({ _id: userId })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }
}

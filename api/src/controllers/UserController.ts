import { NextFunction, Response } from "express";
import createError from "http-errors";
import { Playlist } from "../models/Playlist";
import { User } from "../models/User";
import { IPlaylist, IUser, Login } from "../types";

export default class UserController {
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

  async register(user: IUser, res: Response, next: NextFunction) {
    await User.create(user)
      .then((user) => {
        res.status(201).send({ token: user.generateToken(), user });
      })
      .catch(next);
  }

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

  async getUserPlaylists(userId: string, res: Response, next: NextFunction) {
    await Playlist.find({ userId: userId })
      .then((playlists: IPlaylist[]) => res.status(200).send(playlists))
      .catch(next);
  }

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

  async deleteUser(userId: string, res: Response, next: NextFunction) {
    await User.deleteOne({ _id: userId })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }
}

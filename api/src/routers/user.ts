import { Router } from "express";
import { authenticate } from "../auth";
import UserController from "../controllers/UserController";
import { IUser, Login } from "../types";

const router = Router();

const userController = new UserController();

// Log in
router.post("/login", async (req, res, next) => {
  await userController.login(req.body as Login, res, next);
});

// Register
router.post("/", async (req, res, next) => {
  await userController.register(req.body as IUser, res, next);
});

// Search users
router.get("/", async (req, res, next) => {
  await userController.findByName(req.query.name as string, res, next);
});

// Get user
router.get("/me", authenticate, async (req, res, next) => {
  await userController.getUser(req.userId, res, next);
});

// Get other user and their public playlists
router.get("/:userId", authenticate, async (req, res, next) => {
  await userController.getOtherUserAndPlaylists(req.params.userId, res, next);
});

// Get playlists
router.get("/me/playlists", authenticate, async (req, res, next) => {
  await userController.getUserPlaylists(req.userId, res, next);
});

// Update user
router.put("/me", authenticate, (req, res, next) => {
  userController.updateUser(req.userId, req.body as IUser, res, next);
});

// Delete user
router.delete("/me", authenticate, async (req, res, next) => {
  await userController.deleteUser(req.userId, res, next);
});

export { router as userRouter };

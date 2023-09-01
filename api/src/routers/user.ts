import { Router } from "express";
import { authenticate } from "../auth";
import UserController from "../controllers/UserController";
import { IUser } from "../types";

const router = Router();
router.use(authenticate);

const userController = new UserController();

// Search users
router.get("/", async (req, res, next) => {
  await userController.findByName(
    req.query.name as string,
    req.userId,
    res,
    next
  );
});

// Get user
router.get("/me", async (req, res, next) => {
  await userController.getUser(req.userId, res, next);
});

// Get other user and their public playlists
router.get("/:userId", async (req, res, next) => {
  await userController.getOtherUserAndPlaylists(req.params.userId, res, next);
});

// Get playlists
router.get("/me/playlists", async (req, res, next) => {
  await userController.getUserPlaylists(req.userId, res, next);
});

// Update user
router.put("/me", (req, res, next) => {
  userController.updateUser(req.userId, req.body as IUser, res, next);
});

// Delete user
router.delete("/me", async (req, res, next) => {
  await userController.deleteUser(req.userId, res, next);
});

export { router as userRouter };

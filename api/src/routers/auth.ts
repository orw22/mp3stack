import { Router } from "express";
import UserController from "../controllers/UserController";
import { Login } from "../types";

const router = Router();

const userController = new UserController();

// Log in
router.post("/login", async (req, res, next) => {
  await userController.login(req.body as Login, res, next);
});

// Register
router.post("/", async (req, res, next) => {
  await userController.create(req, res, next);
});

export { router as authRouter };

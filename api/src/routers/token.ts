import { Router } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = Router();

// validate JWT
router.get("/validate-token", (req, res) => {
  try {
    const payload = jwt.verify(
      req.headers.authorization?.slice(7) ?? "",
      process.env.JWT_SECRET ?? ""
    ) as {
      _id: string;
    };
    if (!payload._id || !mongoose.Types.ObjectId.isValid(payload._id))
      return res.status(200).send(false);
    return res.status(200).send(true);
  } catch (error) {
    return res.status(200).send(false);
  }
});

export { router as tokenRouter };

import express from "express";
import {
  getAllUsers,
  google,
  signin,
  signout,
  signup,
  updateUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signout);
router.put("/update/:id", verifyToken, updateUser);
router.get("/getUsers", verifyToken, verifyAdmin, getAllUsers);

export default router;

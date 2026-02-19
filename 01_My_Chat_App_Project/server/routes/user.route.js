import express from "express";
import { signup, login, logout, getUserInfo } from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUserInfo",secureRoute, getUserInfo);

export default router;
const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const route = express.Router();

route.post("/signup", userController.userSignup);
route.post("/login", userController.userLogin);
route.get("/fetch-user", authMiddleware, userController.fetchUser);
route.post("/add-address", authMiddleware, userController.addAlternateAddress);

module.exports = route;

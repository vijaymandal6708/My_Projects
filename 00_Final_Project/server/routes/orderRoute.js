const express = require("express");
const { createOrder, getMyOrders, } = require("../controllers/orderController");
const auth = require("../middlewares/authMiddleware");

const route = express.Router();

route.post("/place-order", auth, createOrder);
route.get("/my-orders", auth, getMyOrders );

module.exports = route;

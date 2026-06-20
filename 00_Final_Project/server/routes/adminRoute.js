const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminOnly");

// Auth
route.post("/login", AdminController.adminLogin);

// Dashboard
route.get("/dashboard-stats", adminAuth, AdminController.getDashboardStats);

// Products
route.post("/add-product", adminAuth, AdminController.addProduct);
route.get("/products", adminAuth, AdminController.getProductsWithStock);
route.get("/get-product-for-edit/:id", adminAuth, AdminController.getProductToEdit);
route.put("/update-product/:id", adminAuth, AdminController.updateProduct);
route.delete("/delete-product/:id", adminAuth, AdminController.deleteProduct);

// Orders
route.get("/orders", adminAuth, AdminController.getAllOrders);
route.patch("/update-order-status/:id", adminAuth, AdminController.updateOrderStatus);

module.exports = route;
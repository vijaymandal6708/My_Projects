const express = require("express");
const route = express.Router();
const ProductController = require("../controllers/productController")

route.get("/product-display", ProductController.productDisplay);
route.get("/search", ProductController.productSearch);
route.get("/category/:category", ProductController.getByCategory);
route.get("/:id", ProductController.productDetail); // 👈 LAST




module.exports= route;
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const AdminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const ProductRoute = require("./routes/productRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
mongoose.connect(process.env.DBCONN).then(()=>{
    console.log("Database Succesfully Connected!");
})

// Use body-parser middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "https://vijay-gadget-galaxy-backend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use("/admin", AdminRoute);
app.use("/user", userRoute);
app.use("/product", ProductRoute);
app.use("/api/payment",paymentRoute);
app.use("/orders",orderRoute);

app.listen(process.env.PORT, ()=>{
    console.log("server run on 8000 Port!")
})
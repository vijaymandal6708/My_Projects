const mongoose = require("mongoose");
const productSchema= new mongoose.Schema({
    name:String,
    category:String,
    MRP:Number,
    price:Number,
    starRating:Number,
    quantity:Number,
    description:String,
    defaultImage:String,
    images:[String]
})

module.exports = mongoose.model("product", productSchema);
  

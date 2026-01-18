//Product Model (Bouquet Collections)

//Purpose: Mongoose schema for pre-made bouquet products in the shop

//- Defines the data structure for signature/ready-made bouquet products
//- Stores product information: name, category, type, color, price, image, stock
//- Maps to the 'bouquets' collection in MongoDB
//- Used by the Shop page to display available pre-designed bouquets
//- Enables CRUD operations on bouquet inventory
// - Essential for managing the main product catalog
// - Separates pre-made bouquets from custom build items and occasion products

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  type: String,
  color: String,
  price: Number,
  imageUrl: String,
  stock: Number,
});

export default mongoose.model("Product", productSchema, "bouquets");

//Build-A-Bouquet Item Model
//Purpose: Mongoose schema for customizable bouquet components

//- Defines the data structure for individual items used in custom bouquet building
// - Stores items across multiple categories: flowers, wrappers, ribbons, cards
// - Flower category includes types: base, focal, and filler flowers
// - Contains item details: name, color, price, image, stock, max quantity
// - Enables the interactive Build-A-Bouquet feature
// - Maps to the 'buildabouquet' collection in MongoDB
// - Allows customers to create personalized bouquets step-by-step
// - Key differentiator feature that sets Florish apart from competitors

import mongoose from "mongoose";

const buildABouquetSchema = new mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ['flower', 'wrapper', 'ribbon', 'card']
  },
  type: String,
  color: String,
  price: Number,
  imageUrl: String,
  stock: Number,
  maxQuantity: Number,
  description: String
});

export default mongoose.model("BuildABouquet", buildABouquetSchema, "buildabouquet");
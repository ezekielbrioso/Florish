//Occasion Product Model

//Purpose: Mongoose schema for occasion-specific bouquet products

//- Defines the data structure for occasion-themed bouquet products
// - Stores products designed for specific events (Birthday, Anniversary, Valentine's, etc.)
// - Includes occasion field to categorize and filter products by event type
// - Contains product details: name, description, price, image, stock
// - Maps to the 'occasion_bouquets' collection in MongoDB
// - Used by the Occasions page to display event-specific bouquets
// - Separates occasion products from regular shop bouquets for better organization

import mongoose from "mongoose";

const occasionProductSchema = new mongoose.Schema({
  name: String,
  occasion: String,
  description: String,
  price: Number,
  imageUrl: String,
  stock: Number,
});

export default mongoose.model("OccasionProduct", occasionProductSchema, "occasion_bouquets");
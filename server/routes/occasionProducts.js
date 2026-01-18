//Occasion Products Routes

// Purpose: API endpoints for occasion-specific bouquet products

// - Provides GET /api/occasion-products to fetch all occasion-themed bouquets
// - Returns products designed for specific events (Birthday, Anniversary, etc.)
// - Used by the Occasions page and Home page to display event-specific products
// - Enables filtering by occasion type on the frontend
// - Returns product data: name, occasion, description, price, image, stock
// - Essential for curating products by celebration type
// - Includes logging for debugging and monitoring

import express from "express";
import OccasionProduct from "../models/OccasionProduct.js";

const router = express.Router();

// Get all occasion products
router.get("/", async (req, res) => {
  try {
    console.log("Fetching occasion products...");
    const products = await OccasionProduct.find();
    console.log("Found products:", products.length);
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
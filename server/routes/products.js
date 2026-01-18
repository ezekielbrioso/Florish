//Products Routes (Shop Bouquets)

// Purpose: API endpoints for pre-made bouquet products

// - Provides GET /api/products to fetch all shop bouquet products
// - Includes test route for checking database connection
// - Filters products by category 'bouquet' to separate from other product types
// - Used by the Shop page to display available pre-designed bouquets
// - Returns product data: name, category, type, color, price, image, stock
// - Essential for populating the main shop catalog
// - Handles errors and logs for debugging

import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Test route to check connection
router.get("/test", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ message: "Connection working", count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bouquet products
router.get("/", async (req, res) => {
  try {
    console.log("Fetching bouquets...");
    const products = await Product.find({ category: "bouquet" });
    console.log("Found products:", products);
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

//Build Items Routes

//Purpose: API endpoints for Build-A-Bouquet customization components

// - Provides multiple endpoints to fetch bouquet building items by category/type
// - GET /api/build-items - fetches all build items
// - GET /api/build-items/category/:category - fetches items by category (wrapper, ribbon, card)
// - GET /api/build-items/flowers/:type - fetches flowers by type (base, focal, filler)
// - Includes test route for checking database connection
// - Used by the Build-A-Bouquet page for the step-by-step customization process
// - Returns item data: name, category, type, color, price, image, stock, maxQuantity
// - Essential for enabling the interactive custom bouquet builder feature

import express from "express";
import BuildABouquet from "../models/BuildABouquet.js";

const router = express.Router();

// Test route
router.get("/test", async (req, res) => {
  try {
    const count = await BuildABouquet.countDocuments();
    res.json({ message: "Connection working", count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all build items
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all build items...");
    const items = await BuildABouquet.find();
    console.log("Found items:", items.length);
    res.json(items);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get items by category
router.get("/category/:category", async (req, res) => {
  try {
    console.log("Fetching category:", req.params.category);
    const items = await BuildABouquet.find({ category: req.params.category });
    console.log("Found items:", items.length);
    res.json(items);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get flowers by type (base, filler, focal)
router.get("/flowers/:type", async (req, res) => {
  try {
    console.log("Fetching flowers with type:", req.params.type);
    const items = await BuildABouquet.find({ 
      category: "flower", 
      type: req.params.type 
    });
    console.log("Found items:", items.length);
    res.json(items);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
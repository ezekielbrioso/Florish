//Admin Routes

// Purpose: API endpoints for admin product management (CRUD operations)

//  - Provides POST /admin/create-product for creating new products
// - Protected by adminOnly middleware to restrict access to authorized admins
// - Allows admins to add new products with details: name, description, price, etc.
// - Handles product creation across all categories (bouquets, occasions, build items)
// - Essential for store owners to manage their product catalog
// - Returns success/error responses for admin operations
// - Note: Uses CommonJS syntax (require/module.exports) instead of ES6 imports

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { adminOnly } = require("../middleware/authMiddleware");

router.post("/admin/create-product", adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image, stock, occasion, color } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
      occasion,
      color
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

module.exports = router;
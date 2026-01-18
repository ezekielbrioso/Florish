//User Routes

// Purpose: API endpoints for user authentication and account management

// - Handles user login/registration via POST /api/users/login
// - Creates new user accounts on first login with Google authentication
// - Retrieves existing user data if account already exists
// - Stores user information in MongoDB User collection
// - Initializes empty arrays for saved bouquets and orders on new accounts
// - Essential for user authentication flow and account persistence
// - Works in conjunction with Firebase authentication on the frontend

import express from "express";
import User from "../models/User.js"; // MongoDB User model

const router = express.Router();

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        photoURL,
        savedBouquets: [],
        orders: []
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;

//User Model
//Purpose: Mongoose schema for user accounts and profiles

//- Defines the data structure for user accounts in the database
//- Stores user information: name, email, photo URL from Google authentication
// - Tracks saved bouquets (custom designs user wants to save)
// - Maintains order history for each user
// - Ensures email uniqueness to prevent duplicate accounts
//- Includes timestamps for account creation and updates
//- Maps to the 'users' collection in MongoDB
// - Essential for user authentication, personalization, and order tracking

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  savedBouquets: { type: Array, default: [] },
  orders: { type: Array, default: [] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

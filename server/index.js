/**
 * Express Server Entry Point
 * 
 * Purpose: Main backend server for the Florish e-commerce application
 * 
 * Why it's here:
 * - Initializes and configures the Express.js web server
 * - Connects to MongoDB database using Mongoose ODM
 * - Sets up CORS to allow cross-origin requests from the React frontend
 * - Registers API route handlers for users, products, occasions, and build items
 * - Loads environment variables for secure configuration (database URI, etc.)
 * - Starts the server on port 5000 to listen for HTTP requests
 * - Central hub that coordinates all backend API endpoints
 * - Essential for handling all client requests and database operations
 */

import dotenv from "dotenv";
dotenv.config();   // <- Make sure this is **at the top**, BEFORE mongoose.connect

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/products.js";
import occasionProductRoutes from "./routes/occasionProducts.js";
import buildItemRoutes from "./routes/buildItems.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

app.use("/api/users", userRoutes);




const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI not defined in .env!");
}

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/products", productRoutes);
app.use("/api/occasion-products", occasionProductRoutes);
app.use("/api/build-items", buildItemRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));


import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";          // <-- Add this
import path from "path";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// -------------------- CORS FIX --------------------
app.use(
  cors({
    origin: [
      "https://rst-store.netlify.app", // your frontend URL
      "http://localhost:3000",                          // local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Allow OPTIONS method for preflight
app.options("*", cors());
// ---------------------------------------------------

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

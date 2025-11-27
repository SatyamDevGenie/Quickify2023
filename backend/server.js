import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------
// ✅ CORS FIX
// ---------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rststore.netlify.app",   // 👈 REPLACE THIS
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------------
// API ROUTES
// ---------------------
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

// ---------------------
// Root Route
// ---------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---------------------
// Error Middlewares
// ---------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

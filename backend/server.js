import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
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

// ⭐ Required for Render
app.set("trust proxy", 1);

// -------------------- CORS FIX --------------------
app.use(
  cors({
    origin: [
      "https://rststore.netlify.app", // your real frontend
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.options("*", cors());
// ---------------------------------------------------

// Uploads folder (important!)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

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

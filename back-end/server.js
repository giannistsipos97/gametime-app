// backend/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import libraryRoutes from "./routes/library.js";

// Import your routes
import authRoutes from "./routes/auth.js";

dotenv.config();
dns.setServers(["1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) =>
  origin.trim(),
);

app.use(
  cors({
    origin: allowedOrigins?.length ? allowedOrigins : "http://localhost:4200",
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is required");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas via Forced DNS!"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

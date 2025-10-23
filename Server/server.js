import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { xss } from "express-xss-sanitizer";

// Routes
import userRoute from "./Routes/userRoute.js";
import pathRoute from "./Routes/pathRoute.js";
import errorController from "./Controllers/errorController.js";
import reviewRoute from "./Routes/reviewRoute.js";
import incidentRoute from "./Routes/incidentRoute.js";

// For testing
import Incident from "./Models/incidentModel.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./Server/config.env" });
}

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(mongoSanitize());
app.use(xss());

app.use(function (req, res, next) {
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  next();
});

// Test endpoint to check if incident API is working
app.get("/api/test-incident", async (req, res) => {
  try {
    // Check if we have any incidents
    const count = await Incident.countDocuments();

    // Create a test incident if none exist
    if (count === 0) {
      await Incident.create({
        id: "INC-2401",
        title: "Test Incident",
        severity: "medium",
        status: "open",
        assignee: "Test User",
      });
      return res.json({ message: "Test incident created!" });
    }

    return res.json({ message: `Found ${count} existing incidents` });
  } catch (err) {
    console.error("Test incident error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later!",
  },
});

app.use("/api", limiter);
// Routes
app.use("/api/user", userRoute);
app.use("/api/path", pathRoute);
app.use("/api/review", reviewRoute);
app.use("/api/incidents", incidentRoute);

// Global Error Handler
app.use(errorController);

// Support both local (.env) and pipeline (db, dbpass) environment variable names
const DATABASE = process.env.DATABASE;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DATABASE || !DATABASE_PASSWORD) {
  throw new Error("Missing DATABASE/DB or DATABASE_PASSWORD/DBPASS environment variables");
}

const DB = DATABASE.replace("<db_password>", DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("Connection ERROR💥:", err));

if (process.env.JEST_WORKER_ID === undefined) {
  // Only start server if not in test
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`app running on ${port}...`);
  });
}

export default app;

import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";


// Routes
import userRoute from "./Routes/userRoute.js";
import pathRoute from "./Routes/pathRoute.js";
import errorController from "./Controllers/errorController.js";
import reviewRoute from "./Routes/reviewRoute.js";
import incidentRoute from "./Routes/incidentRoute.js";

// For testing
import Incident from "./Models/incidentModel.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Routes
app.use("/api/user", userRoute);
app.use("/api/path", pathRoute);
app.use("/api/review", reviewRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/incidents", incidentRoute);


// Global Error Handler
app.use(errorController);

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("Connection ERROR💥:", err));

// Server
const port = 8000 || process.env.PORT;

app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

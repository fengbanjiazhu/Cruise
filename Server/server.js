import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import userRoute from "./Routes/userRoute.js";
import pathRoute from "./Routes/pathRoute.js";
import errorController from "./Controllers/errorController.js";
import reviewRoute from "./Routes/reviewRoute.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./Server/config.env" });
}

// dotenv.config({ path: "./Server/config.env" });

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

// Routes
app.use("/api/user", userRoute);
app.use("/api/path", pathRoute);
app.use("/api/review", reviewRoute);

//
app.use(errorController);


const DB = process.env.DATABASE.replace("<db_password>", process.env.DATABASE_PASSWORD);

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

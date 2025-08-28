import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import userRoute from "./Routes/userRoute.js";
import pathRoute from "./Routes/pathRoute.js";
import errorController from "./Controllers/errorController.js";
const app = express();

dotenv.config({ path: "./Server/config.env" });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Routes

app.use("/api/user", userRoute);
app.use("/api/path", pathRoute);

//
app.use(errorController);


const DB = process.env.DATABASE.replace("<db_password>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("Connection ERROR💥:", err));

// Server
const port = 8000 || process.env.PORT;

app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

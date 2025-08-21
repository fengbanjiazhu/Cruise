import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

dotenv.config({ path: "./Server/config.env" });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Routes
// app.use('/', someRoute);

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

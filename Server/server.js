import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

dotenv.config({ path: "./config.env" });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Routes
// app.use('/', someRoute);

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log("Connection ERROR💥:", err));

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

import dotenv from "dotenv";
import cors from "cors";

// import errorController from "./Controller/errorController.js";
// dotenv.config({ path: "./Server/config.env" });
import express from "express";

const app = express();

// import userRoute from "./Route/userRoute.js";

dotenv.config({ path: "./Server/config.env" });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(function (req, res, next) {
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  next();
});

// app.use("/api/user", userRoute);

// app.use(errorController);

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

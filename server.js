import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import { ApplicationError } from "./config/ApplicationError.js";
import userRoutes from "./src/users/user.routes.js";
import flightRoutes from "./src/flight/flight.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // 👈 must be before routes
// For form-data (if using multer for file uploads)
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// user routes
app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);

app.use((err, req, res, next) => {
  //   console.error(err.stack);
  console.log("Error in server file", err);
  if (err instanceof ApplicationError) {
    console.log("Application Error in serve file", err);

    res.status(err.code || 500).json({ status: false, message: err.message });
  } else {
    res.status(503).json({
      status: false,
      message: "Something went wrong, please try again later",
    });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on", PORT);
    });
  })
  .catch((err) => {
    console.log("Something went wrong in server connecting", err);
  });

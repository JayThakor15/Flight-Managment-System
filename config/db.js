import mongoose from "mongoose";
import { ApplicationError } from "./ApplicationError.js";
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.MONGODB_URI;
console.log(URL);

const connectDB = async () => {
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
    });
    console.log("MongoDb connected Successfully");
  } catch (error) {
    console.log(error);
    throw new ApplicationError("Error in mongoose connection", 400);
  }
};

export default connectDB;

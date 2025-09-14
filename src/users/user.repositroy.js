import mongoose from "mongoose";
import { ApplicationError } from "../../config/ApplicationError.js";
import userSchema from "./user.schema.js";

export default class userRepository {
  async signup(user) {
    try {
      // Create a instance of user Schema
      const newUser = new userSchema(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        // Wrap mongoose validation error in ApplicationError for consistent response
        throw new ApplicationError(error.message, 400);
      }
      throw new ApplicationError(
        "Something went wrong in database operation",
        500
      );
    }
  }
  async findByEmail(email) {
    try {
      const user = await userSchema.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApplicationError(error.message, 400);
      }
      throw new ApplicationError(
        "Something went wrong in database operation",
        500
      );
    }
  }

  async findById(userid) {
    try {
      const user = await userSchema.findById(userid).select("-password");
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApplicationError(error.message, 400);
      }
      throw new ApplicationError(
        "Something went wrong in database operation",
        500
      );
    }
  }

  async updateProfile(userId, updateInfo) {
    try {
      const updatedUser = await userSchema.findByIdAndUpdate(
        userId,
        updateInfo,
        { new: true } // Return the updated document
      );
      return updatedUser;
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApplicationError(error.message, 400);
      }
      throw new ApplicationError(
        "Something went wrong in database operation",
        500
      );
    }
  }
}

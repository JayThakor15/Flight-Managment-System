import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "./user.repositroy.js";
import { ApplicationError } from "../../config/ApplicationError.js";

export default class UserController {
  constructor() {
    this.userRepo = new userRepository();
  }

  async userSignup(req, res, next) {
    try {
      const { name, email, password, role, gender } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role || !gender) {
        return next(new ApplicationError("All fields are required", 400));
      }

      // Check if email is already registered
      const alreadyUserExists = await this.userRepo.findByEmail(email);
      if (alreadyUserExists) {
        return next(new ApplicationError("Email is already registered", 400));
      }

      // Hash the password correctly
      const hashedPassword = await bcrypt.hash(password, 12);

      // Get profile picture path (optional)
      const profilePicture = req.file ? req.file.path : null;

      const user = {
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        profilePicture,
      };

      // Save user to database
      const registeredUser = await this.userRepo.signup(user);

      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        registeredUser,
      });
    } catch (error) {
      // Forward error to centralized middleware
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const registeredUser = await this.userRepo.findByEmail(email);
      if (!registeredUser) {
        return next(
          new ApplicationError(
            "User is not registered, please register first!",
            400
          )
        );
      }

      // Compare password correctly
      const isMatch = await bcrypt.compare(password, registeredUser.password);
      if (!isMatch) {
        return next(new ApplicationError("Invalid Credentials!", 400));
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: registeredUser._id, email: registeredUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        status: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.log(error);
      next(new ApplicationError("Something went wrong in login", 500));
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const user = await this.userRepo.findById(userId);
      if (!user) {
        return next(new ApplicationError("User not found", 404));
      }
      return res.status(200).json({
        status: true,
        message: "Profile fetched successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      next(
        new ApplicationError("Something went wrong in fetching profile", 500)
      );
    }
  }
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const { name, email, role, gender } = req.body;
      if (!name || !email || !role || !gender) {
        return next(new ApplicationError("All fields are required", 400));
      }
      const updatedProfilePic = req.file ? req.file.path : null;
      if (!updatedProfilePic) {
        return next(new ApplicationError("Profile pic is required", 400));
      }
      const updateInfo = {
        name,
        email,
        type: role,
        gender,
        profilePicture: updatedProfilePic,
      };
      const updatedUser = await this.userRepo.updateProfile(userId, updateInfo);
      if (!updatedUser) {
        return next(new ApplicationError("User not found", 404));
      }
      return res.status(200).json({ 
        status: true,
        message: "Profile updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      next(
        new ApplicationError("Something went wrong in updating profile", 500)
      );
    }
  }

  async logout(req, res, next) {
    try {
      // JWT stateless auth: just inform client to remove token
      return res.status(200).json({
        status: true,
        message: "Logout successful. Please remove token from client storage.",
      });
    } catch (error) {
      next(new ApplicationError("Logout failed", 500));
    }
  }
}

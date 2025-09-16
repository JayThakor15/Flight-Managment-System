import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApplicationError } from "../../config/ApplicationError.js";
dotenv.config();
const tokenSecret = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  // Get token from Authorization header

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(new ApplicationError("Token not provided", 401));
  }

  try {
    const returnPayload = jwt.verify(authHeader, tokenSecret);
    req.user = returnPayload; // Attach user info to request

    next();
  } catch (error) {
    console.log(error);
    return next(new ApplicationError("Unauthorized", 401));
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      throw new ApplicationError("Forbidden", 403);
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

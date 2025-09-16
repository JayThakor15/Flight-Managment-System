import express from "express";
import bookingController from "./booking.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";
const bookingRouter = express.Router();

const bookingControllerInstance = new bookingController();
bookingRouter.post("/", authMiddleware, (req, res, next) =>
  bookingControllerInstance.createBooking(req, res, next)
);

bookingRouter.put("/:id/cancel", authMiddleware, (req, res, next) =>
  bookingControllerInstance.cancelBookingRequest(req, res, next)
);
bookingRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  (req, res, next) => bookingControllerInstance.cancelBooking(req, res, next)
);

export default bookingRouter;

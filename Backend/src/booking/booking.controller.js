import { ApplicationError } from "../../config/ApplicationError.js";
import BookingRepository from "./booking.repositroy.js";
import { FlightRepository } from "../flight/flight.repository.js";

export default class BookingController {
  constructor() {
    this.bookingRepo = new BookingRepository();
    this.flightRepo = new FlightRepository();
  }
  async createBooking(req, res, next) {
    try {
      const { flightId, passenger } = req.body;
      console.log(req.body, "req body in booking");

      if (!flightId || !passenger || !Array.isArray(passenger)) {
        throw new ApplicationError("Invalid booking data", 400);
      }
      const userId = req.user.userId || req.user.id;
      // console.log(userId, "user id in booking controller");

      //Calculate total price
      const flight = await this.flightRepo.getFlightById(flightId);
      if (!flight) {
        throw new ApplicationError("Flight not found", 404);
      }
      const totalPrice = flight.price * passenger.length;
      const booking = await this.bookingRepo.createBooking({
        user: userId,
        flight: flightId,
        passenger,
        totalPrice,
      });
      if (!booking) {
        throw new ApplicationError("Booking creation failed", 500);
      }
      res.status(201).json({
        status: "success",
        message: "Booking created successfully",
        booking,
      });
    } catch (error) {
      console.log(error, "error in booking controller");

      next(error);
    }
  }
  async cancelBooking(req, res, next) {
    try {
      const bookingId = req.params.id;
      if (!bookingId) {
        throw new ApplicationError("Invalid booking ID", 400);
      }
      const booking = await this.bookingRepo.cancelBooking(bookingId);
      if (!booking) {
        throw new ApplicationError("Booking cancellation failed", 500);
      }
      res.status(200).json({
        status: "success",
        message: "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      console.log(error, "error in booking controller");

      next(error);
    }
  }
  async cancelBookingRequest(req, res, next) {
    try {
      const bookingId = req.params.id;
      if (!bookingId) {
        throw new ApplicationError("Invalid booking ID", 400);
      }
      const userId = req.user.id;
      if (!userId) {
        throw new ApplicationError("User not found", 404);
      }
      const booking = await this.bookingRepo.cancelBookingRequest(
        userId,
        bookingId
      );
      if (!booking) {
        throw new ApplicationError("Booking cancellation failed", 500);
      }
      res.status(200).json({
        status: "success",
        message: "Booking cancelled successfully",
        booking,
      });
    } catch (error) {
      console.log(error, "error in booking controller");

      next(error);
    }
  }
}

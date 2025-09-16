import Booking from "./booking.schema.js";
import { ApplicationError } from "../../config/ApplicationError.js";
import Flight from "../flight/flight.schema.js";
export default class BookingRepository {
  //Implement Transaction
  async createBooking(data) {
    // const session = await Booking.startSession();
    try {
      
      const booking = new Booking(data);

      //Decrease seat availability in flight
      const flightId = data.flight;
      const flight = await Flight.findById(flightId);

      if (flight.availableSeats < data.passenger.length) {
        throw new ApplicationError("Not enough seats available", 400);
      }
      // session.startTransaction();
      flight.availableSeats -= data.passenger.length;
      await flight.save();
      await booking.save();
      // await session.commitTransaction();
      return booking;
    } catch (error) {
      // await session.abortTransaction();
      console.log("Error in booking repository:", error);
      throw new ApplicationError("Error creating booking: " + error.message);
    }
  }

  async getBookingById(id) {
    try {
      const booking = await Booking.findById(id)
        .populate("user", "name email")
        .populate("flight");
      return booking;
    } catch (error) {
      console.log("Error in booking repository:", error);
      throw new ApplicationError("Error fetching booking: " + error.message);
    }
  }

  async cancelBooking(id) {
    const booking = await Booking.findById(id);
    // const session = await Booking.startSession();
    try {
      if (!booking) {
        throw new ApplicationError("Booking not found", 404);
      }
      if (booking.bookingStatus === "cancelled") {
        throw new ApplicationError("Booking is already cancelled", 400);
      }
      const flight = await Flight.findById(booking.flight);
      // session.startTransaction();
      flight.availableSeats += booking.passenger.length;
      await flight.save();
      booking.bookingStatus = "cancelled";
      await booking.save();
      // await session.commitTransaction();
      return booking;
    } catch (error) {
      // await session.abortTransaction();
      console.log("Error in booking repository:", error);
      throw new ApplicationError("Error cancelling booking: " + error.message);
    }
  }
  async cancelBookingRequest(userId, bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new ApplicationError("Booking not found", 404);
      }
      if (booking.user.toString() !== userId) {
        throw new ApplicationError("Unauthorized", 403);
      }
      booking.bookingStatus = "pending_cancellation";
      await booking.save();
      return booking;
    } catch (error) {
      console.log("Error in booking repository:", error);
      throw new ApplicationError("Error cancelling booking: " + error.message);
    }
  }
}

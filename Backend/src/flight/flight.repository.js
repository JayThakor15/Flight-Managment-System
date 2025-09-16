import mongoose from "mongoose";
import { ApplicationError } from "../../config/ApplicationError.js";
import flightSchema from "./flight.schema.js";

export class FlightRepository {
  async createFlight(flightData) {
    try {
      const newFlight = new flightSchema(flightData);
      await newFlight.save();
      return newFlight;
    } catch (error) {
      console.log(error, "error in flight repo");
      throw new ApplicationError("Failed to create flight", error);
    }
  }
  async getFlightById(flightId) {
    try {
      const flight = await flightSchema.findById(flightId);
      return flight;
    } catch (error) {
      console.log(error, "error in flight repo get by id");

      throw new ApplicationError("Failed to fetch flight", error);
    }
  }
  async getFlightByNumberAndDepartureDate(flightNumber, departureDate) {
    try {
      const flight = await flightSchema.findOne({
        flightNumber,
        departureDate,
      });
      return flight;
    } catch (error) {
      throw new ApplicationError("Failed to filter flights", error);
    }
  }
  async filterFlights(filters, skip, limit) {
    try {
      const flights = await flightSchema.find(filters).skip(skip).limit(limit);
      return flights;
    } catch (error) {
      throw new ApplicationError("Failed to filter flights", error);
    }
  }
  async updateFlight(flightId, updateData) {
    try {
      const updatedFlight = await flightSchema.findByIdAndUpdate(
        flightId,
        updateData,
        { new: true }
      );
      return updatedFlight;
    } catch (error) {
      throw new ApplicationError("Failed to update flight", error);
    }
  }
  async getAllFlights() {
    try {
      const flights = await flightSchema.find();
      return flights;
    } catch (error) {
      throw new ApplicationError("Failed to fetch flights", error);
    }
  }

  async deleteFlight(flightId) {
    try {
      const deletedFlight = await flightSchema.findByIdAndDelete(flightId);
      return deletedFlight;
    } catch (error) {
      throw new ApplicationError("Failed to delete flight", error);
    }
  }
}

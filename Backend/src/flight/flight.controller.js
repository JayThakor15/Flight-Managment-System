import { ApplicationError } from "../../config/ApplicationError.js";
import { FlightRepository } from "./flight.repository.js";

export class FlightController {
  constructor(flightRepository) {
    this.flightRepo = new FlightRepository();
  }
  async createFlight(req, res, next) {
    try {
      const {
        flightNumber,
        airline,
        departureCity,
        arrivalCity,
        departureDate,
        arrivalDate,
        price,
        availableSeats,
        flightClass,
      } = req.body;

      if (
        !flightNumber ||
        !airline ||
        !departureCity ||
        !arrivalCity ||
        !departureDate ||
        !arrivalDate ||
        !price ||
        !availableSeats ||
        !flightClass
      ) {
        return next(new ApplicationError("All fields are required", 400));
      }
      // Check if flight number already exists
      const alreadyFlightExists =
        await this.flightRepo.getFlightByNumberAndDepartureDate(
          flightNumber,
          departureDate
        );
      if (alreadyFlightExists) {
        return next(new ApplicationError("Flight already exists", 400));
      }
      // Flight Pic
      const flightPic = req.file ? req.file.path : null;
      if (!flightPic) {
        return next(new ApplicationError("Flight image is required", 400));
      }
      const newFlight = await this.flightRepo.createFlight({
        flightNumber,
        airline,
        departureCity,
        arrivalCity,
        departureDate,
        arrivalDate,
        price,
        availableSeats,
        flightClass,
        image: flightPic,
      });
      if (!newFlight) return next(new ApplicationError("Flight not created"));
      return res.status(201).json({
        status: true,
        message: "Flight created successfully",
        newFlight,
      });
    } catch (error) {
      console.log(error, "error in flight controller");

      next(new ApplicationError("Failed to create flight", error));
    }
  }
  async getFlightById(req, res, next) {
    try {
      const flightId = req.params.id;
      const flight = await this.flightRepo.getFlightById(flightId);
      if (!flight) return next(new ApplicationError("Flight not found", 404));
      return res.status(200).json({
        status: true,
        flight,
      });
    } catch (error) {
      console.log(error, "error in flight controller");
      next(new ApplicationError("Failed to fetch flight", error));
    }
  }
  async filterFlights(req, res, next) {
    try {
      // implement pagination here
      const {
        departureCity,
        arrivalCity,
        departureDate,
        flightClass,
        page = 1,
        limit = 3,
      } = req.query;
      const filters = {};
      if (departureCity)
        filters.departureCity = { $regex: departureCity, $options: "i" }; //regex for case insensitive like if user types "new" it should match "New York"
      if (arrivalCity)
        filters.arrivalCity = { $regex: arrivalCity, $options: "i" };
      if (departureDate) filters.departureDate = new Date(departureDate);
      if (flightClass) filters.flightClass = flightClass;

      const skip = (page - 1) * limit;
      const flights = await this.flightRepo.filterFlights(filters, skip, limit);
      return res.status(200).json({
        status: true,
        flights,
      });
    } catch (error) {
      console.log(error, "error in flight controller");
      next(new ApplicationError("Failed to filter flights", error));
    }
  }
  async updateFlight(req, res, next) {
    try {
      const flightId = req.params.id;
      const {
        flightNumber,
        airline,
        departureCity,
        arrivalCity,
        departureDate,
        arrivalDate,
        price,
        availableSeats,
        flightClass,
      } = req.body;

      // Check for existence of flight
      if (!flightId) {
        return next(new ApplicationError("Flight ID is required", 400));
      }
      const flight = await this.flightRepo.getFlightById(flightId);
      if (!flight) return next(new ApplicationError("Flight not found", 404));
      // Prepare update data
      const updateData = {};
      if (flightNumber) updateData.flightNumber = flightNumber;
      if (airline) updateData.airline = airline;
      if (departureCity) updateData.departureCity = departureCity;
      if (arrivalCity) updateData.arrivalCity = arrivalCity;
      if (departureDate) updateData.departureDate = new Date(departureDate);
      if (arrivalDate) updateData.arrivalDate = new Date(arrivalDate);
      if (price) updateData.price = price;
      if (availableSeats) updateData.availableSeats = availableSeats;
      if (flightClass) updateData.flightClass = flightClass;
      const updatedFlight = await this.flightRepo.updateFlight(
        flightId,
        updateData
      );
      if (!updatedFlight)
        return next(new ApplicationError("Flight not found", 404));
      return res.status(200).json({
        status: true,
        message: "Flight updated successfully",
        updatedFlight,
      });
    } catch (error) {
      console.log(error, "error in flight controller");
      next(new ApplicationError("Failed to update flight", error));
    }
  }
  async getAllFlights(req, res, next) {
    try {
      const flights = await this.flightRepo.getAllFlights();
      return res.status(200).json({
        status: true,
        flights,
      });
    } catch (error) {
      console.log(error, "error in flight controller");
      next(new ApplicationError("Failed to fetch flights", error));
    }
  }
  async deleteFlight(req, res, next) {
    try {
      const flightId = req.params.id;
      const deletedFlight = await this.flightRepo.deleteFlight(flightId);
      if (!deletedFlight)
        return next(new ApplicationError("Flight not found", 404));
      return res.status(200).json({
        status: true,
        message: "Flight deleted successfully",
      });
    } catch (error) {
      console.log(error, "error in flight controller");
      next(new ApplicationError("Failed to delete flight", error));
    }
  }
}

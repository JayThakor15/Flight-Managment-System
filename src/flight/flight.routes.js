import express from "express";
import { FlightController } from "./flight.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import uploadFile from "../users/fileupload.middleware.js";

const flightControllerInstance = new FlightController();
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  uploadFile.single("flightImage"),
  (req, res, next) => {
    flightControllerInstance.createFlight(req, res, next);
  }
);
router.get("/filter", authMiddleware, (req, res, next) => {
  flightControllerInstance.filterFlights(req, res, next);
});
router.get("/", authMiddleware, (req, res, next) => {
  flightControllerInstance.getAllFlights(req, res, next);
});
router.get("/:id", authMiddleware, (req, res, next) => {
  flightControllerInstance.getFlightById(req, res, next);
});
router.put(
  "/:id",
  authMiddleware,
  uploadFile.single("flightImage"),
  (req, res, next) => {
    flightControllerInstance.updateFlight(req, res, next);
  }
);
router.delete("/:id", authMiddleware, (req, res, next) => {
  flightControllerInstance.deleteFlight(req, res, next);
});

export default router;

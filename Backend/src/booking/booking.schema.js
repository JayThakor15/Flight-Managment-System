import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  passenger: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "pending", "pending_cancellation"],
    default: "confirmed",
  },
});

export default mongoose.model("Booking", bookingSchema);

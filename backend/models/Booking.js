const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    devoteeName: {
      type: String,
      required: true,
      trim: true
    },

    pujaName: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "BOOKING_CONFIRMED",
        "PUJA_STARTED",
        "PUJA_COMPLETED",
        "VIDEO_AVAILABLE"
      ],
      default: "BOOKING_CONFIRMED"
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
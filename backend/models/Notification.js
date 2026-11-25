const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      required: true,
      enum: [
        "BOOKING_CONFIRMED",
        "PUJA_STARTED",
        "PUJA_COMPLETED",
        "VIDEO_AVAILABLE"
      ]
    },

    channel: {
      type: String,
      enum: ["WHATSAPP"],
      default: "WHATSAPP"
    },

    deliveryStatus: {
      type: String,
      enum: ["MOCKED"],
      default: "MOCKED"
    },

    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({
  bookingId: 1,
  createdAt: -1
});
notificationSchema.index(
  { bookingId: 1, status: 1 },
  { unique: true }
);
const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;
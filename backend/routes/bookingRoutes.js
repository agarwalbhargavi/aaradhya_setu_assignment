const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);

router.get("/", bookingController.getAllBookings);

router.get("/:bookingId", bookingController.getBookingById);

router.patch(
  "/:bookingId/status",
  bookingController.updateBookingStatus
);

router.get(
  "/:bookingId/notifications",
  bookingController.getBookingNotifications
);

module.exports = router;
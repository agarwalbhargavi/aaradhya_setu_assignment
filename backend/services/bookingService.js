const mongoose = require("mongoose");

const {
  isValidStatus,
  isValidTransition
} = require("./workflowService");

const {
  createNotification
} = require("./notificationService");

const Booking = require("../models/Booking");
const BOOKING_STATUS = require("../constants/bookingStatus");
// Create a new booking
const createBooking = async (bookingData) => {
  const session = await mongoose.startSession();

  try {
    let createdBooking;

    await session.withTransaction(async () => {

      // Step 1: Create the booking
      const bookings = await Booking.create(
        [
          {
            bookingId: bookingData.bookingId,
            devoteeName: bookingData.devoteeName,
            pujaName: bookingData.pujaName,
            status: BOOKING_STATUS.CONFIRMED
          }
        ],
        { session }
      );

      createdBooking = bookings[0];

      // Step 2: Generate and save confirmation notification
      await createNotification(
        createdBooking,
        BOOKING_STATUS.CONFIRMED,
        { session }
      );

    });

    return createdBooking;

  } finally {
    await session.endSession();
  }
};

// Get all bookings
const getAllBookings = async () => {
  const bookings = await Booking.find()
    .sort({ createdAt: -1 });

  return bookings;
};

// Get one booking by its business ID
const getBookingById = async (bookingId) => {
  const booking = await Booking.findOne({
    bookingId
  });

  return booking;
};

const updateBookingStatus = async (bookingId, nextStatus) => {
  if (!isValidStatus(nextStatus)) {
    const error = new Error("Invalid booking status");
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    let updatedBooking;

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({
        bookingId
      }).session(session);

      if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
      }

      if (!isValidTransition(booking.status, nextStatus)) {
        const error = new Error(
          `Cannot transition from ${booking.status} to ${nextStatus}`
        );

        error.statusCode = 409;
        throw error;
      }

      updatedBooking = await Booking.findOneAndUpdate(
        {
          bookingId,
          status: booking.status
        },
        {
          $set: {
            status: nextStatus
          }
        },
        {
          new: true,
          runValidators: true,
          session
        }
      );

      if (!updatedBooking) {
        const error = new Error(
          "Booking status changed concurrently. Please retry."
        );

        error.statusCode = 409;
        throw error;
      }

      await createNotification(
        updatedBooking,
        nextStatus,
        { session }
      );
    });

    return updatedBooking;

  } finally {
    await session.endSession();
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
};
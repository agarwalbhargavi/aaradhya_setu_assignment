const bookingService = require("../services/bookingService");
const notificationService = require("../services/notificationService");
// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { bookingId, devoteeName, pujaName } = req.body;

    if (
      typeof bookingId !== "string" ||
      typeof devoteeName !== "string" ||
      typeof pujaName !== "string" ||
      !bookingId.trim() ||
      !devoteeName.trim() ||
      !pujaName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, devotee name and puja name are required."
      });
    }

    const booking = await bookingService.createBooking({
      bookingId,
      devoteeName,
      pujaName
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A booking with this ID already exists."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// GET /api/bookings/:bookingId
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// PATCH /api/bookings/:bookingId/status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (typeof status !== "string" || !status.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid status is required"
      });
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking
    });

  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A notification already exists for this booking stage"
      });
    }

    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status"
    });
  }
};

// GET /api/bookings/:bookingId/notifications
const getBookingNotifications = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Step 1: Check whether the booking exists
    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Step 2: Fetch notification history
    const notifications =
      await notificationService.getNotificationsByBookingId(bookingId);

    // Step 3: Return notifications
    return res.status(200).json({
      success: true,
      bookingId,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error("Get booking notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications"
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingNotifications
};
const BOOKING_STATUS = require("../constants/bookingStatus");

const notificationTemplates = {
  [BOOKING_STATUS.CONFIRMED]: (booking) =>
    `Namaste ${booking.devoteeName} 🙏

Your ${booking.pujaName} Puja has been successfully booked.

Booking ID: ${booking.bookingId}

Thank you for choosing Aaradhya Setu.`,

  [BOOKING_STATUS.STARTED]: (booking) =>
    `Namaste ${booking.devoteeName} 🙏

Your ${booking.pujaName} Puja has started.

Booking ID: ${booking.bookingId}

May divine blessings be with you.`,

  [BOOKING_STATUS.COMPLETED]: (booking) =>
    `Namaste ${booking.devoteeName} 🙏

Your ${booking.pujaName} Puja has been successfully completed.

Booking ID: ${booking.bookingId}

Thank you for being part of this sacred journey.`,

  [BOOKING_STATUS.VIDEO_AVAILABLE]: (booking) =>
    `Namaste ${booking.devoteeName} 🙏

The video of your ${booking.pujaName} Puja is now available.

Booking ID: ${booking.bookingId}

You can now view your Puja recording.`
};

const generateNotificationMessage = (booking, status) => {
  const template = notificationTemplates[status];

  if (!template) {
    throw new Error(`No notification template found for status: ${status}`);
  }

  return template(booking);
};

module.exports = {
  notificationTemplates,
  generateNotificationMessage
};
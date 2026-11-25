const Notification = require("../models/Notification");

const {
  generateNotificationMessage
} = require("../templates/notificationTemplates");

const createNotification = async (booking, status, options = {}) => {
  const message = generateNotificationMessage(booking, status);

  const notification = new Notification({
    bookingId: booking.bookingId,
    status,
    channel: "WHATSAPP",
    deliveryStatus: "MOCKED",
    message
  });

  await notification.save(options);

  return notification;
};

const getNotificationsByBookingId = async (bookingId) => {
  return Notification.find({ bookingId })
    .sort({ createdAt: -1 });
};

module.exports = {
  createNotification,
  getNotificationsByBookingId
};
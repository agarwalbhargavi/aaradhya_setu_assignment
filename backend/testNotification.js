const {
  generateNotificationMessage
} = require("./templates/notificationTemplates");

const BOOKING_STATUS = require("./constants/bookingStatus");

const testBooking = {
  bookingId: "AS1001",
  devoteeName: "Rahul Sharma",
  pujaName: "Rudrabhishek"
};

console.log("\n===== BOOKING CONFIRMED =====");

console.log(
  generateNotificationMessage(
    testBooking,
    BOOKING_STATUS.CONFIRMED
  )
);

console.log("\n===== PUJA STARTED =====");

console.log(
  generateNotificationMessage(
    testBooking,
    BOOKING_STATUS.STARTED
  )
);

console.log("\n===== PUJA COMPLETED =====");

console.log(
  generateNotificationMessage(
    testBooking,
    BOOKING_STATUS.COMPLETED
  )
);

console.log("\n===== VIDEO AVAILABLE =====");

console.log(
  generateNotificationMessage(
    testBooking,
    BOOKING_STATUS.VIDEO_AVAILABLE
  )
);
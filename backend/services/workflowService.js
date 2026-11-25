const BOOKING_STATUS = require("../constants/bookingStatus");

const ALLOWED_TRANSITIONS = Object.freeze({
  [BOOKING_STATUS.CONFIRMED]: BOOKING_STATUS.STARTED,

  [BOOKING_STATUS.STARTED]: BOOKING_STATUS.COMPLETED,

  [BOOKING_STATUS.COMPLETED]: BOOKING_STATUS.VIDEO_AVAILABLE,

  [BOOKING_STATUS.VIDEO_AVAILABLE]: null
});

const isValidStatus = (status) => {
  return Object.values(BOOKING_STATUS).includes(status);
};

const getNextStatus = (currentStatus) => {
  return ALLOWED_TRANSITIONS[currentStatus] ?? null;
};

const isValidTransition = (currentStatus, nextStatus) => {
  if (!isValidStatus(currentStatus)) {
    return false;
  }

  if (!isValidStatus(nextStatus)) {
    return false;
  }

  return getNextStatus(currentStatus) === nextStatus;
};

module.exports = {
  ALLOWED_TRANSITIONS,
  isValidStatus,
  getNextStatus,
  isValidTransition
};
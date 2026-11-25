const {
  isValidStatus,
  getNextStatus,
  isValidTransition
} = require("./services/workflowService");

console.log("TEST 1:");
console.log(isValidStatus("PUJA_STARTED"));

console.log("TEST 2:");
console.log(getNextStatus("BOOKING_CONFIRMED"));

console.log("TEST 3:");
console.log(
  isValidTransition(
    "BOOKING_CONFIRMED",
    "PUJA_STARTED"
  )
);

console.log("TEST 4:");
console.log(
  isValidTransition(
    "BOOKING_CONFIRMED",
    "VIDEO_AVAILABLE"
  )
);

console.log("TEST 5:");
console.log(getNextStatus("VIDEO_AVAILABLE"));
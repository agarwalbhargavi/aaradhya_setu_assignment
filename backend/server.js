const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PujaFlow API"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "PujaFlow backend is running"
  });
});

app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start PujaFlow backend");
    process.exit(1);
  }
};

startServer();
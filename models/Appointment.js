const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  booking_time: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
    required: true,
  },
  department_code: {
    type: Number,
    required: true,
  },
  queue_position_at_booking: {
    type: Number,
    required: true,
  },
  priority: {
    type: Boolean,
    default: false,
  },
  priority_count_ahead: {
    type: Number,
    default: 0,
  },
  predicted_wait_time_min: {
    type: Number,
  },
  service_start_time: Date,
  service_end_time: Date,
  status: {
    type: String,
    enum: ["waiting", "in-progress", "completed"],
    default: "waiting",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);

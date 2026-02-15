const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  department_code: {
    type: Number,
    required: true,
    unique: true,
  },
  department_name: {
    type: String,
    required: true,
  },
  avg_service_time_ward: {
    type: Number,
    required: true,
  },
  active_counters: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Department", departmentSchema);

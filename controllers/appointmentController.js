const Appointment = require("../models/Appointment");
const Department = require("../models/Department");
const getPredictedWaitTime = require("../services/mlService");

exports.bookAppointment = async (req, res) => {
  try {
    const { department_code, priority = false, travel_time = 0 } = req.body;

    const now = new Date();

    const department = await Department.findOne({ department_code });
    if (!department)
      return res.status(404).json({ error: "Department not found" });

    const queueCount = await Appointment.countDocuments({
      department_code,
      status: "waiting",
    });

    const priorityCountAhead = await Appointment.countDocuments({
      department_code,
      status: "waiting",
      priority: true,
    });

    const queuePosition = queueCount + 1;

    const mlPayload = {
      queue_position_at_booking: queuePosition,
      department_code,
      hour_of_day: now.getHours(),
      day_of_week: now.getDay(),
      avg_service_time_ward: department.avg_service_time_ward,
      priority_count_ahead: priorityCountAhead,
    };

    let predictedWait = await getPredictedWaitTime(mlPayload);

    if (!predictedWait) {
      predictedWait = queuePosition * department.avg_service_time_ward;
    }

    const buffer = 5;
    const leaveTime = new Date(
      now.getTime() + (predictedWait - travel_time - buffer) * 60000
    );

    const appointment = await Appointment.create({
      department: department.department_name,
      department_code,
      queue_position_at_booking: queuePosition,
      priority,
      priority_count_ahead: priorityCountAhead,
      predicted_wait_time_min: predictedWait,
    });

    res.status(201).json({
      appointment,
      predicted_wait_time: predictedWait,
      recommended_leave_time: leaveTime,
    });

  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
};

exports.getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find().sort({ booking_time: -1 });
  res.json(appointments);
};

exports.getByDepartment = async (req, res) => {
  const appointments = await Appointment.find({
    department_code: req.params.code,
  });
  res.json(appointments);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(appointment);
};

exports.completeAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment)
    return res.status(404).json({ error: "Not found" });

  appointment.status = "completed";
  appointment.service_end_time = new Date();

  await appointment.save();

  res.json({
    message: "Appointment completed",
    appointment,
  });
};

exports.callNextPatient = async (req, res) => {
  try {
    const { department_code } = req.params;

    console.log("Department code:", department_code);

    const nextPatient = await Appointment.findOne({
      department_code,
      status: "waiting",
    }).sort({ booking_time: 1 });

    console.log("Next patient found:", nextPatient);

    if (!nextPatient) {
      return res.status(404).json({ message: "No waiting patients" });
    }

    nextPatient.status = "in-progress";
    nextPatient.service_start_time = new Date();

    await nextPatient.save();

    res.json(nextPatient);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLiveQueuePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status !== "waiting") {
      return res.json({ queue_position: 0 });
    }

    const countAhead = await Appointment.countDocuments({
      department_code: appointment.department_code,
      status: "waiting",
      booking_time: { $lt: appointment.booking_time },
    });

    res.json({
      queue_position: countAhead + 1,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate queue position" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const now = new Date();

    // Recalculate leave time (same logic as booking)
    const travelTime = req.query.travel_time || 0; // optional from frontend
    const buffer = 5;

    let recommendedLeaveTime = null;

    if (appointment.predicted_wait_time_min) {
      recommendedLeaveTime = new Date(
        appointment.booking_time.getTime() +
          (appointment.predicted_wait_time_min - travelTime - buffer) * 60000
      );
    }

    res.json({
      _id: appointment._id,
      department: appointment.department,
      queue_position_at_booking: appointment.queue_position_at_booking,
      predicted_wait_time_min: appointment.predicted_wait_time_min,
      status: appointment.status,
      booking_time: appointment.booking_time,
      recommended_leave_time: recommendedLeaveTime,
      service_start_time: appointment.service_start_time || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};
const Appointment = require("../models/Appointment.js");

exports.getQueueSummary = async (req, res) => {
    try {
      const { department_code } = req.params;
  
      const totalWaiting = await Appointment.countDocuments({
        department_code,
        status: "waiting",
      });
  
      const totalInProgress = await Appointment.countDocuments({
        department_code,
        status: "in-progress",
      });
  
      const waitingAppointments = await Appointment.find({
        department_code,
        status: "waiting",
      });
  
      const avgPredictedWait =
        waitingAppointments.length > 0
          ? waitingAppointments.reduce(
              (acc, curr) => acc + curr.predicted_wait_time_min,
              0
            ) / waitingAppointments.length
          : 0;
  
      res.json({
        total_waiting: totalWaiting,
        total_in_progress: totalInProgress,
        avg_predicted_wait: Math.round(avgPredictedWait),
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to get queue summary" });
    }
  };
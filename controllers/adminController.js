const Appointment = require("../models/Appointment.js");

exports.getAdminStats = async (req, res) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      const todayAppointments = await Appointment.find({
        booking_time: { $gte: todayStart },
      });
  
      const totalToday = todayAppointments.length;
  
      const completedToday = todayAppointments.filter(
        (a) => a.status === "completed"
      ).length;
  
      const avgWait =
        todayAppointments.length > 0
          ? todayAppointments.reduce(
              (acc, curr) => acc + (curr.predicted_wait_time_min || 0),
              0
            ) / todayAppointments.length
          : 0;
  
      const hourMap = {};
      todayAppointments.forEach((a) => {
        const hour = new Date(a.booking_time).getHours();
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      });
  
      const peakHour =
        Object.keys(hourMap).length > 0
          ? Object.keys(hourMap).reduce((a, b) =>
              hourMap[a] > hourMap[b] ? a : b
            )
          : null;
  
      res.json({
        total_appointments_today: totalToday,
        completed_today: completedToday,
        average_predicted_wait: Math.round(avgWait),
        peak_hour: peakHour,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  };
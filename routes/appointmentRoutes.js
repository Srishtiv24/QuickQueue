const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.get("/", controller.getAllAppointments);
router.post("/book", controller.bookAppointment);//user
router.get("/department/:code", controller.getByDepartment);
router.patch("/next/:department_code", controller.callNextPatient);
router.get("/queue-position/:id", controller.getLiveQueuePosition);
router.get("/:id", controller.getAppointmentById);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/complete", controller.completeAppointment);

module.exports = router;

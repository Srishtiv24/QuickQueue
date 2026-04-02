const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.post("/book", controller.bookAppointment);//user
router.get("/", controller.getAllAppointments);
router.get("/department/:code", controller.getByDepartment);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/complete", controller.completeAppointment);
router.patch("/next/:department_code", controller.callNextPatient);
router.get("/queue-position/:id", controller.getLiveQueuePosition);

module.exports = router;

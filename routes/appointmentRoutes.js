const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.post("/book", controller.bookAppointment);
router.get("/", controller.getAllAppointments);
router.get("/department/:code", controller.getByDepartment);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/complete", controller.completeAppointment);

module.exports = router;

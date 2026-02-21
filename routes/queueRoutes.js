const express = require("express");
const router = express.Router();
const controller = require("../controllers/queueController");

router.get("/summary/:department_code", controller.getQueueSummary);

module.exports = router;



const express = require("express");
const { login, register, getProfile } = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// ✅ ADD THIS
router.get("/profile", authMiddleware, getProfile);

module.exports = router;


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/appointments", require("./routes/appointmentRoutes"));
app.use("/api/v1/departments", require("./routes/departmentRoutes"));
app.use("/api/v1/queue", require("./routes/queueRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

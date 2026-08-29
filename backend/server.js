const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");

const teacherRoutes = require("./routes/teacherRoutes");

const classRoutes = require("./routes/classRoutes");

const subjectRoutes = require("./routes/subjectRoutes");

const attendanceRoutes = require("./routes/attendanceRoutes");

const examRoutes = require("./routes/examRoutes");

const resultRoutes = require("./routes/resultRoutes");

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "School Management System API is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
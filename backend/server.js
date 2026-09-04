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

const feeRoutes = require("./routes/feeRoutes");

const noticeRoutes = require("./routes/noticeRoutes");

const teacherSubjectRoutes = require("./routes/teacherSubjectRoutes");

const userRoutes = require("./routes/userRoutes");

const authRoutes = require("./routes/authRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/fees", feeRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/teacher-subjects", teacherSubjectRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "School Management System API is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
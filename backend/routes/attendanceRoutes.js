const express = require("express");

const {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

// Get all attendance records
router.get("/", getAttendance);

// Get one attendance record
router.get("/:id", getAttendanceById);

// Create attendance
router.post("/", createAttendance);

// Update attendance
router.put("/:id", updateAttendance);

// Delete attendance
router.delete("/:id", deleteAttendance);

module.exports = router;
const express = require("express");

const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

// Get all teachers
router.get("/", getTeachers);

// Get one teacher
router.get("/:id", getTeacherById);

// Create teacher
router.post("/", createTeacher);

// Update teacher
router.put("/:id", updateTeacher);

// Delete teacher
router.delete("/:id", deleteTeacher);

module.exports = router;
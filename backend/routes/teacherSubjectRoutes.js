const express = require("express");

const {
  getTeacherSubjects,
  getTeacherSubjectById,
  createTeacherSubject,
  updateTeacherSubject,
  deleteTeacherSubject,
} = require("../controllers/teacherSubjectController");

const router = express.Router();

// Get all teacher-subject assignments
router.get("/", getTeacherSubjects);

// Get one assignment
router.get("/:id", getTeacherSubjectById);

// Create assignment
router.post("/", createTeacherSubject);

// Update assignment
router.put("/:id", updateTeacherSubject);

// Delete assignment
router.delete("/:id", deleteTeacherSubject);

module.exports = router;
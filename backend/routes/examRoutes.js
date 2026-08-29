const express = require("express");

const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const router = express.Router();

// Get all exams
router.get("/", getExams);

// Get one exam
router.get("/:id", getExamById);

// Create exam
router.post("/", createExam);

// Update exam
router.put("/:id", updateExam);

// Delete exam
router.delete("/:id", deleteExam);

module.exports = router;
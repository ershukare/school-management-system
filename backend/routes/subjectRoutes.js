const express = require("express");

const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const router = express.Router();

// Get all subjects
router.get("/", getSubjects);

// Get one subject
router.get("/:id", getSubjectById);

// Create subject
router.post("/", createSubject);

// Update subject
router.put("/:id", updateSubject);

// Delete subject
router.delete("/:id", deleteSubject);

module.exports = router;
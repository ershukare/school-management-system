const express = require("express");

const {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const router = express.Router();

// Get all classes
router.get("/", getClasses);

// Get one class
router.get("/:id", getClassById);

// Create class
router.post("/", createClass);

// Update class
router.put("/:id", updateClass);

// Delete class
router.delete("/:id", deleteClass);

module.exports = router;
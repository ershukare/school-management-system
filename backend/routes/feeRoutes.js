const express = require("express");

const {
  getFees,
  getFeeById,
  getStudentFeeSummary,
  createFee,
  updateFee,
  deleteFee,
} = require("../controllers/feeController");

const router = express.Router();

// Get all fees
router.get("/", getFees);

// Get fee summary for one student
router.get("/student/:student_id/summary", getStudentFeeSummary);

// Get one fee
router.get("/:id", getFeeById);

// Create fee
router.post("/", createFee);

// Update fee
router.put("/:id", updateFee);

// Delete fee
router.delete("/:id", deleteFee);

module.exports = router;
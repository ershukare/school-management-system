const express = require("express");

const {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");

const router = express.Router();

// Get all results
router.get("/", getResults);

// Get one result
router.get("/:id", getResultById);

// Create result
router.post("/", createResult);

// Update result
router.put("/:id", updateResult);

// Delete result
router.delete("/:id", deleteResult);

module.exports = router;
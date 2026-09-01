const express = require("express");

const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const router = express.Router();

// Get all notices
router.get("/", getNotices);

// Get one notice
router.get("/:id", getNoticeById);

// Create notice
router.post("/", createNotice);

// Update notice
router.put("/:id", updateNotice);

// Delete notice
router.delete("/:id", deleteNotice);

module.exports = router;
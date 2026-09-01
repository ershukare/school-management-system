const db = require("../config/db");

// Get all notices
const getNotices = (req, res) => {
  const sql = "SELECT * FROM notices ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch notices",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one notice by ID
const getNoticeById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM notices WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch notice",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create notice
const createNotice = (req, res) => {
  const {
    title,
    message,
    audience,
    created_by,
  } = req.body;

  const sql = `
    INSERT INTO notices
    (
      title,
      message,
      audience,
      created_by
    )
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    title,
    message,
    audience,
    created_by || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create notice",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Notice created successfully",
      notice_id: result.insertId,
    });
  });
};

// Update notice
const updateNotice = (req, res) => {
  const { id } = req.params;

  const {
    title,
    message,
    audience,
    created_by,
  } = req.body;

  const sql = `
    UPDATE notices
    SET
      title = ?,
      message = ?,
      audience = ?,
      created_by = ?
    WHERE id = ?
  `;

  const values = [
    title,
    message,
    audience,
    created_by || null,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update notice",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice updated successfully",
    });
  });
};

// Delete notice
const deleteNotice = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM notices WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete notice",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  });
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
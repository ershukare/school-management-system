const db = require("../config/db");

// Get all results
const getResults = (req, res) => {
  const sql = "SELECT * FROM results ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch results",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one result by ID
const getResultById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM results WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch result",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create result
const createResult = (req, res) => {
  const {
    student_id,
    subject_id,
    exam_id,
    marks,
    grade,
    remarks,
  } = req.body;

  const sql = `
    INSERT INTO results
    (
      student_id,
      subject_id,
      exam_id,
      marks,
      grade,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    subject_id,
    exam_id,
    marks,
    grade,
    remarks,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create result",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Result created successfully",
      result_id: result.insertId,
    });
  });
};

// Update result
const updateResult = (req, res) => {
  const { id } = req.params;

  const {
    student_id,
    subject_id,
    exam_id,
    marks,
    grade,
    remarks,
  } = req.body;

  const sql = `
    UPDATE results
    SET
      student_id = ?,
      subject_id = ?,
      exam_id = ?,
      marks = ?,
      grade = ?,
      remarks = ?
    WHERE id = ?
  `;

  const values = [
    student_id,
    subject_id,
    exam_id,
    marks,
    grade,
    remarks,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update result",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json({
      message: "Result updated successfully",
    });
  });
};

// Delete result
const deleteResult = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM results WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete result",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json({
      message: "Result deleted successfully",
    });
  });
};

module.exports = {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
};
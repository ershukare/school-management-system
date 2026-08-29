const db = require("../config/db");

// Get all subjects
const getSubjects = (req, res) => {
  const sql = "SELECT * FROM subjects";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch subjects",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one subject by ID
const getSubjectById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM subjects WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch subject",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create a new subject
const createSubject = (req, res) => {
  const {
    name,
    code,
    description,
  } = req.body;

  const sql = `
    INSERT INTO subjects
    (
      name,
      code,
      description
    )
    VALUES (?, ?, ?)
  `;

  const values = [
    name,
    code,
    description,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create subject",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Subject created successfully",
      subject_id: result.insertId,
    });
  });
};

// Update subject
const updateSubject = (req, res) => {
  const { id } = req.params;

  const {
    name,
    code,
    description,
  } = req.body;

  const sql = `
    UPDATE subjects
    SET
      name = ?,
      code = ?,
      description = ?
    WHERE id = ?
  `;

  const values = [
    name,
    code,
    description,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update subject",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject updated successfully",
    });
  });
};

// Delete subject
const deleteSubject = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM subjects WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete subject",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  });
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
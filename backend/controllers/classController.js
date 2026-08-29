const db = require("../config/db");

// Get all classes
const getClasses = (req, res) => {
  const sql = "SELECT * FROM classes";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch classes",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one class by ID
const getClassById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM classes WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch class",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create a new class
const createClass = (req, res) => {
  const {
    name,
    section,
    academic_year,
  } = req.body;

  const sql = `
    INSERT INTO classes
    (
      name,
      section,
      academic_year
    )
    VALUES (?, ?, ?)
  `;

  const values = [
    name,
    section,
    academic_year,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create class",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Class created successfully",
      class_id: result.insertId,
    });
  });
};

// Update class
const updateClass = (req, res) => {
  const { id } = req.params;

  const {
    name,
    section,
    academic_year,
  } = req.body;

  const sql = `
    UPDATE classes
    SET
      name = ?,
      section = ?,
      academic_year = ?
    WHERE id = ?
  `;

  const values = [
    name,
    section,
    academic_year,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update class",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json({
      message: "Class updated successfully",
    });
  });
};

// Delete class
const deleteClass = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM classes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete class",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json({
      message: "Class deleted successfully",
    });
  });
};

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
const db = require("../config/db");

// Get all teacher-subject assignments
const getTeacherSubjects = (req, res) => {
  const sql = "SELECT * FROM teacher_subjects ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch teacher subjects",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one assignment by ID
const getTeacherSubjectById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM teacher_subjects WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch teacher subject",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Teacher subject assignment not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create teacher-subject assignment
const createTeacherSubject = (req, res) => {
  const {
    teacher_id,
    subject_id,
    class_id,
  } = req.body;

  const sql = `
    INSERT INTO teacher_subjects
    (
      teacher_id,
      subject_id,
      class_id
    )
    VALUES (?, ?, ?)
  `;

  const values = [
    teacher_id,
    subject_id,
    class_id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create teacher subject",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Teacher subject created successfully",
      teacher_subject_id: result.insertId,
    });
  });
};

// Update teacher-subject assignment
const updateTeacherSubject = (req, res) => {
  const { id } = req.params;

  const {
    teacher_id,
    subject_id,
    class_id,
  } = req.body;

  const sql = `
    UPDATE teacher_subjects
    SET
      teacher_id = ?,
      subject_id = ?,
      class_id = ?
    WHERE id = ?
  `;

  const values = [
    teacher_id,
    subject_id,
    class_id,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update teacher subject",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Teacher subject assignment not found",
      });
    }

    res.status(200).json({
      message: "Teacher subject updated successfully",
    });
  });
};

// Delete teacher-subject assignment
const deleteTeacherSubject = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM teacher_subjects WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete teacher subject",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Teacher subject assignment not found",
      });
    }

    res.status(200).json({
      message: "Teacher subject deleted successfully",
    });
  });
};

module.exports = {
  getTeacherSubjects,
  getTeacherSubjectById,
  createTeacherSubject,
  updateTeacherSubject,
  deleteTeacherSubject,
};
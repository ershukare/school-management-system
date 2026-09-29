const db = require("../config/db");

// Get all exams
const getExams = (req, res) => {
  const sql = `
    SELECT
      e.id,
      e.name,
      e.class_id,
      e.subject_id,
      e.teacher_id,
      e.exam_type,
      e.exam_date,
      e.academic_year,
      e.created_at,

      c.name AS class_name,
      c.section AS class_section,

      s.name AS subject_name,

      t.teacher_code,
      t.first_name AS teacher_first_name,
      t.last_name AS teacher_last_name

    FROM exams e

    LEFT JOIN classes c
      ON e.class_id = c.id

    LEFT JOIN subjects s
      ON e.subject_id = s.id

    LEFT JOIN teachers t
      ON e.teacher_id = t.id

    ORDER BY e.exam_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch exams",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one exam by ID
const getExamById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      e.id,
      e.name,
      e.class_id,
      e.subject_id,
      e.teacher_id,
      e.exam_type,
      e.exam_date,
      e.academic_year,
      e.created_at,

      c.name AS class_name,
      c.section AS class_section,

      s.name AS subject_name,

      t.teacher_code,
      t.first_name AS teacher_first_name,
      t.last_name AS teacher_last_name

    FROM exams e

    LEFT JOIN classes c
      ON e.class_id = c.id

    LEFT JOIN subjects s
      ON e.subject_id = s.id

    LEFT JOIN teachers t
      ON e.teacher_id = t.id

    WHERE e.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch exam",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create exam
const createExam = (req, res) => {
  const {
    name,
    class_id,
    subject_id,
    teacher_id,
    exam_type,
    exam_date,
    academic_year,
  } = req.body;

  const sql = `
    INSERT INTO exams
    (
      name,
      class_id,
      subject_id,
      teacher_id,
      exam_type,
      exam_date,
      academic_year
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    class_id,
    subject_id,
    teacher_id,
    exam_type,
    exam_date,
    academic_year,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create exam",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Exam created successfully",
      exam_id: result.insertId,
    });
  });
};

// Update exam
const updateExam = (req, res) => {
  const { id } = req.params;

  const {
    name,
    class_id,
    subject_id,
    teacher_id,
    exam_type,
    exam_date,
    academic_year,
  } = req.body;

  const sql = `
    UPDATE exams
    SET
      name = ?,
      class_id = ?,
      subject_id = ?,
      teacher_id = ?,
      exam_type = ?,
      exam_date = ?,
      academic_year = ?
    WHERE id = ?
  `;

  const values = [
    name,
    class_id,
    subject_id,
    teacher_id,
    exam_type,
    exam_date,
    academic_year,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update exam",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    res.status(200).json({
      message: "Exam updated successfully",
    });
  });
};

// Delete exam
const deleteExam = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM exams WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete exam",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    res.status(200).json({
      message: "Exam deleted successfully",
    });
  });
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
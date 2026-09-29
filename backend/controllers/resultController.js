const db = require("../config/db");

// Get all results
const getResults = (req, res) => {
  const sql = `
    SELECT
      r.id,
      r.student_id,
      r.subject_id,
      r.exam_id,
      r.marks,
      r.remarks,

      s.student_code,
      s.first_name AS student_first_name,
      s.last_name AS student_last_name,

      sub.name AS subject_name,

      e.name AS exam_name,
      e.exam_type,
      e.exam_date,
      e.academic_year

    FROM results r

    LEFT JOIN students s
      ON r.student_id = s.id

    LEFT JOIN subjects sub
      ON r.subject_id = sub.id

    LEFT JOIN exams e
      ON r.exam_id = e.id

    ORDER BY r.id DESC
  `;

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

  const sql = `
    SELECT
      r.id,
      r.student_id,
      r.subject_id,
      r.exam_id,
      r.marks,
      r.remarks,

      s.student_code,
      s.first_name AS student_first_name,
      s.last_name AS student_last_name,

      sub.name AS subject_name,

      e.name AS exam_name,
      e.exam_type,
      e.exam_date,
      e.academic_year

    FROM results r

    LEFT JOIN students s
      ON r.student_id = s.id

    LEFT JOIN subjects sub
      ON r.subject_id = sub.id

    LEFT JOIN exams e
      ON r.exam_id = e.id

    WHERE r.id = ?
  `;

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
    remarks,
  } = req.body;

  // Validate required fields
  if (
    !student_id ||
    !subject_id ||
    !exam_id ||
    marks === undefined ||
    marks === null
  ) {
    return res.status(400).json({
      message:
        "student_id, subject_id, exam_id and marks are required",
    });
  }

  // Validate marks
  if (Number(marks) < 0 || Number(marks) > 100) {
    return res.status(400).json({
      message: "Marks must be between 0 and 100",
    });
  }

  // Check duplicate result
  const checkSql = `
    SELECT id
    FROM results
    WHERE student_id = ?
      AND subject_id = ?
      AND exam_id = ?
  `;

  db.query(
    checkSql,
    [student_id, subject_id, exam_id],
    (checkErr, existingResults) => {
      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Failed to check existing result",
          error: checkErr.message,
        });
      }

      if (existingResults.length > 0) {
        return res.status(409).json({
          message:
            "Result already exists for this student, subject and exam",
        });
      }

      const sql = `
        INSERT INTO results
        (
          student_id,
          subject_id,
          exam_id,
          marks,
          remarks
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        student_id,
        subject_id,
        exam_id,
        marks,
        remarks || null,
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
    }
  );
};


// Update result
const updateResult = (req, res) => {
  const { id } = req.params;

  const {
    student_id,
    subject_id,
    exam_id,
    marks,
    remarks,
  } = req.body;

  if (
    !student_id ||
    !subject_id ||
    !exam_id ||
    marks === undefined ||
    marks === null
  ) {
    return res.status(400).json({
      message:
        "student_id, subject_id, exam_id and marks are required",
    });
  }

  // Validate marks
  if (Number(marks) < 0 || Number(marks) > 100) {
    return res.status(400).json({
      message: "Marks must be between 0 and 100",
    });
  }

  // Check duplicate result excluding current result
  const checkSql = `
    SELECT id
    FROM results
    WHERE student_id = ?
      AND subject_id = ?
      AND exam_id = ?
      AND id != ?
  `;

  db.query(
    checkSql,
    [student_id, subject_id, exam_id, id],
    (checkErr, existingResults) => {
      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Failed to check existing result",
          error: checkErr.message,
        });
      }

      if (existingResults.length > 0) {
        return res.status(409).json({
          message:
            "Another result already exists for this student, subject and exam",
        });
      }

      const sql = `
        UPDATE results
        SET
          student_id = ?,
          subject_id = ?,
          exam_id = ?,
          marks = ?,
          remarks = ?
        WHERE id = ?
      `;

      const values = [
        student_id,
        subject_id,
        exam_id,
        marks,
        remarks || null,
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
    }
  );
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
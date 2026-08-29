const db = require("../config/db");

// Get all attendance records
const getAttendance = (req, res) => {
  const sql = "SELECT * FROM attendance ORDER BY date DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch attendance",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one attendance record by ID
const getAttendanceById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM attendance WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch attendance",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create attendance
const createAttendance = (req, res) => {
  const {
    student_id,
    date,
    status,
    remarks,
  } = req.body;

  const sql = `
    INSERT INTO attendance
    (
      student_id,
      date,
      status,
      remarks
    )
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    student_id,
    date,
    status,
    remarks,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create attendance",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Attendance created successfully",
      attendance_id: result.insertId,
    });
  });
};

// Update attendance
const updateAttendance = (req, res) => {
  const { id } = req.params;

  const {
    student_id,
    date,
    status,
    remarks,
  } = req.body;

  const sql = `
    UPDATE attendance
    SET
      student_id = ?,
      date = ?,
      status = ?,
      remarks = ?
    WHERE id = ?
  `;

  const values = [
    student_id,
    date,
    status,
    remarks,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update attendance",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
    });
  });
};

// Delete attendance
const deleteAttendance = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM attendance WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete attendance",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  });
};

module.exports = {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
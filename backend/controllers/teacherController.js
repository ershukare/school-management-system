const db = require("../config/db");

// Get all teachers
const getTeachers = (req, res) => {
  const sql = "SELECT * FROM teachers";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch teachers",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one teacher by ID
const getTeacherById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM teachers WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch teacher",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create a new teacher
const createTeacher = (req, res) => {
  const {
    user_id,
    teacher_code,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
  } = req.body;

  const sql = `
    INSERT INTO teachers
    (
      user_id,
      teacher_code,
      phone,
      gender,
      date_of_birth,
      address,
      hire_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id,
    teacher_code,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create teacher",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Teacher created successfully",
      teacher_id: result.insertId,
    });
  });
};

// Update teacher
const updateTeacher = (req, res) => {
  const { id } = req.params;

  const {
    user_id,
    teacher_code,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
  } = req.body;

  const sql = `
    UPDATE teachers
    SET
      user_id = ?,
      teacher_code = ?,
      phone = ?,
      gender = ?,
      date_of_birth = ?,
      address = ?,
      hire_date = ?
    WHERE id = ?
  `;

  const values = [
    user_id,
    teacher_code,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update teacher",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      message: "Teacher updated successfully",
    });
  });
};

// Delete teacher
const deleteTeacher = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM teachers WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete teacher",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  });
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
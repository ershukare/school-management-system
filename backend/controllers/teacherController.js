const db = require("../config/db");

// =========================
// GET ALL TEACHERS
// =========================
const getTeachers = (req, res) => {
  const sql = `
    SELECT
      id,
      user_id,
      teacher_code,
      first_name,
      last_name,
      phone,
      gender,
      date_of_birth,
      address,
      hire_date,
      created_at
    FROM teachers
    ORDER BY id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET TEACHERS ERROR:", err);

      return res.status(500).json({
        message: "Failed to fetch teachers",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// =========================
// GET ONE TEACHER
// =========================
const getTeacherById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      id,
      user_id,
      teacher_code,
      first_name,
      last_name,
      phone,
      gender,
      date_of_birth,
      address,
      hire_date,
      created_at
    FROM teachers
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("GET ONE TEACHER ERROR:", err);

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

// =========================
// CREATE TEACHER
// =========================
const createTeacher = (req, res) => {
  console.log("CREATE TEACHER BODY:", req.body);

  const {
    user_id,
    teacher_code,
    first_name,
    last_name,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
  } = req.body;

  if (!teacher_code) {
    return res.status(400).json({
      message: "Teacher code is required",
    });
  }

  if (!first_name) {
    return res.status(400).json({
      message: "First name is required",
    });
  }

  if (!last_name) {
    return res.status(400).json({
      message: "Last name is required",
    });
  }

  const sql = `
    INSERT INTO teachers
    (
      user_id,
      teacher_code,
      first_name,
      last_name,
      phone,
      gender,
      date_of_birth,
      address,
      hire_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id || null,
    teacher_code,
    first_name,
    last_name,
    phone || null,
    gender || null,
    date_of_birth || null,
    address || null,
    hire_date || null,
  ];

  console.log("INSERT VALUES:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("CREATE TEACHER ERROR:", err);

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

// =========================
// UPDATE TEACHER
// =========================
const updateTeacher = (req, res) => {
  const { id } = req.params;

  console.log("UPDATE TEACHER BODY:", req.body);

  const {
    user_id,
    teacher_code,
    first_name,
    last_name,
    phone,
    gender,
    date_of_birth,
    address,
    hire_date,
  } = req.body;

  if (!teacher_code) {
    return res.status(400).json({
      message: "Teacher code is required",
    });
  }

  if (!first_name) {
    return res.status(400).json({
      message: "First name is required",
    });
  }

  if (!last_name) {
    return res.status(400).json({
      message: "Last name is required",
    });
  }

  const sql = `
    UPDATE teachers
    SET
      user_id = ?,
      teacher_code = ?,
      first_name = ?,
      last_name = ?,
      phone = ?,
      gender = ?,
      date_of_birth = ?,
      address = ?,
      hire_date = ?
    WHERE id = ?
  `;

  const values = [
    user_id || null,
    teacher_code,
    first_name,
    last_name,
    phone || null,
    gender || null,
    date_of_birth || null,
    address || null,
    hire_date || null,
    id,
  ];

  console.log("UPDATE VALUES:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("UPDATE TEACHER ERROR:", err);

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

// =========================
// DELETE TEACHER
// =========================
const deleteTeacher = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM teachers
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DELETE TEACHER ERROR:", err);

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

// =========================
// EXPORT
// =========================
module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
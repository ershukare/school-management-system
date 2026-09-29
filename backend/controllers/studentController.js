const db = require("../config/db");

// Get all students
const getStudents = (req, res) => {
  const sql = `
    SELECT 
      students.id,
      students.student_code,
      students.first_name,
      students.last_name,
      students.gender,
      students.date_of_birth,
      students.phone,
      students.address,
      students.admission_date,
      classes.name AS class_name,
      students.class_id,
      classes.section
      
    FROM students
    LEFT JOIN classes ON students.class_id = classes.id
    ORDER BY students.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch students",
      });
    }

    res.status(200).json(results);
  });
};


// Create a new student
const createStudent = (req, res) => {
  const {
    student_code,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    address,
    class_id,
    admission_date,
  } = req.body;

  const sql = `
    INSERT INTO students
    (
      student_code,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      address,
      class_id,
      admission_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_code,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    address,
    class_id,
    admission_date,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create student",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Student created successfully",
      student_id: result.insertId,
    });
  });
};


// Update a student
const updateStudent = (req, res) => {
  const { id } = req.params;

  const {
    student_code,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    address,
    class_id,
    admission_date,
  } = req.body;

  const sql = `
    UPDATE students
    SET
      student_code = ?,
      first_name = ?,
      last_name = ?,
      gender = ?,
      date_of_birth = ?,
      phone = ?,
      address = ?,
      class_id = ?,
      admission_date = ?
    WHERE id = ?
  `;

  const values = [
    student_code,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    address,
    class_id,
    admission_date,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update student",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
    });
  });
};

// Delete a student
const deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete student",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  });
};

// Export functions
module.exports = {
  getStudents,
  createStudent,
  updateStudent,
 deleteStudent,
};
const db = require("../config/db");

// Get all fees
const getFees = (req, res) => {
  const sql = "SELECT * FROM fees ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch fees",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// Get one fee by ID
const getFeeById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM fees WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch fee",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Fee not found",
      });
    }

    res.status(200).json(results[0]);
  });
};

// Get fee summary for one student
const getStudentFeeSummary = (req, res) => {
  const { student_id } = req.params;

  const sql = `
    SELECT
      student_id,
      COUNT(*) AS payment_records,
      COUNT(
        DISTINCT CONCAT(
          COALESCE(payment_year, ''),
          '-',
          COALESCE(payment_month, '')
        )
      ) AS months_paid,
      COALESCE(SUM(amount), 0) AS total_amount,
      COALESCE(SUM(paid_amount), 0) AS total_paid,
      COALESCE(SUM(amount - paid_amount), 0) AS total_balance
    FROM fees
    WHERE student_id = ?
    GROUP BY student_id
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch student fee summary",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        student_id: Number(student_id),
        payment_records: 0,
        months_paid: 0,
        total_amount: 0,
        total_paid: 0,
        total_balance: 0,
      });
    }

    res.status(200).json(results[0]);
  });
};

// Create fee
const createFee = (req, res) => {
  const {
    student_id,
    amount,
    paid_amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method,
    status,
    description,
  } = req.body;

  const sql = `
    INSERT INTO fees
    (
      student_id,
      amount,
      paid_amount,
      payment_date,
      payment_month,
      payment_year,
      payment_method,
      status,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    amount,
    paid_amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method,
    status,
    description,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to create fee",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Fee created successfully",
      fee_id: result.insertId,
    });
  });
};

// Update fee
const updateFee = (req, res) => {
  const { id } = req.params;

  const {
    student_id,
    amount,
    paid_amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method,
    status,
    description,
  } = req.body;

  const sql = `
    UPDATE fees
    SET
      student_id = ?,
      amount = ?,
      paid_amount = ?,
      payment_date = ?,
      payment_month = ?,
      payment_year = ?,
      payment_method = ?,
      status = ?,
      description = ?
    WHERE id = ?
  `;

  const values = [
    student_id,
    amount,
    paid_amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method,
    status,
    description,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to update fee",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Fee not found",
      });
    }

    res.status(200).json({
      message: "Fee updated successfully",
    });
  });
};

// Delete fee
const deleteFee = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM fees WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to delete fee",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Fee not found",
      });
    }

    res.status(200).json({
      message: "Fee deleted successfully",
    });
  });
};

module.exports = {
  getFees,
  getFeeById,
  getStudentFeeSummary,
  createFee,
  updateFee,
  deleteFee,
};
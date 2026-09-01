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

// Create fee
const createFee = (req, res) => {
  const {
    student_id,
    amount,
    paid_amount,
    payment_date,
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
      payment_method,
      status,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    amount,
    paid_amount,
    payment_date,
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
  createFee,
  updateFee,
  deleteFee,
};
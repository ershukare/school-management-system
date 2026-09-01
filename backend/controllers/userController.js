const db = require("../config/db");
const bcrypt = require("bcryptjs");

// GET all users
const getUsers = (req, res) => {
  const sql = "SELECT id, name, email, role, created_at FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch users",
        error: err.message,
      });
    }

    res.json(results);
  });
};

// GET user by ID
const getUserById = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch user",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(results[0]);
  });
};

// CREATE user
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Name, email, password and role are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(
      sql,
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to create user",
            error: err.message,
          });
        }

        res.status(201).json({
          message: "User created successfully",
          user_id: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Failed to hash password",
      error: error.message,
    });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Name, email, password and role are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?";

    db.query(
      sql,
      [name, email, hashedPassword, role, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update user",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.json({
          message: "User updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Failed to hash password",
      error: error.message,
    });
  }
};

// DELETE user
const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete user",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
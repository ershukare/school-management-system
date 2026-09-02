const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get users - authenticated users
router.get("/", authMiddleware, getUsers);

router.get("/:id", authMiddleware, getUserById);

// Create user - Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), createUser);

// Update user - Admin only
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUser);

// Delete user - Admin only
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

module.exports = router;
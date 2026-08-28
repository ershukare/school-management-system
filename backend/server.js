const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "School Management System API is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
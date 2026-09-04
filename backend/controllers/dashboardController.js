const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const queries = [
      "SELECT COUNT(*) AS total FROM students",
      "SELECT COUNT(*) AS total FROM teachers",
      "SELECT COUNT(*) AS total FROM classes",
      "SELECT COUNT(*) AS total FROM subjects",
      "SELECT COUNT(*) AS total FROM attendance",
      "SELECT COUNT(*) AS total FROM exams",
      "SELECT COUNT(*) AS total FROM results",
      "SELECT COUNT(*) AS total FROM fees",
      "SELECT COUNT(*) AS total FROM notices",
      "SELECT COUNT(*) AS total FROM users",
    ];

    const results = await Promise.all(
      queries.map(
        (sql) =>
          new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result[0].total);
              }
            });
          })
      )
    );

    res.json({
      students: results[0],
      teachers: results[1],
      classes: results[2],
      subjects: results[3],
      attendance: results[4],
      exams: results[5],
      results: results[6],
      fees: results[7],
      notices: results[8],
      users: results[9],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
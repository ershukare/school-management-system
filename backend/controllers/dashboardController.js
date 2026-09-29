const db = require("../config/db");

const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getDashboardStats = async (req, res) => {
  try {
    // ==========================================
    // 1. BASIC SCHOOL STATISTICS
    // ==========================================

    const basicStats = await Promise.all([
      query("SELECT COUNT(*) AS total FROM students"),
      query("SELECT COUNT(*) AS total FROM teachers"),
      query("SELECT COUNT(*) AS total FROM classes"),
      query("SELECT COUNT(*) AS total FROM subjects"),
      query("SELECT COUNT(*) AS total FROM attendance"),
      query("SELECT COUNT(*) AS total FROM exams"),
      query("SELECT COUNT(*) AS total FROM results"),
      query("SELECT COUNT(*) AS total FROM fees"),
      query("SELECT COUNT(*) AS total FROM notices"),
      query("SELECT COUNT(*) AS total FROM users"),
    ]);

    // ==========================================
    // 2. STUDENT STATISTICS
    // ==========================================

    const studentGender = await query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female
      FROM students
    `);

    // ==========================================
    // 3. OVERALL ACADEMIC PERFORMANCE
    // ==========================================

    const overallPerformance = await query(`
      SELECT
        COALESCE(AVG(marks), 0) AS school_average,

        SUM(
          CASE
            WHEN marks >= 50 THEN 1
            ELSE 0
          END
        ) AS passed,

        SUM(
          CASE
            WHEN marks < 50 THEN 1
            ELSE 0
          END
        ) AS failed,

        COUNT(*) AS total_results
      FROM results
    `);

    const overall = overallPerformance[0];

    const passRate =
      Number(overall.total_results) > 0
        ? (Number(overall.passed) / Number(overall.total_results)) * 100
        : 0;

    const failRate =
      Number(overall.total_results) > 0
        ? (Number(overall.failed) / Number(overall.total_results)) * 100
        : 0;

    // ==========================================
    // 4. TOP 3 STUDENTS
    // ==========================================

    const topStudents = await query(`
      SELECT
        s.id AS student_id,
        s.student_code,
        s.first_name,
        s.last_name,
        c.name AS class_name,
        c.section AS class_section,

        SUM(r.marks) AS total,
        AVG(r.marks) AS average,

        RANK() OVER (
          ORDER BY AVG(r.marks) DESC
        ) AS rank_position

      FROM results r

      INNER JOIN students s
        ON r.student_id = s.id

      LEFT JOIN classes c
        ON s.class_id = c.id

      GROUP BY
        s.id,
        s.student_code,
        s.first_name,
        s.last_name,
        c.name,
        c.section

      ORDER BY average DESC

      LIMIT 3
    `);

    // ==========================================
    // 5. FAILED STUDENTS
    // ==========================================

    const failedStudents = await query(`
      SELECT
        s.id AS student_id,
        s.student_code,
        s.first_name,
        s.last_name,
        c.name AS class_name,
        c.section AS class_section,

        SUM(r.marks) AS total,
        AVG(r.marks) AS average

      FROM results r

      INNER JOIN students s
        ON r.student_id = s.id

      LEFT JOIN classes c
        ON s.class_id = c.id

      GROUP BY
        s.id,
        s.student_code,
        s.first_name,
        s.last_name,
        c.name,
        c.section

      HAVING AVG(r.marks) < 50

      ORDER BY average ASC
    `);

    // ==========================================
    // 6. CLASS PERFORMANCE
    // ==========================================

    const classPerformance = await query(`
      SELECT
        c.id AS class_id,
        c.name AS class_name,
        c.section AS class_section,

        COUNT(DISTINCT r.student_id) AS students,

        AVG(r.marks) AS average,

        SUM(
          CASE
            WHEN r.marks >= 50 THEN 1
            ELSE 0
          END
        ) AS passed,

        SUM(
          CASE
            WHEN r.marks < 50 THEN 1
            ELSE 0
          END
        ) AS failed

      FROM results r

      INNER JOIN students s
        ON r.student_id = s.id

      INNER JOIN classes c
        ON s.class_id = c.id

      GROUP BY
        c.id,
        c.name,
        c.section

      ORDER BY average DESC
    `);

    // ==========================================
    // 7. SUBJECT PERFORMANCE
    // ==========================================

    const subjectPerformance = await query(`
      SELECT
        sub.id AS subject_id,
        sub.name AS subject_name,

        COUNT(*) AS total_results,

        AVG(r.marks) AS average,

        SUM(
          CASE
            WHEN r.marks >= 50 THEN 1
            ELSE 0
          END
        ) AS passed,

        SUM(
          CASE
            WHEN r.marks < 50 THEN 1
            ELSE 0
          END
        ) AS failed

      FROM results r

      INNER JOIN subjects sub
        ON r.subject_id = sub.id

      GROUP BY
        sub.id,
        sub.name

      ORDER BY average DESC
    `);

    // ==========================================
    // 8. EXAM PERFORMANCE
    // ==========================================

    const examPerformance = await query(`
      SELECT
        e.id AS exam_id,
        e.name AS exam_name,
        e.exam_type,

        COUNT(*) AS total_results,

        AVG(r.marks) AS average,

        SUM(
          CASE
            WHEN r.marks >= 50 THEN 1
            ELSE 0
          END
        ) AS passed,

        SUM(
          CASE
            WHEN r.marks < 50 THEN 1
            ELSE 0
          END
        ) AS failed

      FROM results r

      INNER JOIN exams e
        ON r.exam_id = e.id

      GROUP BY
        e.id,
        e.name,
        e.exam_type

      ORDER BY e.exam_date DESC
    `);

    // ==========================================
    // 9. PERFORMANCE BY GENDER
    // ==========================================

    const genderPerformance = await query(`
      SELECT
        s.gender,

        COUNT(DISTINCT s.id) AS students,

        AVG(r.marks) AS average,

        SUM(
          CASE
            WHEN r.marks >= 50 THEN 1
            ELSE 0
          END
        ) AS passed,

        SUM(
          CASE
            WHEN r.marks < 50 THEN 1
            ELSE 0
          END
        ) AS failed

      FROM results r

      INNER JOIN students s
        ON r.student_id = s.id

      GROUP BY s.gender
    `);

    // ==========================================
    // 10. PERFORMANCE BY CLASS
    // ==========================================

    const classTrend = await query(`
      SELECT
        c.name AS class_name,
        c.section AS class_section,
        AVG(r.marks) AS average

      FROM results r

      INNER JOIN students s
        ON r.student_id = s.id

      INNER JOIN classes c
        ON s.class_id = c.id

      GROUP BY
        c.id,
        c.name,
        c.section

      ORDER BY average DESC
    `);

    // ==========================================
    // 11. PERFORMANCE BY SUBJECT
    // ==========================================

    const subjectTrend = await query(`
      SELECT
        sub.name AS subject_name,
        AVG(r.marks) AS average

      FROM results r

      INNER JOIN subjects sub
        ON r.subject_id = sub.id

      GROUP BY
        sub.id,
        sub.name

      ORDER BY average DESC
    `);

    // ==========================================
    // 12. PERFORMANCE BY EXAM
    // ==========================================

    const examTrend = await query(`
      SELECT
        e.id AS exam_id,
        e.name AS exam_name,
        e.exam_type,
        AVG(r.marks) AS average

      FROM results r

      INNER JOIN exams e
        ON r.exam_id = e.id

      GROUP BY
        e.id,
        e.name,
        e.exam_type

      ORDER BY e.exam_date ASC
    `);

    // ==========================================
    // 13. FINAL RESPONSE
    // ==========================================

    res.status(200).json({
      // Basic statistics
      students: basicStats[0][0].total,
      teachers: basicStats[1][0].total,
      classes: basicStats[2][0].total,
      subjects: basicStats[3][0].total,
      attendance: basicStats[4][0].total,
      exams: basicStats[5][0].total,
      results: basicStats[6][0].total,
      fees: basicStats[7][0].total,
      notices: basicStats[8][0].total,
      users: basicStats[9][0].total,

      // Student statistics
      studentStatistics: {
        total: Number(studentGender[0].total) || 0,
        male: Number(studentGender[0].male) || 0,
        female: Number(studentGender[0].female) || 0,
      },

      // Overall academic performance
      overallAcademicPerformance: {
        schoolAverage: Number(overall.school_average) || 0,
        passed: Number(overall.passed) || 0,
        failed: Number(overall.failed) || 0,
        passRate: Number(passRate.toFixed(2)),
        failRate: Number(failRate.toFixed(2)),
      },

      // Student performance
      studentPerformance: {
        top3: topStudents,
        failedStudents,
      },

      // Class performance
      classPerformance,

      // Subject performance
      subjectPerformance,

      // Exam performance
      examPerformance,

      // Gender performance
      genderPerformance,

      // Trends
      performanceTrends: {
        byExam: examTrend,
        byClass: classTrend,
        bySubject: subjectTrend,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
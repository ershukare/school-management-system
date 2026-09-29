import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./TeacherDashboard.css";

function TeacherDashboard() {
  const { t } = useTranslation();

  const [notifications] = useState([
    {
      id: 1,
      title: "exam",
      message: "examMessage",
      read: false,
    },
    {
      id: 2,
      title: "meeting",
      message: "meetingMessage",
      read: false,
    },
    {
      id: 3,
      title: "timetable",
      message: "timetableMessage",
      read: true,
    },
  ]);

  const schedule = [
    {
      period: 1,
      time: "8:00 - 8:45",
      className: "Grade 9A",
      subject: "Mathematics",
    },
    {
      period: 2,
      time: "8:50 - 9:35",
      className: "FREE",
      subject: "-",
    },
    {
      period: 3,
      time: "9:40 - 10:25",
      className: "Grade 10B",
      subject: "Mathematics",
    },
    {
      period: 4,
      time: "10:30 - 11:15",
      className: "Grade 9A",
      subject: "Mathematics",
    },
    {
      period: 5,
      time: "11:20 - 12:05",
      className: "FREE",
      subject: "-",
    },
    {
      period: 6,
      time: "12:10 - 12:55",
      className: "Grade 10B",
      subject: "Mathematics",
    },
  ];

  return (
    <div className="teacher-dashboard">

      {/* WELCOME */}
      <section className="teacher-welcome">
        <div>
          <p className="welcome-label">
            {t("teacherDashboard.dashboardTitle")}
          </p>

          <h2>
            {t("teacherDashboard.welcome")}
          </h2>

          <p>
            {t("teacherDashboard.welcomeDescription")}
          </p>
        </div>

        <div className="teacher-profile-mini">
          <div className="teacher-avatar">T</div>

          <div>
            <strong>
              {t("teacherDashboard.teacher")}
            </strong>

            <span>
              {t("teacherDashboard.mathematicsTeacher")}
            </span>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="teacher-summary-grid">

        <div className="teacher-stat-card">
          <span>{t("teacherDashboard.myClasses")}</span>
          <strong>2</strong>
        </div>

        <div className="teacher-stat-card">
          <span>{t("teacherDashboard.mySubjects")}</span>
          <strong>1</strong>
        </div>

        <div className="teacher-stat-card">
          <span>{t("teacherDashboard.myStudents")}</span>
          <strong>45</strong>
        </div>

        <div className="teacher-stat-card">
          <span>
            {t("teacherDashboard.unreadNotifications")}
          </span>

          <strong>
            {
              notifications.filter(
                (item) => !item.read
              ).length
            }
          </strong>
        </div>

      </section>

      {/* TODAY'S SCHEDULE */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h3>
              {t("teacherDashboard.todaysSchedule")}
            </h3>

            <p>
              {t("teacherDashboard.scheduleDescription")}
            </p>
          </div>
        </div>

        <div className="schedule-table-wrapper">
          <table className="schedule-table">

            <thead>
              <tr>
                <th>{t("teacherDashboard.period")}</th>
                <th>{t("teacherDashboard.time")}</th>
                <th>{t("teacherDashboard.class")}</th>
                <th>{t("teacherDashboard.subject")}</th>
              </tr>
            </thead>

            <tbody>
              {schedule.map((item) => (
                <tr
                  key={item.period}
                  className={
                    item.className === "FREE"
                      ? "free-period"
                      : ""
                  }
                >
                  <td>
                    {t("teacherDashboard.period")} {item.period}
                  </td>

                  <td>{item.time}</td>

                  <td>
                    {item.className === "FREE"
                      ? t("teacherDashboard.free")
                      : item.className}
                  </td>

                  <td>{item.subject}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>

      {/* MY STUDENTS */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h3>
              {t("teacherDashboard.myStudents")}
            </h3>

            <p>
              {t("teacherDashboard.studentsDescription")}
            </p>
          </div>
        </div>

        <div className="student-summary-grid">

          <div className="student-summary-card">
            <span>
              {t("teacherDashboard.maleStudents")}
            </span>
            <strong>24</strong>
          </div>

          <div className="student-summary-card">
            <span>
              {t("teacherDashboard.femaleStudents")}
            </span>
            <strong>21</strong>
          </div>

          <div className="student-summary-card">
            <span>
              {t("teacherDashboard.totalStudents")}
            </span>
            <strong>45</strong>
          </div>

        </div>

      </section>

      {/* STUDENT PERFORMANCE */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h3>
              {t("teacherDashboard.studentPerformance")}
            </h3>

            <p>
              {t("teacherDashboard.performanceDescription")}
            </p>
          </div>
        </div>

        <div className="performance-grid">

          <div className="performance-card">
            <h4>
              {t("teacherDashboard.topPerformingStudents")}
            </h4>

            <p>
              {t("teacherDashboard.topPerformingDescription")}
            </p>

            <strong>
              8 {t("teacherDashboard.students")}
            </strong>
          </div>

          <div className="performance-card warning">
            <h4>
              {t("teacherDashboard.belowPassMark")}
            </h4>

            <p>
              {t("teacherDashboard.belowPassDescription")}
            </p>

            <strong>
              5 {t("teacherDashboard.students")}
            </strong>
          </div>

          <div className="performance-card danger">
            <h4>
              {t("teacherDashboard.frequentAbsence")}
            </h4>

            <p>
              {t("teacherDashboard.frequentAbsenceDescription")}
            </p>

            <strong>
              4 {t("teacherDashboard.students")}
            </strong>
          </div>

          <div className="performance-card">
            <h4>
              {t("teacherDashboard.frequentlyLate")}
            </h4>

            <p>
              {t("teacherDashboard.frequentlyLateDescription")}
            </p>

            <strong>
              3 {t("teacherDashboard.students")}
            </strong>
          </div>

        </div>

      </section>

      {/* NOTIFICATIONS */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h3>
              {t("teacherDashboard.notifications")}
            </h3>

            <p>
              {t("teacherDashboard.notificationsDescription")}
            </p>
          </div>
        </div>

        <div className="notification-list">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                !notification.read ? "unread" : ""
              }`}
            >
              <div className="notification-icon">
                🔔
              </div>

              <div className="notification-content">

                <h4>
                  {t(
                    `teacherDashboard.notification.${notification.title}`
                  )}
                </h4>

                <p>
                  {t(
                    `teacherDashboard.notification.${notification.message}`
                  )}
                </p>

              </div>

              {!notification.read && (
                <span className="unread-badge">
                  {t("teacherDashboard.new")}
                </span>
              )}

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default TeacherDashboard;
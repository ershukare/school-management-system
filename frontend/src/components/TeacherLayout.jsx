import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function TeacherLayout({ children }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2>
          {t("teacherDashboard.schoolName")}
        </h2>

        <nav>

          <Link to="/teacher-dashboard">
            {t("teacherDashboard.dashboard")}
          </Link>

          <button type="button">
            {t("teacherDashboard.myClasses")}
          </button>

          <button type="button">
            {t("teacherDashboard.mySubjects")}
          </button>

          <button type="button">
            {t("teacherDashboard.attendance")}
          </button>

          <button type="button">
            {t("teacherDashboard.exams")}
          </button>

          <button type="button">
            {t("teacherDashboard.results")}
          </button>

          <button type="button">
            {t("teacherDashboard.notifications")}
          </button>

          <button type="button">
            {t("teacherDashboard.myProfile")}
          </button>

          <button type="button">
            {t("teacherDashboard.settings")}
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            {t("teacherDashboard.logout")}
          </button>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <header>

          <h1>
            {t("teacherDashboard.dashboardTitle")}
          </h1>

          <div>

            <button
              type="button"
              onClick={() => changeLanguage("om")}
            >
              Afaan Oromoo
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("en")}
            >
              English
            </button>

          </div>

        </header>

        <main>
          {children}
        </main>

      </div>

    </div>
  );
}

export default TeacherLayout;
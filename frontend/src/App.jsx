import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Students from "./pages/Students";

function Dashboard() {
  const { t, i18n } = useTranslation();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
    attendance: 0,
    exams: 0,
    results: 0,
    fees: 0,
    notices: 0,
    users: 0,
  });

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Dashboard data error:", error);
      });
  }, []);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>{t("app.name")}</h2>

        <nav>
          <Link to="/">{t("app.dashboard")}</Link>

          <Link to="/students">{t("app.students")}</Link>

          <button>{t("app.teachers")}</button>
          <button>{t("app.classes")}</button>
          <button>{t("app.subjects")}</button>
          <button>{t("app.attendance")}</button>
          <button>{t("app.exams")}</button>
          <button>{t("app.results")}</button>
          <button>{t("app.fees")}</button>
          <button>{t("app.notices")}</button>
          <button>{t("app.users")}</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">

        {/* Header */}
        <header>
          <h1>{t("app.dashboard")}</h1>

          <div>
            <button onClick={() => changeLanguage("om")}>
              Afaan Oromoo
            </button>

            <button onClick={() => changeLanguage("en")}>
              English
            </button>
          </div>
        </header>

        {/* Dashboard */}
        <main>
          <div className="dashboard-grid">

            <div className="card">
              <h3>{t("app.students")}</h3>
              <p>{stats.students}</p>
            </div>

            <div className="card">
              <h3>{t("app.teachers")}</h3>
              <p>{stats.teachers}</p>
            </div>

            <div className="card">
              <h3>{t("app.classes")}</h3>
              <p>{stats.classes}</p>
            </div>

            <div className="card">
              <h3>{t("app.subjects")}</h3>
              <p>{stats.subjects}</p>
            </div>

            <div className="card">
              <h3>{t("app.attendance")}</h3>
              <p>{stats.attendance}</p>
            </div>

            <div className="card">
              <h3>{t("app.exams")}</h3>
              <p>{stats.exams}</p>
            </div>

            <div className="card">
              <h3>{t("app.results")}</h3>
              <p>{stats.results}</p>
            </div>

            <div className="card">
              <h3>{t("app.fees")}</h3>
              <p>{stats.fees}</p>
            </div>

            <div className="card">
              <h3>{t("app.notices")}</h3>
              <p>{stats.notices}</p>
            </div>

            <div className="card">
              <h3>{t("app.users")}</h3>
              <p>{stats.users}</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import "./App.css";

import { useTranslation } from "react-i18next";

import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Login from "./pages/Login";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import TeacherDashboard from "./pages/TeacherDashboard";

/* =========================================================
   ADMIN LAYOUT
========================================================= */

function Layout({ children }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const getPageTitle = () => {
    if (location.pathname === "/students") {
      return t("app.students");
    }

    if (location.pathname === "/teachers") {
      return t("app.teachers");
    }

    if (location.pathname === "/classes") {
      return t("app.classes");
    }

    if (location.pathname === "/subjects") {
      return t("app.subjects");
    }

    if (location.pathname === "/attendance") {
      return t("app.attendance");
    }

    if (location.pathname === "/exams") {
      return t("app.exams");
    }

    if (location.pathname === "/results") {
      return t("app.results");
    }

    return t("app.dashboard");
  };

  return (
    <div className="app">

      {/* ADMIN SIDEBAR */}

      <aside className="sidebar">

        <h2>
          {t("app.name")}
        </h2>

        <nav>

          <Link to="/">
            {t("app.dashboard")}
          </Link>

          <Link to="/students">
            {t("app.students")}
          </Link>

          <Link to="/teachers">
            {t("app.teachers")}
          </Link>

          <Link to="/classes">
            {t("app.classes")}
          </Link>

          <Link to="/subjects">
            {t("app.subjects")}
          </Link>

          <Link to="/attendance">
            {t("app.attendance")}
          </Link>

          <Link to="/exams">
            {t("app.exams")}
          </Link>

          <Link to="/results">
            {t("app.results")}
          </Link>

          <button type="button">
            {t("app.fees")}
          </button>

          <button type="button">
            {t("app.notices")}
          </button>

          <button type="button">
            {t("app.users")}
          </button>

        </nav>

      </aside>

      {/* ADMIN MAIN CONTENT */}

      <div className="main-content">

        <header>

          <h1>
            {getPageTitle()}
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


/* =========================================================
   TEACHER LAYOUT
========================================================= */

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

      {/* TEACHER SIDEBAR */}

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


      {/* TEACHER MAIN CONTENT */}

      <div className="main-content">

        <header>

          <h1>
            {t("teacherDashboard.dashboardTitle")}
          </h1>

          {/* LANGUAGE SWITCHER */}

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


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function Dashboard() {
  const { t } = useTranslation();

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

  useEffect(() => {

    fetch("http://localhost:5000/api/dashboard")

      .then((response) => response.json())

      .then((data) => {
        setStats(data);
      })

      .catch((error) => {
        console.error(
          "Dashboard data error:",
          error
        );
      });

  }, []);

  return (
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
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ADMIN DASHBOARD */}

        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />


        {/* TEACHER DASHBOARD */}

        <Route
          path="/teacher-dashboard"
          element={
            <TeacherLayout>
              <TeacherDashboard />
            </TeacherLayout>
          }
        />


        {/* ADMIN STUDENTS */}

        <Route
          path="/students"
          element={
            <Layout>
              <Students />
            </Layout>
          }
        />


        {/* ADMIN TEACHERS */}

        <Route
          path="/teachers"
          element={
            <Layout>
              <Teachers />
            </Layout>
          }
        />


        {/* ADMIN CLASSES */}

        <Route
          path="/classes"
          element={
            <Layout>
              <Classes />
            </Layout>
          }
        />


        {/* ADMIN SUBJECTS */}

        <Route
          path="/subjects"
          element={
            <Layout>
              <Subjects />
            </Layout>
          }
        />


        {/* ADMIN ATTENDANCE */}

        <Route
          path="/attendance"
          element={
            <Layout>
              <Attendance />
            </Layout>
          }
        />


        {/* ADMIN EXAMS */}

        <Route
          path="/exams"
          element={
            <Layout>
              <Exams />
            </Layout>
          }
        />


        {/* ADMIN RESULTS */}

        <Route
          path="/results"
          element={
            <Layout>
              <Results />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
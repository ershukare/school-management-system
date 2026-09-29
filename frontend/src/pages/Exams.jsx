import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Exams() {
  const { t, i18n } = useTranslation();

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [examsResponse, classesResponse, subjectsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/exams"),
            fetch("http://localhost:5000/api/classes"),
            fetch("http://localhost:5000/api/subjects"),
          ]);

        const examsData = await examsResponse.json();
        const classesData = await classesResponse.json();
        const subjectsData = await subjectsResponse.json();

        if (!examsResponse.ok) {
          throw new Error(
            examsData.message || t("exam.loadError")
          );
        }

        if (!classesResponse.ok) {
          throw new Error(
            classesData.message || t("exam.classLoadError")
          );
        }

        if (!subjectsResponse.ok) {
          throw new Error(
            subjectsData.message || t("exam.subjectLoadError")
          );
        }

        if (!cancelled) {
          setExams(examsData);
          setClasses(classesData);
          setSubjects(subjectsData);
        }
      } catch (error) {
        console.error("Load exams data error:", error);

        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [t]);

  // =========================
  // Display Class Name
  // =========================
  const displayClassName = (classItem) => {
    if (
      i18n.language === "om" &&
      classItem.name?.startsWith("Grade ")
    ) {
      const number = classItem.name.replace("Grade ", "");

      return `Kutaa ${number} - ${classItem.section}`;
    }

    return `${classItem.name} - ${classItem.section}`;
  };

  // =========================
  // Get Class Name
  // =========================
  const getClassName = (classId) => {
    const classItem = classes.find(
      (item) => String(item.id) === String(classId)
    );

    return classItem
      ? displayClassName(classItem)
      : "-";
  };

  // =========================
  // Get Subject Name
  // =========================
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(
      (item) => String(item.id) === String(subjectId)
    );

    return subject ? subject.name : "-";
  };

  // =========================
  // Get Teacher Name
  // =========================
  const getTeacherName = (exam) => {
    if (
      !exam.teacher_first_name &&
      !exam.teacher_last_name
    ) {
      return "-";
    }

    const firstName = exam.teacher_first_name || "";
    const lastName = exam.teacher_last_name || "";

    const fullName = `${firstName} ${lastName}`.trim();

    if (exam.teacher_code) {
      return `${fullName} (${exam.teacher_code})`;
    }

    return fullName;
  };

  // =========================
  // Page
  // =========================
  return (
    <div className="exams-page">

      <div className="page-heading">
        <h2>{t("exam.title")}</h2>
      </div>

      {error && (
        <div className="exam-message exam-error">
          {error}
        </div>
      )}

      <div className="exam-table-card">

        <h3>
          {t("exam.listTitle")}
        </h3>

        {loading ? (
          <p>{t("exam.loading")}</p>
        ) : exams.length === 0 ? (
          <p>{t("exam.noExams")}</p>
        ) : (
          <div className="exam-table-wrapper">

            <table className="exam-table">

              <thead>
                <tr>
                  <th>#</th>

                  <th>
                    {t("exam.name")}
                  </th>

                  <th>
                    {t("exam.class")}
                  </th>

                  <th>
                    {t("exam.subject")}
                  </th>

                  <th>
                    {t("exam.teacher")}
                  </th>

                  <th>
                    {t("exam.examType")}
                  </th>

                  <th>
                    {t("exam.examDate")}
                  </th>

                  <th>
                    {t("exam.academicYear")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {exams.map((exam, index) => (
                  <tr key={exam.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {exam.name || "-"}
                    </td>

                    <td>
                      {getClassName(exam.class_id)}
                    </td>

                    <td>
                      {getSubjectName(exam.subject_id)}
                    </td>

                    <td>
                      {getTeacherName(exam)}
                    </td>

                    <td>
                      {exam.exam_type || "-"}
                    </td>

                    <td>
                      {exam.exam_date
                        ? String(exam.exam_date).substring(0, 10)
                        : "-"}
                    </td>

                    <td>
                      {exam.academic_year || "-"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Exams;
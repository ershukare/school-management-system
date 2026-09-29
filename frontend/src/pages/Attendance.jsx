import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Attendance() {
  const { t, i18n } = useTranslation();

  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/classes"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("attendance.classLoadError")
          );
        }

        if (!cancelled) {
          setClasses(data);

          const today = new Date()
            .toISOString()
            .split("T")[0];

          setSelectedDate(today);
        }
      } catch (error) {
        console.error(
          "Fetch classes error:",
          error
        );

        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingClasses(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [t]);

  // =========================
  // Fetch Attendance
  // =========================
  useEffect(() => {
    let cancelled = false;

    const loadAttendance = async () => {
      if (!selectedClass || !selectedDate) {
        setAttendanceRecords([]);
        return;
      }

      try {
        setLoadingAttendance(true);
        setError("");

        // Attendance records
        const attendanceResponse = await fetch(
          "http://localhost:5000/api/attendance"
        );

        const attendanceData =
          await attendanceResponse.json();

        if (!attendanceResponse.ok) {
          throw new Error(
            attendanceData.message ||
              t("attendance.loadError")
          );
        }

        // Students
        const studentsResponse = await fetch(
          "http://localhost:5000/api/students"
        );

        const studentsData =
          await studentsResponse.json();

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              t("attendance.studentLoadError")
          );
        }

        // Selected class students
        const classStudents =
          studentsData.filter(
            (student) =>
              String(student.class_id) ===
              String(selectedClass)
          );

        // Selected date attendance
        const dateAttendance =
          attendanceData.filter(
            (record) =>
              String(record.date).substring(0, 10) ===
              String(selectedDate)
          );

        // Combine student + attendance
        const combinedRecords =
          classStudents
            .map((student) => {
              const record =
                dateAttendance.find(
                  (attendance) =>
                    String(
                      attendance.student_id
                    ) === String(student.id)
                );

              if (!record) {
                return null;
              }

              return {
                ...record,
                student_id: student.id,
                student_code:
                  student.student_code,
                roll_number:
                  student.roll_number,
                first_name:
                  student.first_name,
                last_name:
                  student.last_name,
                class_id:
                  student.class_id,
              };
            })
            .filter(Boolean);

        if (!cancelled) {
          setAttendanceRecords(
            combinedRecords
          );
        }
      } catch (error) {
        console.error(
          "Fetch attendance error:",
          error
        );

        if (!cancelled) {
          setError(error.message);
          setAttendanceRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAttendance(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [selectedClass, selectedDate, t]);

  // =========================
  // Class Name
  // =========================
  const displayClassName = (classItem) => {
    if (
      i18n.language === "om" &&
      classItem.name?.startsWith("Grade ")
    ) {
      const number =
        classItem.name.replace(
          "Grade ",
          ""
        );

      return `Kutaa ${number} - ${classItem.section}`;
    }

    return `${classItem.name} - ${classItem.section}`;
  };

  // =========================
  // Teacher Name
  // =========================
  const getTeacherName = (record) => {
    if (
      record.teacher_first_name ||
      record.teacher_last_name
    ) {
      return `${record.teacher_first_name || ""} ${
        record.teacher_last_name || ""
      }`.trim();
    }

    return "-";
  };

  return (
    <div className="attendance-page">

      {/* =========================
          Page Heading
      ========================== */}
      <div className="page-heading">
        <h2>{t("attendance.title")}</h2>
        <p>{t("attendance.subtitle")}</p>
      </div>

      {/* =========================
          Filters
      ========================== */}
      <div className="attendance-filter-card">

        <div className="attendance-filter-row">

          {/* Class */}
          <div className="form-group">
            <label>
              {t("attendance.class")}
            </label>

            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(
                  e.target.value
                )
              }
            >
              <option value="">
                {loadingClasses
                  ? t(
                      "attendance.loadingClasses"
                    )
                  : t(
                      "attendance.selectClass"
                    )}
              </option>

              {classes.map((classItem) => (
                <option
                  key={classItem.id}
                  value={classItem.id}
                >
                  {displayClassName(
                    classItem
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>
              {t("attendance.date")}
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
            />
          </div>

        </div>
      </div>

      {/* =========================
          Error
      ========================== */}
      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}

      {/* =========================
          Attendance Table
      ========================== */}
      {selectedClass &&
        selectedDate && (
          <div className="attendance-table-card">

            {loadingAttendance ? (
              <p className="attendance-loading">
                {t(
                  "attendance.loadingAttendance"
                )}
              </p>
            ) : attendanceRecords.length ===
              0 ? (
              <p className="attendance-empty">
                {t(
                  "attendance.noAttendanceRecords"
                )}
              </p>
            ) : (
              <>
                {/* Teacher Information */}
                <div className="attendance-teacher-info">

                  <div>
                    <strong>
                      {t(
                        "attendance.teacher"
                      )}
                      :
                    </strong>{" "}
                    {getTeacherName(
                      attendanceRecords[0]
                    )}
                  </div>

                  {attendanceRecords[0]
                    .teacher_code && (
                    <div>
                      <strong>
                        {t(
                          "attendance.teacherCode"
                        )}
                        :
                      </strong>{" "}
                      {
                        attendanceRecords[0]
                          .teacher_code
                      }
                    </div>
                  )}

                </div>

                {/* Table */}
                <div className="attendance-table-wrapper">

                  <table className="attendance-table">

                    <thead>
                      <tr>
                        <th>
                          {t(
                            "attendance.number"
                          )}
                        </th>

                        <th>
                          {t(
                            "attendance.rollNumber"
                          )}
                        </th>

                        <th>
                          {t(
                            "attendance.studentCode"
                          )}
                        </th>

                        <th>
                          {t(
                            "attendance.student"
                          )}
                        </th>

                        <th>
                          {t(
                            "attendance.status"
                          )}
                        </th>

                        <th>
                          {t(
                            "attendance.remarks"
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceRecords.map(
                        (record, index) => (
                          <tr
                            key={record.id}
                          >

                            {/* Number */}
                            <td>
                              {index + 1}
                            </td>

                            {/* Roll Number */}
                            <td>
                              {record.roll_number ??
                                "-"}
                            </td>

                            {/* Student Code */}
                            <td>
                              {record.student_code ||
                                "-"}
                            </td>

                            {/* Student Name */}
                            <td className="attendance-student-name">
                              {record.first_name ||
                                ""}{" "}
                              {record.last_name ||
                                ""}
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`attendance-status attendance-status-${String(
                                  record.status
                                ).toLowerCase()}`}
                              >
                                {t(
                                  `attendance.${String(
                                    record.status
                                  ).toLowerCase()}`
                                )}
                              </span>
                            </td>

                            {/* Remarks */}
                            <td>
                              {record.remarks ||
                                "-"}
                            </td>

                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>
              </>
            )}

          </div>
        )}
    </div>
  );
}

export default Attendance;
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function Students() {
  const { t } = useTranslation();

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const emptyForm = {
    student_code: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    address: "",
    class_id: "",
    admission_date: getToday(),
  };

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [selectedClassId, setSelectedClassId] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("student.loadError")
        );
      }

      setStudents(data);
    } catch (error) {
      console.error("Students data error:", error);

      alert(
        `${t("student.loadingFailed")}\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/classes"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("student.classLoadError")
        );
      }

      setClasses(data);
    } catch (error) {
      console.error("Classes data error:", error);

      alert(
        `${t("student.classesLoadingFailed")}\n\n${error.message}`
      );
    }
  };

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadStudents();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadClasses();
}, []);

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const gradeA = parseInt(
        String(a.name).replace(/\D/g, ""),
        10
      );

      const gradeB = parseInt(
        String(b.name).replace(/\D/g, ""),
        10
      );

      if (gradeA !== gradeB) {
        return gradeA - gradeB;
      }

      return String(a.section).localeCompare(
        String(b.section)
      );
    });
  }, [classes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddStudent = () => {
    setEditingId(null);

    setFormData({
      ...emptyForm,
      admission_date: getToday(),
    });

    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingId(student.id);

    setFormData({
      student_code: student.student_code || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      gender: student.gender || "Male",

      date_of_birth: student.date_of_birth
        ? student.date_of_birth.substring(0, 10)
        : "",

      phone: student.phone || "",
      address: student.address || "",

      class_id: student.class_id
        ? String(student.class_id)
        : "",

      admission_date: student.admission_date
        ? student.admission_date.substring(0, 10)
        : getToday(),
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student_code.trim()) {
      alert(t("student.enterStudentCode"));
      return;
    }

    if (!formData.first_name.trim()) {
      alert(t("student.enterFirstName"));
      return;
    }

    if (!formData.last_name.trim()) {
      alert(t("student.enterLastName"));
      return;
    }

    if (!formData.class_id) {
      alert(t("student.selectClassRequired"));
      return;
    }

    // Guyyaa dhalootaa validation
    if (formData.date_of_birth) {
      const birthDate = formData.date_of_birth;
      const year = birthDate.split("-")[0];

      if (year.length !== 4) {
        alert(t("student.invalidDateOfBirth"));
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        student_code: formData.student_code.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),

        gender: formData.gender,

        date_of_birth:
          formData.date_of_birth === ""
            ? null
            : formData.date_of_birth,

        phone: formData.phone.trim(),
        address: formData.address.trim(),

        class_id: Number(formData.class_id),

        admission_date:
          formData.admission_date === ""
            ? getToday()
            : formData.admission_date,
      };

      console.log("Student payload:", payload);

      if (editingId) {
        const response = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("student.updateError")
          );
        }

        alert(t("student.updateSuccess"));
      } else {
        const response = await fetch(
          "http://localhost:5000/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("student.createError")
          );
        }

        alert(t("student.registerSuccess"));
      }

      setShowForm(false);
      setEditingId(null);

      setFormData({
        ...emptyForm,
        admission_date: getToday(),
      });

      await loadStudents();
    } catch (error) {
      console.error(
        "Student save/update error:",
        error
      );

      alert(
        `${t("student.saveFailed")}\n\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("student.confirmDelete")
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("student.deleteError")
        );
      }

      alert(t("student.deleteSuccess"));

      await loadStudents();
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      alert(
        `${t("student.deleteFailed")}\n\n${error.message}`
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      ...emptyForm,
      admission_date: getToday(),
    });
  };

  const getStudentsForClass = (classId) => {
    return students
      .filter(
        (student) =>
          Number(student.class_id) === Number(classId)
      )
      .sort((a, b) => {
        const nameA =
          `${a.first_name || ""} ${a.last_name || ""}`.trim();

        const nameB =
          `${b.first_name || ""} ${b.last_name || ""}`.trim();

        return nameA.localeCompare(nameB);
      });
  };

  const getClassLabel = (classItem) => {
    return `${String(classItem.name).replace(
      "Grade ",
      ""
    )}${classItem.section}`;
  };

  return (
    <div className="students-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>{t("student.title")}</h1>
          <p>{t("student.subtitle")}</p>
        </div>

        <button
          className="add-student-btn"
          onClick={handleAddStudent}
        >
          + {t("student.add")}
        </button>
      </div>

      {/* STUDENT REGISTRATION FORM */}
      {showForm && (
        <div className="students-card">

          <h2>
            {editingId
              ? t("student.updateStudent")
              : t("student.add")}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* STUDENT CODE */}
            <div>
              <label>{t("student.code")}</label>

              <input
                type="text"
                name="student_code"
                value={formData.student_code}
                onChange={handleChange}
                placeholder={t(
                  "student.codePlaceholder"
                )}
                required
              />
            </div>

            {/* FIRST NAME */}
            <div>
              <label>{t("student.firstName")}</label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={t(
                  "student.firstNamePlaceholder"
                )}
                required
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label>{t("student.lastName")}</label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={t(
                  "student.lastNamePlaceholder"
                )}
                required
              />
            </div>

            {/* GENDER */}
            <div>
              <label>{t("student.gender")}</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">
                  {t("student.male")}
                </option>

                <option value="Female">
                  {t("student.female")}
                </option>
              </select>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label>
                {t("student.dateOfBirth")}
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                min="1900-01-01"
                max={getToday()}
              />
            </div>

            {/* PHONE */}
            <div>
              <label>{t("student.phone")}</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t(
                  "student.phonePlaceholder"
                )}
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label>{t("student.address")}</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t(
                  "student.addressPlaceholder"
                )}
              />
            </div>

            {/* CLASS */}
            <div>
              <label>{t("student.class")}</label>

              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("student.selectClass")}
                </option>

                {sortedClasses.map((classItem) => (
                  <option
                    key={classItem.id}
                    value={classItem.id}
                  >
                    {getClassLabel(classItem)}
                  </option>
                ))}
              </select>
            </div>

            {/* ADMISSION DATE */}
            <div>
              <label>
                {t("student.admissionDate")}
              </label>

              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                readOnly
              />
            </div>

            {/* FORM BUTTONS */}
            <div className="form-buttons">

              <button
                type="submit"
                className="add-student-btn"
                disabled={saving}
              >
                {saving
                  ? t("student.registering")
                  : editingId
                  ? t("student.saveUpdate")
                  : t("student.register")}
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                {t("app.cancel")}
              </button>

            </div>
          </form>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="students-card">
          <p className="loading">
            {t("student.loading")}
          </p>
        </div>

      ) : students.length === 0 ? (

        /* NO STUDENTS */
        <div className="students-card">
          <p className="empty-state">
            {t("student.noStudents")}
          </p>
        </div>

      ) : (

        <div>

          {/* CLASS FILTER */}
          <div className="students-card">

            <div className="class-selector">

              <label>
                {t("student.selectClassLabel")}
              </label>

              <select
                value={selectedClassId}
                onChange={(e) =>
                  setSelectedClassId(e.target.value)
                }
              >
                <option value="">
                  {t("student.allClasses")}
                </option>

                {sortedClasses.map((classItem) => (
                  <option
                    key={classItem.id}
                    value={classItem.id}
                  >
                    {getClassLabel(classItem)}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* CLASS STUDENTS */}
          {sortedClasses
            .filter((classItem) => {
              if (!selectedClassId) {
                return true;
              }

              return (
                Number(classItem.id) ===
                Number(selectedClassId)
              );
            })
            .map((classItem) => {

              const classStudents =
                getStudentsForClass(classItem.id);

              return (
                <div
                  className="students-card"
                  key={classItem.id}
                >

                  {/* CLASS NAME */}
                  <h2>
                    {getClassLabel(classItem)}
                  </h2>

                  {classStudents.length === 0 ? (

                    <p className="empty-state">
                      {t(
                        "student.noStudentsInClass"
                      )}
                    </p>

                  ) : (

                    <div className="table-container">

                      <table className="students-table">

                        <thead>
                          <tr>

                            <th>
                              {t("student.number")}
                            </th>

                            <th>
                              {t("student.code")}
                            </th>

                            <th>
                              {t("student.firstName")}
                            </th>

                            <th>
                              {t("student.lastName")}
                            </th>

                            <th>
                              {t("student.gender")}
                            </th>

                            <th>
                              {t("student.dateOfBirth")}
                            </th>

                            <th>
                              {t("student.phone")}
                            </th>

                            <th>
                              {t("student.actions")}
                            </th>

                          </tr>
                        </thead>

                        <tbody>

                          {classStudents.map(
                            (student, index) => (

                              <tr key={student.id}>

                                {/* CLASS NUMBER */}
                                <td>
                                  {index + 1}
                                </td>

                                {/* STUDENT CODE */}
                                <td className="student-code">
                                  {
                                    student.student_code
                                  }
                                </td>

                                {/* FIRST NAME */}
                                <td>
                                  {
                                    student.first_name
                                  }
                                </td>

                                {/* LAST NAME */}
                                <td>
                                  {
                                    student.last_name
                                  }
                                </td>

                                {/* GENDER */}
                                <td>
                                  {student.gender ===
                                  "Male"
                                    ? t(
                                        "student.male"
                                      )
                                    : t(
                                        "student.female"
                                      )}
                                </td>

                                {/* DATE OF BIRTH */}
                                <td>
                                  {student.date_of_birth
                                    ? new Date(
                                        student.date_of_birth
                                      ).toLocaleDateString(
                                        "en-GB"
                                      )
                                    : "-"}
                                </td>

                                {/* PHONE */}
                                <td>
                                  {student.phone ||
                                    "-"}
                                </td>

                                {/* ACTIONS */}
                                <td>

                                  <div className="action-buttons">

                                    <button
                                      className="edit-btn"
                                      type="button"
                                      onClick={() =>
                                        handleEdit(
                                          student
                                        )
                                      }
                                    >
                                      {t(
                                        "app.update"
                                      )}
                                    </button>

                                    <button
                                      className="delete-btn"
                                      type="button"
                                      onClick={() =>
                                        handleDelete(
                                          student.id
                                        )
                                      }
                                    >
                                      {t(
                                        "app.delete"
                                      )}
                                    </button>

                                  </div>

                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>
                  )}

                </div>
              );
            })}

        </div>
      )}

    </div>
  );
}

export default Students;

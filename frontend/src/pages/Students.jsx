import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Students() {
  const { t } = useTranslation();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    student_code: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    address: "",
    class_id: "",
    admission_date: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // GET STUDENTS
  // =========================
  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load students");
      }

      setStudents(data);
    } catch (error) {
      console.error("Students data error:", error);
      alert(`Students loading failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE STUDENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.student_code.trim()) {
      alert("Please enter Student Code");
      return;
    }

    if (!formData.first_name.trim()) {
      alert("Please enter First Name");
      return;
    }

    if (!formData.last_name.trim()) {
      alert("Please enter Last Name");
      return;
    }

    try {
      setSaving(true);

      // Prepare data for backend
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
        class_id:
          formData.class_id === ""
            ? null
            : Number(formData.class_id),
        admission_date:
          formData.admission_date === ""
            ? null
            : formData.admission_date,
      };

      console.log("Sending student:", payload);

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

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create student"
        );
      }

      // Success
      alert("Student created successfully!");

      // Close form
      setShowForm(false);

      // Clear form
      setFormData(emptyForm);

      // Reload students
      await loadStudents();
    } catch (error) {
      console.error("Create student error:", error);

      alert(
        `Student hin galme.\n\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

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
          data.message || "Failed to delete student"
        );
      }

      alert("Student deleted successfully!");

      await loadStudents();
    } catch (error) {
      console.error("Delete student error:", error);

      alert(
        `Student haqaan hin dandeenye.\n\n${error.message}`
      );
    }
  };

  // =========================
  // RENDER
  // =========================
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
          onClick={() => {
            setFormData(emptyForm);
            setShowForm(true);
          }}
        >
          + {t("student.add")}
        </button>
      </div>

      {/* =========================
          ADD STUDENT FORM
      ========================= */}
      {showForm && (
        <div className="students-card">

          <h2>{t("student.add")}</h2>

          <form onSubmit={handleSubmit}>

            {/* Student Code */}
            <div>
              <label>{t("student.code")}</label>

              <input
                type="text"
                name="student_code"
                value={formData.student_code}
                onChange={handleChange}
                placeholder="STU002"
                required
              />
            </div>

            {/* First Name */}
            <div>
              <label>{t("student.firstName")}</label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Abebe"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label>{t("student.lastName")}</label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Kebede"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label>{t("student.gender")}</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label>{t("student.phone")}</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912345678"
              />
            </div>

            {/* Address */}
            <div>
              <label>{t("student.address")}</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Holota"
              />
            </div>

            {/* Class ID */}
            <div>
              <label>Class ID</label>

              <input
                type="number"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                placeholder="1"
                min="1"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label>Admission Date</label>

              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
              />
            </div>

            {/* BUTTONS */}
            <div className="form-buttons">

              <button
                type="submit"
                className="add-student-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : t("app.save")}
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormData(emptyForm);
                }}
                disabled={saving}
              >
                {t("app.cancel")}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* =========================
          STUDENT LIST
      ========================= */}
      <div className="students-card">

        {loading ? (
          <p className="loading">
            {t("student.loading")}
          </p>
        ) : students.length === 0 ? (
          <p className="empty-state">
            {t("student.noStudents")}
          </p>
        ) : (
          <div className="table-container">

            <table className="students-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("student.code")}</th>
                  <th>{t("student.firstName")}</th>
                  <th>{t("student.lastName")}</th>
                  <th>{t("student.gender")}</th>
                  <th>{t("student.phone")}</th>
                  <th>{t("student.address")}</th>
                  <th>{t("student.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>

                    <td>{student.id}</td>

                    <td className="student-code">
                      {student.student_code}
                    </td>

                    <td>{student.first_name}</td>

                    <td>{student.last_name}</td>

                    <td>{student.gender}</td>

                    <td>
                      {student.phone || "-"}
                    </td>

                    <td>
                      {student.address || "-"}
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          type="button"
                        >
                          {t("app.update")}
                        </button>

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() =>
                            handleDelete(student.id)
                          }
                        >
                          {t("app.delete")}
                        </button>

                      </div>
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

export default Students;
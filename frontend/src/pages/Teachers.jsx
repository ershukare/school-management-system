import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Teachers() {
  const { t } = useTranslation();

  const emptyForm = {
    teacher_code: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    address: "",
    hire_date: "",
  };

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // GET ALL TEACHERS
  // =========================
  const loadTeachers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/teachers"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("teacher.loadError")
        );
      }

      setTeachers(data);
    } catch (error) {
      console.error("Teachers data error:", error);

      alert(
        `${t("teacher.loadingFailed")}\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
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
  // ADD TEACHER
  // =========================
  const handleAddTeacher = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  // =========================
  // EDIT TEACHER
  // =========================
  const handleEdit = (teacher) => {
    setEditingId(teacher.id);

    setFormData({
      teacher_code: teacher.teacher_code || "",
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      gender: teacher.gender || "Male",

      date_of_birth: teacher.date_of_birth
        ? teacher.date_of_birth.substring(0, 10)
        : "",

      phone: teacher.phone || "",
      address: teacher.address || "",

      hire_date: teacher.hire_date
        ? teacher.hire_date.substring(0, 10)
        : "",
    });

    setShowForm(true);
  };

  // =========================
  // SAVE / UPDATE TEACHER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.teacher_code.trim()) {
      alert(t("teacher.enterTeacherCode"));
      return;
    }

    if (!formData.first_name.trim()) {
      alert(t("teacher.enterFirstName"));
      return;
    }

    if (!formData.last_name.trim()) {
      alert(t("teacher.enterLastName"));
      return;
    }

    // Date validation
    if (formData.date_of_birth) {
      const year =
        formData.date_of_birth.split("-")[0];

      if (year.length !== 4) {
        alert(t("teacher.invalidDateOfBirth"));
        return;
      }
    }

    if (formData.hire_date) {
      const year =
        formData.hire_date.split("-")[0];

      if (year.length !== 4) {
        alert(t("teacher.invalidHireDate"));
        return;
      }
    }

    try {
      setSaving(true);

      // =========================
      // PAYLOAD
      // =========================
      const payload = {
        teacher_code:
          formData.teacher_code.trim(),

        first_name:
          formData.first_name.trim(),

        last_name:
          formData.last_name.trim(),

        gender: formData.gender,

        date_of_birth:
          formData.date_of_birth.trim() === ""
            ? null
            : formData.date_of_birth,

        phone: formData.phone.trim(),

        address: formData.address.trim(),

        hire_date:
          formData.hire_date.trim() === ""
            ? null
            : formData.hire_date,
      };

      console.log("Teacher payload:", payload);

      // =========================
      // UPDATE TEACHER
      // =========================
      if (editingId !== null) {
        const response = await fetch(
          `http://localhost:5000/api/teachers/${editingId}`,
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
            data.message ||
              t("teacher.updateError")
          );
        }

        alert(t("teacher.updateSuccess"));
      }

      // =========================
      // CREATE TEACHER
      // =========================
      else {
        const response = await fetch(
          "http://localhost:5000/api/teachers",
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
            data.message ||
              t("teacher.createError")
          );
        }

        alert(t("teacher.createSuccess"));
      }

      // =========================
      // RESET FORM
      // =========================
      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });

      await loadTeachers();
    } catch (error) {
      console.error(
        "Teacher save/update error:",
        error
      );

      alert(
        `${t("teacher.saveFailed")}\n\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE TEACHER
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("teacher.confirmDelete")
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/teachers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("teacher.deleteError")
        );
      }

      alert(t("teacher.deleteSuccess"));

      await loadTeachers();
    } catch (error) {
      console.error(
        "Delete teacher error:",
        error
      );

      alert(
        `${t("teacher.deleteFailed")}\n\n${error.message}`
      );
    }
  };

  // =========================
  // CANCEL FORM
  // =========================
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="students-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>{t("teacher.title")}</h1>

          <p>{t("teacher.subtitle")}</p>
        </div>

        <button
          className="add-student-btn"
          onClick={handleAddTeacher}
        >
          + {t("teacher.add")}
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="students-card">

          <h2>
            {editingId !== null
              ? t("teacher.update")
              : t("teacher.add")}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* TEACHER CODE */}
            <div>
              <label>
                {t("teacher.code")}
              </label>

              <input
                type="text"
                name="teacher_code"
                value={formData.teacher_code}
                onChange={handleChange}
                placeholder={t(
                  "teacher.codePlaceholder"
                )}
                required
              />
            </div>

            {/* FIRST NAME */}
            <div>
              <label>
                {t("teacher.firstName")}
              </label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={t(
                  "teacher.firstNamePlaceholder"
                )}
                required
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label>
                {t("teacher.lastName")}
              </label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={t(
                  "teacher.lastNamePlaceholder"
                )}
                required
              />
            </div>

            {/* GENDER */}
            <div>
              <label>
                {t("teacher.gender")}
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">
                  {t("teacher.male")}
                </option>

                <option value="Female">
                  {t("teacher.female")}
                </option>
              </select>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label>
                {t("teacher.dateOfBirth")}
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                min="1900-01-01"
                max={new Date()
                  .toISOString()
                  .split("T")[0]}
              />
            </div>

            {/* PHONE */}
            <div>
              <label>
                {t("teacher.phone")}
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t(
                  "teacher.phonePlaceholder"
                )}
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label>
                {t("teacher.address")}
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t(
                  "teacher.addressPlaceholder"
                )}
              />
            </div>

            {/* HIRE DATE */}
            <div>
              <label>
                {t("teacher.hireDate")}
              </label>

              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                min="1900-01-01"
                max={new Date()
                  .toISOString()
                  .split("T")[0]}
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
                  ? t("teacher.saving")
                  : editingId !== null
                  ? t("teacher.saveUpdate")
                  : t("teacher.save")}
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

      {/* TEACHER LIST */}
      <div className="students-card">

        {loading ? (
          <p className="loading">
            {t("teacher.loading")}
          </p>
        ) : teachers.length === 0 ? (
          <p className="empty-state">
            {t("teacher.noTeachers")}
          </p>
        ) : (
          <div className="table-container">

            <table className="students-table">

              <thead>
                <tr>

                  <th>
                    {t("teacher.number")}
                  </th>

                  <th>
                    {t("teacher.code")}
                  </th>

                  <th>
                    {t("teacher.firstName")}
                  </th>

                  <th>
                    {t("teacher.lastName")}
                  </th>

                  <th>
                    {t("teacher.gender")}
                  </th>

                  <th>
                    {t("teacher.dateOfBirth")}
                  </th>

                  <th>
                    {t("teacher.phone")}
                  </th>

                  <th>
                    {t("teacher.address")}
                  </th>

                  <th>
                    {t("teacher.hireDate")}
                  </th>

                  <th>
                    {t("teacher.actions")}
                  </th>

                </tr>
              </thead>

              <tbody>

                {teachers.map((teacher, index) => (
                  <tr key={teacher.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td className="student-code">
                      {teacher.teacher_code}
                    </td>

                    <td>
                      {teacher.first_name || "-"}
                    </td>

                    <td>
                      {teacher.last_name || "-"}
                    </td>

                    <td>
                      {teacher.gender === "Male"
                        ? t("teacher.male")
                        : teacher.gender === "Female"
                        ? t("teacher.female")
                        : "-"}
                    </td>

                    <td>
                      {teacher.date_of_birth
                        ? teacher.date_of_birth.substring(
                            0,
                            10
                          )
                        : "-"}
                    </td>

                    <td>
                      {teacher.phone || "-"}
                    </td>

                    <td>
                      {teacher.address || "-"}
                    </td>

                    <td>
                      {teacher.hire_date
                        ? teacher.hire_date.substring(
                            0,
                            10
                          )
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          type="button"
                          onClick={() =>
                            handleEdit(teacher)
                          }
                        >
                          {t("app.update")}
                        </button>

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() =>
                            handleDelete(
                              teacher.id
                            )
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

export default Teachers;
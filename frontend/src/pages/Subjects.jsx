import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Subjects() {
  const { t } = useTranslation();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  // =========================
  // FETCH SUBJECTS
  // =========================
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/subjects"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("subject.loadError")
        );
      }

      setSubjects(data);
    } catch (error) {
      console.error("Fetch subjects error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load subjects when page opens
  useEffect(() => {
    fetchSubjects();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
    });

    setEditingId(null);
  };

  // =========================
  // ADD / UPDATE SUBJECT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate subject name
    if (!formData.name.trim()) {
      alert(t("subject.enterName"));
      return;
    }

    // Validate subject code
    if (!formData.code.trim()) {
      alert(t("subject.enterCode"));
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `http://localhost:5000/api/subjects/${editingId}`
        : "http://localhost:5000/api/subjects";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("subject.saveError")
        );
      }

      // Success message
      alert(
        editingId
          ? t("subject.updateSuccess")
          : t("subject.createSuccess")
      );

      // Clear form
      resetForm();

      // Reload subjects
      fetchSubjects();
    } catch (error) {
      console.error("Save subject error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT SUBJECT
  // =========================
  const handleEdit = (subject) => {
    setEditingId(subject.id);

    setFormData({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
    });

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE SUBJECT
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("subject.confirmDelete")
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/subjects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("subject.deleteError")
        );
      }

      alert(t("subject.deleteSuccess"));

      // Reload subjects
      fetchSubjects();
    } catch (error) {
      console.error("Delete subject error:", error);
      alert(error.message);
    }
  };

  // =========================
  // PAGE UI
  // =========================
  return (
    <div className="subjects-page">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="page-heading">
        <h2>
          {editingId
            ? t("subject.updateTitle")
            : t("subject.title")}
        </h2>

        <p>{t("subject.subtitle")}</p>
      </div>

      {/* =========================
          SUBJECT FORM
      ========================== */}
      <div className="subject-form-card">
        <form onSubmit={handleSubmit}>

          <div className="subject-form-row">

            {/* Subject Name */}
            <div className="form-group">
              <label>
                {t("subject.name")}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t(
                  "subject.namePlaceholder"
                )}
                required
              />
            </div>

            {/* Subject Code */}
            <div className="form-group">
              <label>
                {t("subject.code")}
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder={t(
                  "subject.codePlaceholder"
                )}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group subject-description">
            <label>
              {t("subject.description")}
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t(
                "subject.descriptionPlaceholder"
              )}
              rows="4"
            />
          </div>

          {/* Buttons */}
          <div className="subject-form-actions">

            <button
              type="submit"
              className="save-subject-btn"
              disabled={saving}
            >
              {saving
                ? t("subject.saving")
                : editingId
                ? t("subject.saveUpdate")
                : t("subject.save")}
            </button>

            {/* Cancel button appears only during edit */}
            {editingId && (
              <button
                type="button"
                className="cancel-subject-btn"
                onClick={resetForm}
              >
                {t("app.cancel")}
              </button>
            )}

          </div>
        </form>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================== */}
      {error && (
        <div className="class-error">
          {error}
        </div>
      )}

      {/* =========================
          SUBJECT TABLE
      ========================== */}
      <div className="subject-table-card">

        {/* Loading */}
        {loading ? (
          <p className="class-loading">
            {t("subject.loading")}
          </p>
        ) : subjects.length === 0 ? (

          /* No subjects */
          <p className="class-empty">
            {t("subject.noSubjects")}
          </p>

        ) : (

          /* Subject list */
          <div className="class-table-wrapper">

            <table className="class-table">

              <thead>
                <tr>
                  <th>
                    {t("subject.number")}
                  </th>

                  <th>
                    {t("subject.name")}
                  </th>

                  <th>
                    {t("subject.code")}
                  </th>

                  <th>
                    {t("subject.description")}
                  </th>

                  <th className="actions-column">
                    {t("subject.actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={subject.id}>

                    {/* Number */}
                    <td>
                      {index + 1}
                    </td>

                    {/* Subject Name */}
                    <td className="class-name-cell">
                      {subject.name}
                    </td>

                    {/* Subject Code */}
                    <td>
                      {subject.code}
                    </td>

                    {/* Description */}
                    <td>
                      {subject.description || "-"}
                    </td>

                    {/* Actions */}
                    <td className="action-buttons">

                      {/* Edit */}
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(subject)
                        }
                      >
                        {t("subject.edit")}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(subject.id)
                        }
                      >
                        {t("subject.delete")}
                      </button>

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

// IMPORTANT:
// This must be here.
export default Subjects;
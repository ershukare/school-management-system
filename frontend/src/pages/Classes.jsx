import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Classes() {
  const { t, i18n } = useTranslation();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    academic_year: "",
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/classes"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("class.loadError")
        );
      }

      setClasses(data);
    } catch (error) {
      console.error("Fetch classes error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchClasses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      section: "",
      academic_year: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert(t("class.enterName"));
      return;
    }

    if (!formData.section.trim()) {
      alert(t("class.enterSection"));
      return;
    }

    if (!formData.academic_year.trim()) {
      alert(t("class.enterAcademicYear"));
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `http://localhost:5000/api/classes/${editingId}`
        : "http://localhost:5000/api/classes";

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
          data.message || t("class.saveError")
        );
      }

      alert(
        editingId
          ? t("class.updateSuccess")
          : t("class.createSuccess")
      );

      resetForm();
      fetchClasses();
    } catch (error) {
      console.error("Save class error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);

    setFormData({
      name: classItem.name || "",
      section: classItem.section || "",
      academic_year: classItem.academic_year || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("class.confirmDelete")
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("class.deleteError")
        );
      }

      alert(t("class.deleteSuccess"));

      fetchClasses();
    } catch (error) {
      console.error("Delete class error:", error);
      alert(error.message);
    }
  };

  // Afaan Oromoo irratti Grade -> Kutaa
  const displayClassName = (name) => {
    if (
      i18n.language === "om" &&
      /^Grade\s+/i.test(name)
    ) {
      return name.replace(/^Grade\s+/i, "Kutaa ");
    }

    return name;
  };

  return (
    <div className="classes-page">

      {/* PAGE TITLE */}
      <div className="page-heading">
        <h2>
          {editingId
            ? t("class.updateTitle")
            : t("class.title")}
        </h2>

        <p>{t("class.subtitle")}</p>
      </div>

      {/* CLASS FORM */}
      <div className="class-form-card">

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            {/* CLASS NAME */}
            <div className="form-group">
              <label>
                {t("class.name")}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t(
                  "class.namePlaceholder"
                )}
                required
              />
            </div>

            {/* SECTION */}
            <div className="form-group">
              <label>
                {t("class.section")}
              </label>

              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder={t(
                  "class.sectionPlaceholder"
                )}
                required
              />
            </div>

            {/* ACADEMIC YEAR */}
            <div className="form-group">
              <label>
                {t("class.academicYear")}
              </label>

              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                placeholder={t(
                  "class.academicYearPlaceholder"
                )}
                required
              />
            </div>

          </div>

          {/* FORM BUTTONS */}
          <div className="class-form-actions">

            <button
              type="submit"
              className="save-class-btn"
              disabled={saving}
            >
              {saving
                ? t("class.saving")
                : editingId
                ? t("class.saveUpdate")
                : t("class.save")}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-class-btn"
                onClick={resetForm}
              >
                {t("app.cancel")}
              </button>
            )}

          </div>

        </form>
      </div>

      {/* ERROR */}
      {error && (
        <div className="class-error">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="class-table-card">

        {loading ? (
          <p className="class-loading">
            {t("class.loading")}
          </p>
        ) : classes.length === 0 ? (
          <p className="class-empty">
            {t("class.noClasses")}
          </p>
        ) : (
          <div className="class-table-wrapper">

            <table className="class-table">

              <thead>
                <tr>
                  <th>{t("class.number")}</th>
                  <th>{t("class.name")}</th>
                  <th>{t("class.section")}</th>
                  <th>{t("class.academicYear")}</th>
                  <th className="actions-column">
                    {t("class.actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {classes.map((classItem, index) => (
                  <tr key={classItem.id}>

                    <td>{index + 1}</td>

                    <td className="class-name-cell">
                      {displayClassName(classItem.name)}
                    </td>

                    <td>{classItem.section}</td>

                    <td>
                      {classItem.academic_year}
                    </td>

                    <td className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(classItem)
                        }
                      >
                        {t("class.edit")}
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(classItem.id)
                        }
                      >
                        {t("app.delete")}
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

export default Classes;
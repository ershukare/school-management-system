import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Results() {
  const { t } = useTranslation();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/results"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("result.loadError")
          );
        }

        if (!cancelled) {
          setResults(data);
        }
      } catch (error) {
        console.error("Fetch results error:", error);

        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="results-page">

      {/* Page Heading */}
      <div className="page-heading">
        <h2>{t("result.title")}</h2>
        <p>{t("result.subtitle")}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="result-message result-error">
          {error}
        </div>
      )}

      {/* Results Table */}
      <div className="result-table-card">

        <h3>{t("result.listTitle")}</h3>

        {loading ? (
          <p>{t("result.loading")}</p>
        ) : results.length === 0 ? (
          <p>{t("result.noResults")}</p>
        ) : (
          <div className="result-table-wrapper">

            <table className="result-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("result.studentCode")}</th>
                  <th>{t("result.student")}</th>
                  <th>{t("result.subject")}</th>
                  <th>{t("result.exam")}</th>
                  <th>{t("result.examType")}</th>
                  <th>{t("result.marks")}</th>
                  <th>{t("result.remarks")}</th>
                  <th>{t("result.academicYear")}</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {result.student_code || "-"}
                    </td>

                    <td>
                      {`${result.student_first_name || ""} ${
                        result.student_last_name || ""
                      }`.trim() || "-"}
                    </td>

                    <td>
                      {result.subject_name || "-"}
                    </td>

                    <td>
                      {result.exam_name || "-"}
                    </td>

                    <td>
                      {result.exam_type || "-"}
                    </td>

                    <td>
                      {result.marks ?? "-"}
                    </td>

                    <td>
                      {result.remarks || "-"}
                    </td>

                    <td>
                      {result.academic_year || "-"}
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

export default Results;
import { useInterviewStore } from "../store/useInterviewStore";
import "../styles/interviewer.css";

function InterviewerPage() {
  const { candidates } = useInterviewStore();

  return (
    <div className="interviewer-page">
      <div className="background-hues" />

      <div className="interviewer-content">
        <h2>🧑‍💼 Interviewer Dashboard</h2>

        {(!candidates || candidates.length === 0) ? (
          <p>No completed interviews yet.</p>
        ) : (
          candidates.map((cand, idx) => (
            <div key={idx} className="results-section">
              <h3>{cand.name || "Unknown Candidate"}</h3>
              <p><strong>Email:</strong> {cand.email || "—"}</p>
              <p><strong>Phone:</strong> {cand.phone || "—"}</p>
              {cand.score !== undefined && (
                <p><strong>Score:</strong> {cand.score}%</p>
              )}
              {cand.timestamp && (
                <p><strong>Completed:</strong> {cand.timestamp}</p>
              )}

              {Array.isArray(cand.results) && cand.results.length > 0 && (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Correct Answer</th>
                      <th>User Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cand.results.map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{r.q}</td>
                        <td>{r.correct}</td>
                        <td>{r.user || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InterviewerPage;

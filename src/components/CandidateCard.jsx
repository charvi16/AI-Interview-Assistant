function CandidateCard({ candidate }) {
  return (
    <div className="candidate-card" style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
      <h3>Name :{candidate.name || "Not provided"}</h3>
      <p>Email: {candidate.email || "Not provided"}</p>
      <p>Phone: {candidate.phone || "Not provided"}</p>
      <p>Score: {candidate.score || "Pending"}</p>
      <p>Summary: {candidate.summary || "Not available yet"}</p>
    </div>
  );
}

export default CandidateCard;

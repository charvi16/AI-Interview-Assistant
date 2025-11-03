import { useState } from "react";
import { parseResume } from "../utils/resumeParser";

function ResumeUpload({ onParsed }) {
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await parseResume(file);
      onParsed(data); // name, email, phone, skills
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.docx" onChange={handleFile} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResumeUpload;

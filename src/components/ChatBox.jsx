import { useState, useEffect } from "react";
import Timer from "./Timer";
import { useInterviewStore } from "../store/useInterviewStore";

function ChatBox({ questionTime = 10 }) {
  const { currentCandidate, setResults, setScore } = useInterviewStore();
  const [qaPairs, setQaPairs] = useState([]); // [{q, correct, user}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeKey, setTimeKey] = useState(0);
  const [finished, setFinished] = useState(false);

  // ⚡ Fetch questions with answers from Groq
  useEffect(() => {
    if (!currentCandidate?.skills?.length) {
      setError("No skills found. Please re-upload your resume.");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        const response = await fetch("groq-api-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI interviewer. Generate very short one-line factual technical questions with one-word or one-line answers. Format the output as 'Q: question | A: answer'. No code.",
              },
              {
                role: "user",
                content: `Generate 5 one-line factual technical questions with correct answers based on these skills: ${currentCandidate.skills.join(
                  ", "
                )}.`,
              },
            ],
            temperature: 0.5,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch from Groq.");

        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content || "";

        // 🧩 Parse "Q: ... | A: ..." pairs
        const parsed = raw
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.includes("Q:") && line.includes("A:"))
          .map((line) => {
            const [q, a] = line.split("|").map((x) => x.replace(/^Q:|A:/, "").trim());
            return { q, correct: a, user: "" };
          });

        setQaPairs(parsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentCandidate]);

  // 🕒 Next question
  const nextQuestion = () => {
    if (questionIndex + 1 >= qaPairs.length) {
      finishInterview();
    } else {
      setQuestionIndex((prev) => prev + 1);
      setAnswer("");
      setTimeKey((k) => k + 1);
    }
  };

  // 🧮 Evaluate answer
  const sendAnswer = () => {
    const newPairs = [...qaPairs];
    newPairs[questionIndex].user = answer.trim();

    setQaPairs(newPairs);
    setAnswer("");
    nextQuestion();
  };

  // ✅ Finish and score
  const finishInterview = () => {
    const total = qaPairs.length;
    const correct = qaPairs.filter((p) =>
      p.user &&
      p.correct &&
      p.user.toLowerCase().includes(p.correct.toLowerCase().split(" ")[0])
    ).length;
    const percent = Math.round((correct / total) * 100);

    setResults(qaPairs);
    setScore(percent);
    setFinished(true);
  };

  // 💬 UI
  if (loading) return <p>Generating short AI questions... ⏳</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;
  if (finished) return <p>Interview Finished ✅</p>;

  const currentQ = qaPairs[questionIndex];

  return (
    <div className="chatbox-container">
      {currentQ ? (
        <>
          <div className="chat-message ai">{currentQ.q}</div>

          <Timer key={timeKey} seconds={questionTime} onTimeout={nextQuestion} />

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your short answer..."
          />
          <button onClick={sendAnswer}>Submit</button>
        </>
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
}

export default ChatBox;

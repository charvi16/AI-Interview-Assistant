import { useInterviewStore } from "../store/useInterviewStore";
import ChatBox from "../components/ChatBox";
import ResumeUpload from "../components/ResumeUpload";
import { useState, useEffect } from "react";
import "../styles/interviewee.css";

function IntervieweePage() {
  const {
    currentCandidate,
    results,
    score,
    setCandidate,
    addCandidate,
    resetInterview,
  } = useInterviewStore();

  const [readyForInterview, setReadyForInterview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResumeUpload = (data) => {
    setCandidate(data);
    setReadyForInterview(true);
  };

  useEffect(() => {
    if (results.length > 0 && currentCandidate && !submitted) {
      const completeCandidate = {
        ...currentCandidate,
        score,
        results,
        timestamp: new Date().toLocaleString(),
      };

      addCandidate(completeCandidate);

      const updatedCandidates = JSON.parse(
        localStorage.getItem("interview-store") || "{}"
      )?.state?.candidates || [];
      const channel = new BroadcastChannel("interview_channel");
      channel.postMessage([...updatedCandidates, completeCandidate]);

      setSubmitted(true);
      setReadyForInterview(false);
    }
  }, [results, currentCandidate, score, submitted, addCandidate]);

  return (
    <div className="interviewee-page">
      <div className="background-hues" />

      <div className="center-card">
        {!currentCandidate && !submitted && (
          <>
            <h2>Upload Your Resume</h2>
            <ResumeUpload onParsed={handleResumeUpload} />
          </>
        )}

        {readyForInterview && !submitted && <ChatBox questionTime={10} />}

        {submitted && (
          <div className="thankyou-message">
            <h2>✅ Interview Submitted</h2>
            <p>Thank you! Your responses have been recorded.</p>
            <button
              onClick={() => {
                resetInterview();
                setSubmitted(false);
                setReadyForInterview(false);
              }}
            >
              Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntervieweePage;

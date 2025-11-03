import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IntervieweePage from "./pages/IntervieweePage";
import InterviewerPage from "./pages/InterviewerPage";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interviewee" element={<IntervieweePage />} />
        <Route path="/interviewer" element={<InterviewerPage />} />
      </Routes>
    </Router>
  );
}

export default App;

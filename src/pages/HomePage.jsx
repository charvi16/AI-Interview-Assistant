import { Link } from "react-router-dom";
import Background from "../components/background";
import Choose from "./Choose";
import "../styles/global.css";

function HomePage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none"}}>
        <Background />
      </div>

      {/* Main content */}
      <div className="home-container" style={{ position: "relative", zIndex: 1}}>
        <h1 className="home-title">Master the interview.</h1>
        <h1 className="home-title">Learn smarter.</h1>
        <h1 className="home-title">AI-guided interview practice</h1>
        <p className="home-subtitle">Choose your role to get started</p>
        <div className="tab-buttons">
          <Link to="/interviewee" className="tab-btn">Interviewee</Link>
          <Link to="/interviewer" className="tab-btn">Interviewer</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

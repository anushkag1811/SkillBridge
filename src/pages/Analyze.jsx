import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./analyze.css";

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { file, syllabusText, jobDesc } = location.state || {};

  return (
    <div className="analyze-container">

      {/* Top Bar */}
      <div className="topbar">
        <span className="back" onClick={() => navigate("/")}>
          ← Back to Home
        </span>
      </div>

      <h1>📊 Analysis Result</h1>

      <div className="result-card">
        <h2>Uploaded File</h2>
        <p>{file ? file.name : "No file uploaded"}</p>
      </div>

      <div className="result-card">
        <h2>Syllabus Content</h2>
        <p>{syllabusText || "No syllabus text provided"}</p>
      </div>

      <div className="result-card">
        <h2>Job Description</h2>
        <p>{jobDesc || "No job description provided"}</p>
      </div>

      {/* Later: Show AI analysis here */}
      <div className="result-card">
        <h2>Skill Gap Analysis</h2>
        <p>Coming soon... 🚀</p>
      </div>

    </div>
  );
};

export default Analyze;
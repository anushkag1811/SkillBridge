import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      
      {/* Navbar */}
      <div className="navbar">
        <h1 className="logo">🎓 Syllabus Gap Analyzer</h1>

        <button
          className="nav-btn"
          onClick={() => navigate("/upload")}
        >
          Get Started
        </button>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <p className="badge">
          🔵 Bridge the Gap Between Education & Industry
        </p>

        <h1 className="title">
          What College Teaches ≠ <br /> What Industry Needs
        </h1>

        <p className="subtitle">
          Analyze your college syllabus against real job requirements.
          Discover missing skills, get personalized learning recommendations,
          and stay ahead in your career.
        </p>

        <button
          className="main-btn"
          onClick={() => navigate("/upload")}
        >
          Upload & Analyze →
        </button>
      </div>

      {/* Features */}
      <div className="features">
        <div className="card">
          <div className="icon">🎓</div>
          <h3>Syllabus</h3>
          <p>Upload your college curriculum</p>
        </div>

        <div className="card">
          <div className="icon">🎁</div>
          <h3>Job Requirements</h3>
          <p>Paste real job descriptions</p>
        </div>

        <div className="card">
          <div className="icon">📈</div>
          <h3>Gap Analysis</h3>
          <p>Get actionable insights</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
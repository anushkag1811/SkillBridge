import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./upload.css";
import { jobsData } from "../data/jobsData"; // import dataset

const Upload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [syllabusText, setSyllabusText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  // NEW: Job + Skills State
  const [selectedJob, setSelectedJob] = useState("");
  const [skills, setSkills] = useState([]);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle job selection
  const handleJobChange = (e) => {
    const jobTitle = e.target.value;
    setSelectedJob(jobTitle);

    const job = jobsData.find((j) => j.jobTitle === jobTitle);

    if (job) {
      setSkills(job.skills); // auto-fill skills
    }
  };

  // Handle skill change (editable)
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  // Add new skill
  const addSkillField = () => {
    setSkills([...skills, ""]);
  };

  const handleAnalyze = () => {
    navigate("/analyze", {
      state: {
        file,
        syllabusText,
        jobDesc,
        selectedJob,
        skills,
      },
    });
  };

  return (
    <div className="upload-container">

      {/* Top Bar */}
      <div className="topbar">
        <span className="back" onClick={() => navigate("/")}>
          ← Back to Home
        </span>
      </div>

      {/* Heading */}
      <div className="header">
        <h1>Analyze Your Skill Gap</h1>
        <p>
          Upload your syllabus and job description to discover what skills you
          need to learn
        </p>
      </div>

      {/* Main Section */}
      <div className="content">

        {/* Left Card */}
        <div className="card">
          <h2>📄 College Syllabus</h2>

          <p className="label">Upload PDF / Image (Optional)</p>

          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              hidden
            />
            {file ? file.name : "Click to upload PDF / Image"}
          </label>

          <p className="or">OR</p>

          <p className="label">Paste Syllabus Content</p>
          <textarea
            className="scroll-textarea"
            placeholder="Paste your syllabus content here..."
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          ></textarea>
        </div>

        {/* Right Card */}
        <div className="card">
          <h2>🎯 Target Job</h2>

          {/* 🔽 Job Dropdown */}
          <p className="label">Select Job Role</p>
          <select
            className="dropdown"
            value={selectedJob}
            onChange={handleJobChange}
          >
            <option value="">-- Select Job Role --</option>
            {jobsData.map((job, index) => (
              <option key={index} value={job.jobTitle}>
                {job.jobTitle}
              </option>
            ))}
          </select>

          <p className="label">Paste Job Description (Optional)</p>
          <textarea
            className="scroll-textarea"
            placeholder="Paste the job description..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>

          {/* Skills Section */}
          <p className="label">Required Skills</p>

          {skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              className="skill-input"
            />
          ))}

          {selectedJob && (
            <button className="add-skill-btn" onClick={addSkillField}>
              + Add Skill
            </button>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="btn-container">
        <button className="analyze-btn" onClick={handleAnalyze}>
          Analyze Gap
        </button>
      </div>

    </div>
  );
};

export default Upload;
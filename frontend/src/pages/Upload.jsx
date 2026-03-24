import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./upload.css";
import { jobsData } from "../data/jobsData";

const Upload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [syllabusText, setSyllabusText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  // Store FULL skill objects
  const [selectedJob, setSelectedJob] = useState("");
  const [skills, setSkills] = useState([]);

  // 📄 File upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // 🎯 Job selection
  const handleJobChange = (e) => {
    const jobTitle = e.target.value;
    setSelectedJob(jobTitle);

    const job = jobsData.find((j) => j.jobTitle === jobTitle);

    if (job) {
      setSkills(job.skills); // keep full objects
    } else {
      setSkills([]);
    }
  };

  // ✏️ Edit skill name only
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      name: value,
    };
    setSkills(updatedSkills);
  };

  // ➕ Add new skill
  const addSkillField = () => {
    setSkills([
      ...skills,
      { name: "", category: "Custom", priority: "low" },
    ]);
  };

  // 🚀 Navigate + send ONLY skill names
  const handleAnalyze = () => {
    navigate("/analyze", {
      state: {
        file,
        syllabusText,
        jobDesc,
        selectedJob,
        skills: skills.map((s) => s.name), // IMPORTANT FIX
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

      {/* Header */}
      <div className="header">
        <h1>Analyze Your Skill Gap</h1>
        <p>
          Upload your syllabus and job description to discover what skills you
          need to learn
        </p>
      </div>

      {/* Main Content */}
      <div className="content">

        {/* LEFT: SYLLABUS */}
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

        {/* RIGHT: JOB */}
        <div className="card">
          <h2>🎯 Target Job</h2>

          {/* Dropdown */}
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

          {/* Job Description */}
          <p className="label">Paste Job Description (Optional)</p>
          <textarea
            className="scroll-textarea"
            placeholder="Paste the job description..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>

          {/* Skills */}
          <p className="label">Required Skills</p>

          {skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill.name}   // ✅ FIX HERE
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

      {/* Analyze Button */}
      <div className="btn-container">
        <button className="analyze-btn" onClick={handleAnalyze}>
          Analyze Gap
        </button>
      </div>

    </div>
  );
};

export default Upload;
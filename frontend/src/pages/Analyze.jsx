import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./analyze.css";

const Analyze = () => {
  const location = useLocation();

  // Receive ALL data
  const { syllabusText, skills, file } = location.state;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sendData = async () => {
      const formData = new FormData();

      // 📄 Add file (if exists)
      if (file) {
        formData.append("file", file);
      }

      // 📝 Add text
      formData.append("syllabusText", syllabusText || "");

      // 🎯 Add skills (IMPORTANT)
      formData.append("jobSkills", JSON.stringify(skills));

      try {
        const res = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          body: formData, // ❗ NO headers here
        });

        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    sendData();
  }, []);

  if (loading) return <h2>Analyzing...</h2>;

  if (!result) return <h2>Error fetching results</h2>;

  return (
    <div className="analyze-container">

      {/* GAP SCORE */}
      <div className="score-card">
        <h2>Skill Gap Score</h2>
        <h1>{result.gap_score}%</h1>
        <p>
          {result.gap_score > 60
            ? "Needs Improvement"
            : result.gap_score > 30
            ? "Moderate"
            : "Good"}
        </p>
      </div>

      {/* MATCHED */}
      <div className="section">
        <h3>✅ Matched Skills</h3>
        <div className="tags">
          {result.matched_skills.length > 0 ? (
            result.matched_skills.map((s, i) => (
              <span key={i} className="tag green">{s}</span>
            ))
          ) : (
            <p>No matched skills</p>
          )}
        </div>
      </div>

      {/* MISSING */}
      <div className="section">
        <h3>❌ Missing Skills</h3>
        <div className="tags">
          {result.missing_skills.length > 0 ? (
            result.missing_skills.map((s, i) => (
              <span key={i} className="tag red">{s}</span>
            ))
          ) : (
            <p>No missing skills 🎉</p>
          )}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="section">
        <h3>📊 Skills by Category</h3>
        {Object.keys(result.category_data).length > 0 ? (
          Object.entries(result.category_data).map(([cat, val], i) => (
            <div key={i}>
              <strong>{cat}</strong> → Matched: {val.matched}, Missing: {val.missing}
            </div>
          ))
        ) : (
          <p>No category data</p>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div className="section">
        <h3>📚 Learning Recommendations</h3>
        {Object.keys(result.recommendations).length > 0 ? (
          Object.entries(result.recommendations).map(([skill, links], i) => (
            <div key={i}>
              <h4>{skill}</h4>
              {links.map((l, j) => (
                <p key={j}>
                  <a href={l.link} target="_blank" rel="noreferrer">
                    {l.title}
                  </a>
                </p>
              ))}
            </div>
          ))
        ) : (
          <p>No recommendations needed 🎉</p>
        )}
      </div>

    </div>
  );
};

export default Analyze;
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import re
import json
import io

# PDF + OCR
import PyPDF2
from PIL import Image
import pytesseract

app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📊 Skill categories
skill_categories = {
    "Programming": ["JavaScript", "Python", "Java"],
    "Frontend": ["React", "HTML", "CSS"],
    "Backend": ["Node.js", "Django", "FastAPI"],
    "Database": ["SQL", "MongoDB"],
    "Cloud": ["AWS"],
    "DevOps": ["Docker", "Kubernetes", "CI/CD"],
    "Tools": ["Git"],
    "Testing": ["Jest"],
    "Architecture": ["System Design"],
    "Methodology": ["Agile"]
}

# 🔍 TEXT CLEANING
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9 ]', ' ', text)
    return text

# 🧠 IMPROVED SKILL MATCHING
def extract_skills(text, skills):
    found = []
    words = set(text.split())

    for skill in skills:
        skill_lower = skill.lower()

        if skill_lower in text:
            found.append(skill)
        else:
            for word in words:
                if skill_lower in word:
                    found.append(skill)
                    break

    return list(set(found))


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(None),
    syllabusText: str = Form(""),
    jobSkills: str = Form("[]")   # ✅ FIX (no crash if empty)
):
    text = syllabusText or ""

    # 📄 PDF + 🖼️ IMAGE processing
    if file:
        try:
            if file.filename.endswith(".pdf"):
                pdf_reader = PyPDF2.PdfReader(file.file)
                for page in pdf_reader.pages:
                    text += " " + (page.extract_text() or "")

            elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
                image_bytes = await file.read()
                image = Image.open(io.BytesIO(image_bytes))
                text += " " + pytesseract.image_to_string(image)

        except Exception as e:
            print("File processing error:", e)

    # ✅ Safety fallback
    if not text.strip():
        text = ""

    text = preprocess(text)

    # ✅ Safe JSON parsing
    try:
        job_skills = json.loads(jobSkills)
    except:
        job_skills = []

    # 🧠 Matching
    matched = extract_skills(text, job_skills)
    missing = list(set(job_skills) - set(matched))

    # 📊 GAP SCORE
    gap_score = int((len(missing) / len(job_skills)) * 100) if job_skills else 0

    # 📊 CATEGORY
    category_data = {}
    for cat, cat_skills in skill_categories.items():
        matched_count = len(set(cat_skills) & set(matched))
        missing_count = len(set(cat_skills) & set(missing))

        if matched_count or missing_count:
            category_data[cat] = {
                "matched": matched_count,
                "missing": missing_count
            }

    # 📚 RECOMMENDATIONS
    recommendations = {}
    for skill in missing:
        recommendations[skill] = [
            {
                "title": f"Learn {skill} (YouTube)",
                "link": f"https://www.youtube.com/results?search_query={skill}"
            },
            {
                "title": f"{skill} Documentation",
                "link": f"https://www.google.com/search?q={skill}+documentation"
            }
        ]

    return {
        "gap_score": gap_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "category_data": category_data,
        "recommendations": recommendations
    }
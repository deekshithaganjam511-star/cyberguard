from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobText(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "CyberGuard API is running"}

@app.post("/analyze-job")
def analyze_job(data: JobText):
    prompt = f"""
You are CyberGuard, a cybersecurity assistant helping Indian students detect fake job postings.

Analyze this job posting and respond with:
1. VERDICT: (SCAM / SUSPICIOUS / LEGITIMATE)
2. REASONS: (3 bullet points explaining why)
3. ADVICE: (one line advice for the student)

Job posting:
{data.text}
"""
    response = model.generate_content(prompt)
    return {"result": response.text}
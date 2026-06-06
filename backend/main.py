from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return {"result": response.text}


class SMSText(BaseModel):
    text: str

@app.post("/analyze-sms")
def analyze_sms(data: SMSText):
    prompt = f"""
You are CyberGuard, a cybersecurity assistant helping Indian students detect scam SMS and WhatsApp messages.

Analyze this message and respond with:
1. VERDICT: (SCAM / SUSPICIOUS / LEGITIMATE)
2. REASONS: (3 bullet points explaining why)
3. ADVICE: (one line advice for the student)

Message:
{data.text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return {"result": response.text}

class URLText(BaseModel):
    text: str

@app.post("/analyze-url")
def analyze_url(data: URLText):
    prompt = f"""
You are CyberGuard, a cybersecurity assistant helping Indian students identify suspicious URLs.

Analyze this URL and respond with:
1. VERDICT: (HIGH RISK / MODERATE RISK / LOW RISK)
2. REASONS: (3 bullet points explaining why)
3. ADVICE: (one line advice for the student)

URL:
{data.text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return {"result": response.text}
class TipRequest(BaseModel):
    topic: str

@app.post("/get-tip")
def get_tip(data: TipRequest):
    prompt = f"""
You are CyberGuard, a friendly cybersecurity educator for Indian college students.

Give a short, practical tip guide on this topic: {data.topic}

Format:
- One line summary
- 4 practical tips using bullet points (•)
- One "Quick Action" the student can do right now

Keep it simple, friendly and relevant to Indian student life.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return {"result": response.text}
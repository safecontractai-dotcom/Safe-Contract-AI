from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from utils.document_extractor import extract_text_from_file
from utils.llm_analysis import analyze_contract
from utils.risk_engine import detect_risks

import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="SafeContract AI Backend")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "✅ SafeContract AI Backend Running"}


# ================= CONTRACT ANALYSIS =================

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        text = extract_text_from_file(file)

        if not text or not text.strip():
            return {"error": "Empty or unreadable contract text."}

        rule_risks = [r["message"] for r in detect_risks(text)]
        llm_result = analyze_contract(text)

        return {
            "risk_evaluation": {
                "missing_clauses": llm_result["missing_clauses"],
                "present_risks": llm_result["present_risks"] + rule_risks
            },
            "llm_summary": llm_result["summary"],
            "full_text": text
        }

    except Exception as e:
        print("BACKEND ERROR:", e)
        return {"error": "Internal processing error"}


# ================= AI ASSISTANT =================

class AssistantRequest(BaseModel):
    question: str
    context: str


@app.post("/ai-assistant")
async def ai_assistant(data: AssistantRequest):
    prompt = f"""
You are a senior contract lawyer AI.

CONTRACT TEXT:
{data.context}

USER QUESTION:
{data.question}

Answer clearly and legally.
"""

    model = genai.GenerativeModel("models/gemini-pro-latest")
    response = model.generate_content(prompt)

    return {"answer": response.text}


# ✅ Render-compatible startup
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

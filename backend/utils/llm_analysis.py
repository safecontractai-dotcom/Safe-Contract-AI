import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Use only validated supported model
model = genai.GenerativeModel("models/gemini-pro-latest")


def analyze_contract(text: str):

    prompt = f"""
You are an expert legal contract analysis AI.

Analyze the following contract and return STRICT JSON only.

CONTRACT TEXT:
{text}

Return JSON exactly like this:

{{
  "missing_clauses": [
    "Clause name 1",
    "Clause name 2"
  ],
  "present_risks": [
    "Risk 1",
    "Risk 2"
  ],
  "summary": "One paragraph summary in simple legal English."
}}

Rules:
- No markdown
- No explanation
- Output JSON only
"""

    try:
        response = model.generate_content(prompt)

        raw = response.text.strip()

        start = raw.find("{")
        end = raw.rfind("}") + 1

        cleaned = raw[start:end]
        data = json.loads(cleaned)

        return {
            "missing_clauses": data.get("missing_clauses", []),
            "present_risks": data.get("present_risks", []),
            "summary": data.get("summary", "No summary generated.")
        }

    except Exception as e:
        print("LLM ERROR:", str(e))
        return {
            "missing_clauses": [],
            "present_risks": [],
            "summary": "AI analysis failed. Please retry."
        }

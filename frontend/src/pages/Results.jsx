import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalysisResult from "../components/AnalysisResult";
import AIAssistant from "../components/AIAssistant";
import { Download, FileText } from "lucide-react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const [assistantOpen, setAssistantOpen] = useState(true);
  const [jumpTo, setJumpTo] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const pdfHighlightRef = useRef(null);

  const { result, previewUrl } = location.state || {};

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ✅ SAFETY SCORE CALCULATION
  useEffect(() => {
    if (result?.risk_evaluation) {
      const totalRisks = result.risk_evaluation.present_risks.length;
      const missing = result.risk_evaluation.missing_clauses.length;
      const score = Math.max(0, 100 - (totalRisks * 10 + missing * 5));
      setSafetyScore(score);
    }
  }, [result]);

  // ✅ Animate Score
  useEffect(() => {
    if (safetyScore !== null) {
      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        setAnimatedScore(start);
        if (start >= safetyScore) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [safetyScore]);

  // ✅ Scroll on risk click + open AI
  useEffect(() => {
    if (jumpTo) {
      pdfHighlightRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [jumpTo]);

  // ✅ DOWNLOAD ANALYSIS REPORT (Professional Report)
  const downloadAnalysisReport = () => {
    const content = `
SAFE CONTRACT ANALYSIS REPORT

Safety Score: ${safetyScore}%
Risk Level: ${getRiskLevel()}

AI Legal Summary:
${result.llm_summary}

Detected Risks:
${result.risk_evaluation.present_risks.join("\n- ")}

Missing Clauses:
${result.risk_evaluation.missing_clauses.join("\n- ")}
`;
    const blob = new Blob([content], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SafeContract_Analysis_Report.txt";
    link.click();
  };

  const getRiskLevel = () => {
    if (safetyScore > 75) return "Low Risk";
    if (safetyScore > 40) return "Medium Risk";
    return "High Risk";
  };

  // ✅ OPEN ORIGINAL CONTRACT
  const openOriginalPDF = () => {
    if (previewUrl) window.open(previewUrl, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <Sidebar />

      <div className="ml-64 w-full">
        <Navbar onOpenAssistant={() => setAssistantOpen(true)} />

        <AIAssistant
          isOpen={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          contractText={result.full_text}
          selectedRisk={jumpTo}
        />

        <div className="px-16 pt-28 pb-20 space-y-10">
          {/* ✅ SAFETY SCORE */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Contract Safety Score
              </h2>
              <p className="text-gray-500 text-sm">
                Status: <span className="font-semibold">{getRiskLevel()}</span>
              </p>
            </div>

            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeDasharray={`${animatedScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-blue-600">
                {animatedScore}%
              </div>
            </div>
          </div>

          {/* ✅ ACTION BAR - CLEAN & PROFESSIONAL */}
          <div className="flex justify-between items-center">
            <button
              onClick={openOriginalPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800"
            >
              <FileText size={18} /> Open Original Contract
            </button>

            <button
              onClick={downloadAnalysisReport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              <Download size={18} /> Download Analysis Report
            </button>
          </div>

          {/* ✅ ANALYSIS ONLY (NO PREVIEW SECTION ANYMORE) */}
          <div ref={pdfHighlightRef}>
            <AnalysisResult
              result={result}
              jumpTo={jumpTo}
              setJumpTo={(riskText) => {
                setJumpTo(riskText);
                setAssistantOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

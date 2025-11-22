import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import AIAssistant from "../components/AIAssistant";
import RecentUploads from "../components/RecentUploads";

export default function Dashboard() {
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [uploads, setUploads] = useState([]);

  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("contract_uploads");
    if (saved) setUploads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("contract_uploads", JSON.stringify(uploads));
  }, [uploads]);

  // Auto close modal after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleResult = (data, fileObj) => {
    const generatedPreview = URL.createObjectURL(fileObj);
    setPreviewUrl(generatedPreview);
    setHasAnalyzed(true);

    const newUpload = {
      name: fileObj.name,
      time: new Date().toLocaleString(),
      risks: data.risk_evaluation.present_risks.length,
      fullData: data,
      previewUrl: generatedPreview,
    };

    setUploads((prev) => [newUpload, ...prev.slice(0, 9)]);

    setNotifications((prev) => [
      {
        message: `Analysis complete: ${fileObj.name} (${newUpload.risks} risks)`,
        time: new Date().toLocaleTimeString(),
        read: false,
      },
      ...prev,
    ]);

    navigate("/results", {
      state: {
        result: data,
        previewUrl: generatedPreview,
      },
    });
  };

  const handleOpenAssistant = () => {
    if (!hasAnalyzed) {
      setShowAlert(true);
      return;
    }
    setAssistantOpen(true);
  };

  const scrollToUpload = () => {
    setShowAlert(false);
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar />

      <div className="ml-64 w-full">
        <Navbar
          onOpenAssistant={handleOpenAssistant}
          notifications={notifications}
        />

        <AIAssistant
          isOpen={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          contractText=""
          selectedRisk={null}
        />

        <section className="pt-28 px-16 pb-10">
          <h1 className="text-4xl font-semibold text-gray-900">
            Welcome to{" "}
            <span className="text-blue-600 font-bold">SafeContract AI</span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg max-w-3xl">
            Upload your contract and let AI detect risks and weaknesses.
          </p>
        </section>

        <div ref={uploadRef} className="flex justify-center mb-20 px-6">
          <div className="bg-white/60 backdrop-blur-2xl border border-gray-200 shadow-xl rounded-3xl p-12 w-full max-w-3xl">
            <FileUpload
              setPreviewUrl={setPreviewUrl}
              onFinalResult={handleResult}
            />
          </div>
        </div>

        <div className="px-16 pb-20">
          <RecentUploads uploads={uploads} />
        </div>
      </div>

      {/* 🌟 PREMIUM SMART ALERT */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-[420px] text-center animate-[pop_0.3s_ease-out]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ⚠️ Analysis Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please upload and analyze a contract before using the AI
              Assistant.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={scrollToUpload}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Go to Upload
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Style */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

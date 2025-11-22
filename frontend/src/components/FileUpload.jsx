import { useState, useEffect } from "react";
import axios from "axios";
import AIScanOverlay from "./AIScanOverlay";
import { FileText, Image as ImageIcon, CheckCircle, Crown } from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function FileUpload({ setPreviewUrl, onFinalResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [userData, setUserData] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  // ✅ Fetch user subscription + usage from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData({ uid: user.uid, ...snap.data() });
      }
    });

    return () => unsubscribe();
  }, []);

  const analyze = async () => {
    if (!file) {
      alert("Please upload a document.");
      return;
    }

    if (!userData) {
      alert("Please login to analyze contracts.");
      return;
    }

    // ✅ LIVE LIMIT CHECK FROM DATABASE (most accurate)
    const liveRef = doc(db, "users", userData.uid);
    const liveSnap = await getDoc(liveRef);
    const liveData = liveSnap.data();

    if (liveData.contractsUsed >= liveData.contractLimit) {
      setShowLimitPopup(true);
      return;
    }

    setLoading(true);
    setStep("Reading document...");

    const fd = new FormData();
    fd.append("file", file);

    setTimeout(() => setStep("Extracting text via OCR..."), 600);
    setTimeout(() => setStep("Analyzing contract clauses..."), 1400);
    setTimeout(() => setStep("Generating legal insights..."), 2200);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", fd);

      // ✅ Increase usage count in Firestore
      await updateDoc(liveRef, {
        contractsUsed: liveData.contractsUsed + 1,
      });

      setUserData({
        ...userData,
        contractsUsed: liveData.contractsUsed + 1,
      });

      onFinalResult(res.data, file);
    } catch (e) {
      alert("Error analyzing contract. Please try again.");
    }

    setLoading(false);
  };

  const getFileIcon = () => {
    if (!file) return <FileText size={32} className="text-gray-400" />;
    if (file.type.startsWith("image"))
      return <ImageIcon size={32} className="text-blue-500" />;
    return <FileText size={32} className="text-blue-600" />;
  };

  return (
    <>
      {loading && <AIScanOverlay step={step} />}

      {/* ✅ LIMIT REACHED POPUP */}
      {showLimitPopup && userData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md text-center">
            <Crown className="mx-auto text-yellow-500 mb-4" size={40} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Contract Limit Reached
            </h2>
            <p className="text-gray-600 mb-6">
              You’ve used all {userData.contractLimit} contracts for your
              current plan. Upgrade to continue analyzing.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLimitPopup(false)}
                className="px-5 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() => (window.location.href = "/settings")}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-5">
        {/* ✅ USER USAGE DISPLAY */}
        {userData && (
          <div className="text-sm text-gray-600 flex justify-between px-2">
            <span>
              Plan: <strong className="capitalize">{userData.plan}</strong>
            </span>
            <span>
              Used: {userData.contractsUsed}/{userData.contractLimit}
            </span>
          </div>
        )}

        <label
          className="flex flex-col items-center justify-center
          border-2 border-dashed border-gray-300
          rounded-3xl p-10 cursor-pointer
          bg-white/70 backdrop-blur-xl
          hover:border-blue-500 hover:bg-white/90
          transition-all text-center"
        >
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {getFileIcon()}

          <p className="text-gray-800 text-lg font-semibold mt-3">
            {file ? file.name : "Upload Contract Document"}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            PDF, Word, Image or Scanned Document supported
          </p>

          {file && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              Ready for OCR processing
            </div>
          )}
        </label>

        {file && (
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span>Type: {file.type || "Unknown"}</span>
            <span>Size: {(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          className="w-full py-4 bg-blue-600
            text-white rounded-2xl font-semibold
            hover:bg-blue-700 active:scale-[0.97]
            transition-all disabled:bg-gray-400 shadow-lg"
        >
          {loading ? "Processing Document..." : "Analyze Contract"}
        </button>

        {loading && (
          <div className="text-center text-sm text-gray-500 animate-pulse">
            AI is carefully scanning your document for legal risks...
          </div>
        )}
      </div>
    </>
  );
}

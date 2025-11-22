import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Loader2, Sparkles } from "lucide-react";

export default function AIAssistant({
  isOpen,
  onClose,
  contractText,
  selectedRisk,
}) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 I am your Legal AI Advisor.\n\nClick on any risk to explain or rewrite it safely.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("General");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ AUTO RESPOND BASED ON BUTTON ACTION
  useEffect(() => {
    if (selectedRisk?.text) {
      let prompt = "";

      if (selectedRisk.type === "explain") {
        prompt = `Explain this contract risk in simple terms and suggest how to fix it:\n${selectedRisk.text}`;
      }

      if (selectedRisk.type === "rewrite") {
        prompt = `Rewrite this risky clause into a safer, legally balanced version and provide recommendations:\n${selectedRisk.text}`;
      }

      sendMessage(prompt);
    }
  }, [selectedRisk]);

  const sendMessage = async (customText) => {
    const finalText = customText || input;
    if (!finalText.trim() || loading) return;

    const userMsg = { sender: "user", text: finalText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ai-assistant", {
        question: finalText,
        context: contractText,
        role: userRole,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.answer || "Unable to generate response.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Failed to process the request.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[34rem] shadow-2xl 
      bg-white/80 backdrop-blur-xl border-l border-gray-300 
      transition-all duration-300 z-[9999]
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b bg-white/60">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles size={18} /> Legal AI Advisor
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      {/* ROLE SELECT */}
      <div className="px-5 py-3 border-b">
        <span className="text-sm font-medium">View as:</span>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="ml-3 px-3 py-1 rounded border text-sm"
        >
          <option>General</option>
          <option>Client</option>
          <option>Vendor</option>
          <option>Freelancer</option>
        </select>
      </div>

      {/* CHAT AREA */}
      <div className="p-5 h-[70%] overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] p-4 rounded-2xl text-sm shadow
            ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-200 px-4 py-3 rounded-xl flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-3 rounded-lg border"
          placeholder="Ask about this contract..."
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

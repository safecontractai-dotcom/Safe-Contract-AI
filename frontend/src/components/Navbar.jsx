import Notifications from "./Notifications";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LogOut } from "lucide-react";

export default function Navbar({ onOpenAssistant, notifications = [] }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="
        flex justify-between items-center 
        px-8 py-4 bg-white border-b 
        border-gray-200 shadow-sm 
        fixed top-0 left-64 
        w-[calc(100%-16rem)] z-50
      "
    >
      <h2 className="text-lg font-semibold text-gray-800">
        SafeContract AI Dashboard
      </h2>

      <div className="flex items-center gap-6">
        <Notifications notifications={notifications} />

        <button
          onClick={onOpenAssistant}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition active:scale-95"
        >
          Ask AI Assistant
        </button>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            border border-red-500
            text-red-600 font-medium
            hover:bg-red-50
            transition
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}

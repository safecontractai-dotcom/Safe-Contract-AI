import { FileText, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-5 py-3 text-gray-200 rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-white";

  const activeClass =
    "flex items-center gap-3 px-5 py-3 bg-white/20 text-white rounded-xl shadow-md";

  return (
    <aside
      className="
        w-64 h-screen fixed left-0 top-0 
        bg-gradient-to-b from-blue-900 to-blue-700 
        border-r border-white/10 
        p-6 flex flex-col justify-between
      "
    >
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          <span className="text-blue-300">Safe</span>Contract
        </h1>

        {/* Menu */}
        <nav className="mt-10 flex flex-col gap-3">
          {/* Analyze Contracts */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FileText size={18} />
            Analyze Contracts
          </NavLink>

          {/* Settings Page */}
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <SettingsIcon size={18} />
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Footer */}
      <p className="text-gray-300 text-xs opacity-70 text-center">
        © {new Date().getFullYear()} SafeContract AI
      </p>
    </aside>
  );
}

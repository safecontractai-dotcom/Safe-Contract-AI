import { Bell } from "lucide-react";
import { useState } from "react";

export default function Notifications({ notifications = [] }) {
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell size={22} className="text-gray-700" />

        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-80 
            bg-white border border-gray-200 
            shadow-lg rounded-xl p-4 z-50
          "
        >
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>

          {notifications.length === 0 && (
            <p className="text-gray-500 text-sm">No notifications yet.</p>
          )}

          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                onClick={() => n.onClick && n.onClick()}
              >
                <p className="text-gray-800 text-sm">{n.message}</p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

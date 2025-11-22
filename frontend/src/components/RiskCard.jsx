import React from "react";

export default function RiskCard({ title, value, color }) {
  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl 
        border border-gray-200 
        rounded-2xl p-6 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-transform duration-300 hover:scale-[1.02]
      "
    >
      <p className="text-gray-500 text-sm font-medium">{title}</p>

      <h3
        className={`text-4xl font-extrabold mt-2 ${color} tracking-tight`}
      >
        {value}
      </h3>

      <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: "80%" }}
        ></div>
      </div>
    </div>
  );
}

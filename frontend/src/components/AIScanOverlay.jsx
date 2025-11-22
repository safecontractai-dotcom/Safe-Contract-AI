export default function AIScanOverlay({ step }) {
  return (
    <div
      className="
      fixed inset-0 bg-white/60 backdrop-blur-xl 
      flex flex-col items-center justify-center 
      z-[9999] transition
    "
    >
      {/* AI ORB */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse shadow-xl mb-6"></div>

      {/* WAVEFORM */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-8 bg-blue-600 rounded-full animate-wave-${i}`}
          ></div>
        ))}
      </div>

      {/* STEP TEXT */}
      <p className="text-gray-800 text-lg font-medium animate-fade-in">
        {step}
      </p>
    </div>
  );
}

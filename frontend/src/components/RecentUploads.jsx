export default function RecentUploads({ uploads, onSelect }) {
  return (
    <div
      className="
        bg-white/60 backdrop-blur-xl 
        border border-gray-200 
        shadow-lg rounded-2xl 
        p-6
      "
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Uploads
      </h2>

      {uploads.length === 0 && (
        <p className="text-gray-500 text-sm">No recent uploads yet.</p>
      )}

      <div className="space-y-4">
        {uploads.map((u, i) => (
          <div
            key={i}
            className="
              p-4 bg-white border border-gray-200  
              rounded-xl shadow-sm hover:shadow-md 
              cursor-pointer transition
            "
            onClick={() => onSelect(u)}
          >
            <p className="font-medium text-gray-800">{u.name}</p>
            <p className="text-sm text-gray-500">{u.time}</p>
            <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
              {u.risks} risks detected
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

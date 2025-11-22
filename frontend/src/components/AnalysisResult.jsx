import RiskCard from "./RiskCard";

export default function AnalysisResult({ result, jumpTo, setJumpTo }) {
  if (!result) return null;

  const { risk_evaluation, llm_summary } = result;

  return (
    <div id="analysis-report" className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Contract Analysis Report
        </h1>
        <p className="text-gray-500">
          AI-powered legal breakdown of risks, missing clauses and contractual
          weaknesses.
        </p>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskCard
          title="Missing Clauses"
          value={risk_evaluation.missing_clauses.length}
          color="text-yellow-500"
        />
        <RiskCard
          title="Detected Risks"
          value={risk_evaluation.present_risks.length}
          color="text-red-500"
        />
        <RiskCard title="AI Status" value="Completed" color="text-green-600" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-10">
        {/* FULL WIDTH ANALYSIS NOW */}
        <div className="col-span-12 flex flex-col gap-10">
          {/* AI SUMMARY */}
          <section className="bg-white rounded-3xl shadow-xl p-8 border">
            <h2 className="text-2xl font-semibold mb-4">AI Legal Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {llm_summary}
            </p>
          </section>

          {/* MISSING CLAUSES */}
          <section className="bg-white rounded-3xl shadow-xl p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Missing Clauses</h2>
            <div className="grid grid-cols-2 gap-4">
              {risk_evaluation.missing_clauses.map((c, i) => (
                <div
                  key={i}
                  className="
                    flex items-center gap-2 
                    px-4 py-3 
                    bg-yellow-50 border border-yellow-200 
                    rounded-xl font-medium text-yellow-800
                  "
                >
                  ⚠️ {c}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* DETECTED RISKS */}
      <section className="bg-white rounded-3xl shadow-xl p-8 border">
        <h2 className="text-2xl font-semibold mb-6">Detected Risks</h2>

        <div className="space-y-5">
          {risk_evaluation.present_risks.map((r, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-red-50 border border-red-200"
            >
              <p className="text-red-800 font-medium mb-3">🚨 {r}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setJumpTo({ type: "explain", text: r })}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Explain
                </button>

                <button
                  onClick={() => setJumpTo({ type: "rewrite", text: r })}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Rewrite Safer Clause
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

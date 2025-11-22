import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Sparkles,
  Scale,
  Clock,
  Brain,
  CheckCircle,
  Star,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* NAVBAR */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-sm py-4 px-10 flex justify-between items-center border-b border-gray-200 fixed top-0 z-50">
        <span
          className="text-2xl font-extrabold text-blue-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          SafeContract AI
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-36 pb-24 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900">
          AI Contract Intelligence for{" "}
          <span className="text-blue-700">Smarter Legal Decisions</span>
        </h1>
        <p className="mt-5 text-gray-600 text-lg max-w-3xl mx-auto">
          Detect risks, rewrite clauses, ensure compliance and protect your
          business contracts in seconds.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <button
            className="bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-800"
            onClick={() => navigate("/signup")}
          >
            Start Free Trial
          </button>
          <button
            className="text-blue-700 hover:underline"
            onClick={() =>
              document
                .getElementById("pricing")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            View Pricing →
          </button>
        </div>
      </section>

      {/* WHY TRUST US */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl text-center font-bold mb-10">
          Why Teams Trust SafeContract AI
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-10">
          {[
            {
              icon: ShieldCheck,
              title: "Advanced Risk AI",
              desc: "Pinpoints legal vulnerabilities instantly",
            },
            {
              icon: Brain,
              title: "Context Intelligence",
              desc: "Understands real legal intent",
            },
            {
              icon: Clock,
              title: "Speed & Efficiency",
              desc: "Review contracts 10x faster",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl shadow-md border bg-gradient-to-br from-blue-50 to-white text-center"
            >
              <f.icon className="text-blue-700 mx-auto" size={40} />
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="text-sm mt-2 text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <h2 className="text-4xl font-bold text-center mb-4">
          Flexible Pricing
        </h2>
        <div className="flex justify-center mb-10">
          <div className="bg-white shadow rounded-full p-1 flex">
            {["monthly", "yearly"].map((mode) => (
              <button
                key={mode}
                onClick={() => setBilling(mode)}
                className={`px-6 py-2 rounded-full font-semibold ${
                  billing === mode ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
              >
                {mode === "monthly" ? "Monthly" : "Yearly (Save 20%)"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-10">
          {/* FREE */}
          <div className="p-8 border rounded-2xl shadow">
            <h3 className="font-bold text-xl">Free</h3>
            <p className="text-3xl font-bold mt-2">₹0</p>
            <ul className="mt-4 space-y-2">
              <li>
                <CheckCircle size={14} /> 3 contracts/month
              </li>
              <li>
                <CheckCircle size={14} /> Basic summary
              </li>
            </ul>
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>

          {/* PRO - MOST POPULAR */}
          <div className="p-8 border-2 border-blue-600 rounded-2xl shadow-xl relative">
            <span className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm animate-pulse">
              ⭐ Most Popular
            </span>
            <h3 className="font-bold text-xl">Professional</h3>
            <p className="text-3xl font-bold mt-2">
              {billing === "monthly" ? "₹499/mo" : "₹4799/yr"}
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <CheckCircle size={14} /> OCR + Rewrite
              </li>
              <li>
                <CheckCircle size={14} /> AI Assistant
              </li>
              <li>
                <CheckCircle size={14} /> Clause Improvement
              </li>
            </ul>
            <button
              className="mt-6 w-full bg-blue-700 text-white py-2 rounded"
              onClick={() => navigate("/signup")}
            >
              Upgrade
            </button>
          </div>

          {/* BUSINESS */}
          <div className="p-8 border rounded-2xl shadow">
            <h3 className="font-bold text-xl">Business</h3>
            <p className="text-3xl font-bold mt-2">
              {billing === "monthly" ? "₹1499/mo" : "₹13999/yr"}
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <CheckCircle size={14} /> Team dashboard
              </li>
              <li>
                <CheckCircle size={14} /> Unlimited scans
              </li>
            </ul>
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
              onClick={() => navigate("/signup")}
            >
              Get Business
            </button>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON */}
      <section className="py-20 bg-white px-10">
        <h2 className="text-3xl text-center font-bold mb-10">
          Feature Comparison
        </h2>
        <table className="w-full max-w-5xl mx-auto border text-center">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-4">Feature</th>
              <th>Free</th>
              <th>Pro</th>
              <th>Business</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Risk Detection", "✅", "✅", "✅"],
              ["AI Assistant", "❌", "✅", "✅"],
              ["Rewrite Clauses", "❌", "✅", "✅"],
              ["Team Access", "❌", "❌", "✅"],
            ].map((row, i) => (
              <tr key={i} className="border-t">
                {row.map((col, j) => (
                  <td key={j} className="p-3">
                    {col}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 text-center bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-3xl font-bold mb-10">Trusted by Professionals</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-10">
          {["Law Firm Partner", "Startup Founder", "Compliance Head"].map(
            (role, i) => (
              <div key={i} className="p-6 bg-white shadow rounded-xl text-left">
                <Star className="text-yellow-500" />
                <p className="mt-3 text-gray-600 italic">
                  "SafeContract saved us hours and avoided critical risks."
                </p>
                <p className="mt-3 font-bold">{role}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-800 text-white py-8 text-center">
        © {new Date().getFullYear()} SafeContract AI – Enterprise Legal
        Intelligence
      </footer>
    </div>
  );
}

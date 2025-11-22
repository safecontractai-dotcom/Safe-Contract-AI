import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { User, Mail, Crown, Save, Check } from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Settings() {
  // ================= USER PROFILE =================
  const [userData, setUserData] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // ✅ Plan switch state
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          setEditableName(data.name);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleProfileUpdate = async () => {
    if (!editableName.trim()) return alert("Name cannot be empty");

    try {
      setSavingProfile(true);
      const ref = doc(db, "users", auth.currentUser.uid);
      await updateDoc(ref, { name: editableName });
      setUserData({ ...userData, name: editableName });
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ✅ Razorpay redirect logic
  const handleUpgrade = (newPlan) => {
    const uid = auth.currentUser.uid;
    const email = auth.currentUser.email;

    if (newPlan === "pro") {
      window.location.href = `https://rzp.io/rzp/3KJpKuv2?uid=${uid}&plan=pro&email=${email}`;
    }

    if (newPlan === "business") {
      alert("Business plan payment page not created yet.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar />

      <div className="ml-64 w-full">
        <Navbar />

        <div className="pt-28 px-16 pb-20">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mb-10">
            Customize your SafeContract AI experience
          </p>

          {/* ================= USER PROFILE ================= */}
          {userData && (
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-200 mb-16">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="text-blue-600" />
                    <input
                      value={editableName}
                      onChange={(e) => setEditableName(e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="text-blue-600" />
                    <input
                      value={userData.email}
                      disabled
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleProfileUpdate}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl"
                >
                  <Save size={18} />
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* ================= SEXY PLANS SECTION ================= */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Choose Your Plan
              </h2>

              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    billingCycle === "monthly"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    billingCycle === "yearly"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* FREE PLAN */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold">Free</h3>
                <p className="text-gray-500 mb-4">For casual users</p>
                <p className="text-3xl font-bold mb-4">₹0</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check size={16} /> 3 contracts/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Basic AI analysis
                  </li>
                </ul>
              </div>

              {/* PRO PLAN */}
              <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-2xl scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Pro</h3>
                  <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </span>
                </div>

                <p className="opacity-90 mb-4">Best for professionals</p>
                <p className="text-3xl font-bold mb-4">
                  {billingCycle === "monthly" ? "₹499/mo" : "₹4799/yr"}
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check size={16} /> 20 contracts/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Advanced risk detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Priority processing
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade("pro")}
                  className="mt-6 w-full py-3 bg-white text-blue-700 font-semibold rounded-xl"
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* BUSINESS PLAN */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold">Business</h3>
                <p className="text-gray-500 mb-4">Unlimited power</p>
                <p className="text-3xl font-bold mb-4">Custom</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Unlimited contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Enterprise AI engine
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} /> Dedicated support
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade("business")}
                  className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl"
                >
                  Contact for Business
                </button>
              </div>
            </div>
          </div>

          {/* EXISTING AI SETTINGS REMAIN BELOW */}
        </div>
      </div>
    </div>
  );
}

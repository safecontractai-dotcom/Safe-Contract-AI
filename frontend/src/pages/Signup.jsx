import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName,
      });

      // ✅ Store user profile + subscription in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: email,
        plan: "free",
        contractsUsed: 0,
        contractLimit: 3,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // ✅ Redirect ONLY after success
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white relative overflow-hidden">
      <div className="absolute top-16 left-24 w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/40 rounded-full blur-2xl"></div>

      <div className="hidden md:flex flex-col justify-center w-1/2 px-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          SafeContract AI
        </h1>
        <p className="text-blue-100 mt-6 text-lg max-w-md leading-relaxed">
          Build safer contracts with AI-powered risk insights. Join teams using
          SafeContract AI for smarter legal decisions.
        </p>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 p-10">
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">
            Create Your Account
          </h2>

          <div className="mb-4">
            <label className="text-blue-100 text-sm font-medium">
              Full Name
            </label>
            <div className="flex items-center gap-3 mt-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl">
              <User size={18} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-blue-100 text-sm font-medium">Email</label>
            <div className="flex items-center gap-3 mt-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-blue-100 text-sm font-medium">
              Password
            </label>
            <div className="flex items-center gap-3 mt-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                placeholder="Create a password"
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-blue-100 mt-6">
            Already have an account?{" "}
            <span
              className="text-white font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

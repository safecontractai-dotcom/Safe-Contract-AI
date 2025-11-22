import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email + Password Login
  const handleLogin = async () => {
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ Update last login timestamp
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // ✅ If user doesn't exist, create profile
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Google User",
          email: user.email,
          plan: "free",
          contractsUsed: 0,
          contractLimit: 3,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });
      }

      navigate("/dashboard");
    } catch (error) {
      alert("Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-400/30 rounded-full blur-2xl"></div>

      <div className="hidden md:flex flex-col justify-center w-1/2 px-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          SafeContract AI
        </h1>
        <p className="text-blue-100 mt-6 text-lg leading-relaxed max-w-md">
          AI-powered contract intelligence that detects risks, missing clauses,
          and compliance issues — before they become costly mistakes.
        </p>

        <div className="mt-10 flex gap-3 text-blue-100">
          <div className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/20">
            AI Risk Detection
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/20">
            Missing Clauses
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/20">
            Legal Summaries
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 p-10">
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">
            Welcome Back
          </h2>

          <div className="mb-4">
            <label className="text-blue-100 text-sm font-medium">Email</label>
            <div className="flex items-center gap-3 mt-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center my-6 text-blue-200">
            <div className="flex-1 h-px bg-blue-300/30"></div>
            <p className="px-4 text-sm">OR</p>
            <div className="flex-1 h-px bg-blue-300/30"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white/20 border border-white/30 py-3 rounded-xl hover:bg-white/30 transition disabled:opacity-60"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-center text-blue-100 mt-6">
            New here?{" "}
            <span
              className="text-white font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

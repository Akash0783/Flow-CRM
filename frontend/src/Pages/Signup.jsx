import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../api";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    

      // Step 1: Signup request
      await api.post("/auth/signup", { username, email, password });

      // Step 2: Auto-login after signup
      const loginRes = await api.post("/auth/login", { email, password });

      // ✅ Call context login
      login(loginRes.data.user, loginRes.data.token);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Gradient decorations */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-3xl"></div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
        <p className="text-gray-600 mb-8 text-center">Sign up to start using MyCRM</p>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-semibold rounded-2xl hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

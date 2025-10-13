// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // ✅ Correct axios usage
      const res = await axiosInstance.post("/auth/forgot-password", { email });

      // axios already parses JSON
      setMsg(res.data.message || "If an account exists, a reset link has been sent.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">Forgot password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 text-white py-2 rounded"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {msg && <p className="mt-4 text-sm text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}

// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 6) return setMsg("Password must be at least 6 characters");
    if (password !== confirm) return setMsg("Passwords do not match");

    try {
      setLoading(true);

      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        email,
        password,
      });

      toast.success("Password updated. Redirecting to login...");
      setMsg("Password updated. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Unable to reset password");
      setLoading(false);
    }
  }

  if (!token || !email) {
    return <div className="p-6">Invalid reset link.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow relative">
        <h2 className="text-xl font-bold mb-2">Set a new password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            required
            value={confirm}
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            className="w-full bg-sky-500 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset password"}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex flex-col items-center justify-center rounded-xl">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-700">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}


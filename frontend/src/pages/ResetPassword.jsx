// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, LockKeyhole, CheckCircle2 } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query    = useQuery();
  const token    = query.get("token");
  const email    = query.get("email");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [msg, setMsg]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) return setMsg("Password must be at least 6 characters");
    if (password !== confirm) return setMsg("Passwords do not match");
    try {
      setLoading(true);
      await axiosInstance.post("/auth/reset-password", { token, email, password });
      toast.success("Password updated. Redirecting to login...");
      setMsg("success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Unable to reset password");
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <>
        <style>{styles}</style>
        <div className="rp-page">
          <div className="rp-card" style={{ textAlign: "center", padding: "48px 40px" }}>
            <div className="rp-icon-ring" style={{ background: "linear-gradient(135deg,#fee2e2,#fecaca)", borderColor: "rgba(252,165,165,0.5)" }}>
              <LockKeyhole size={28} color="#dc2626" />
            </div>
            <h2 className="rp-title">Invalid link</h2>
            <p className="rp-subtitle">This password reset link is invalid or has expired.</p>
            <button className="btn-reset" style={{ marginTop: 24 }} onClick={() => navigate("/forgot-password")}>
              Request a new link
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="rp-page">
        <div className="rp-card">

          {/* Icon */}
          <div className="rp-icon-ring">
            <LockKeyhole size={28} color="#2563eb" />
          </div>

          <h2 className="rp-title">Set new password</h2>
          <p className="rp-subtitle">
            Creating a new password for<br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="rp-form">

            {/* New password */}
            <div className="rp-field">
              <label className="rp-label">New password</label>
              <div className="rp-input-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  placeholder="Min. 6 characters"
                  onChange={(e) => { setPassword(e.target.value); setMsg(""); }}
                  className="rp-input"
                />
                <button type="button" className="rp-eye" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              <div className="strength-wrap">
                {[1,2,3,4].map(i => (
                  <div key={i} className="strength-seg" style={{
                    background: password.length === 0 ? "#e2e8f0"
                      : password.length < 6 ? (i <= 1 ? "#ef4444" : "#e2e8f0")
                      : password.length < 9 ? (i <= 2 ? "#f59e0b" : "#e2e8f0")
                      : password.length < 12 ? (i <= 3 ? "#3b82f6" : "#e2e8f0")
                      : "#22c55e"
                  }} />
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div className="rp-field">
              <label className="rp-label">Confirm password</label>
              <div className="rp-input-wrap">
                <input
                  type={showCf ? "text" : "password"}
                  required
                  value={confirm}
                  placeholder="Repeat your password"
                  onChange={(e) => { setConfirm(e.target.value); setMsg(""); }}
                  className={`rp-input ${confirm && (confirm === password ? "match" : "no-match")}`}
                />
                <button type="button" className="rp-eye" onClick={() => setShowCf(!showCf)}>
                  {showCf ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {msg && msg !== "success" && (
              <p className="rp-error">{msg}</p>
            )}

            {/* Success state */}
            {msg === "success" ? (
              <div className="rp-success">
                <CheckCircle2 size={20} color="#16a34a" />
                <span>Password updated! Redirecting…</span>
              </div>
            ) : (
              <button type="submit" disabled={loading} className="btn-reset">
                {loading
                  ? <><Loader2 size={17} className="rp-spin" /> Processing…</>
                  : "Reset password"}
              </button>
            )}

          </form>

          <p className="back-link">
            Remember it?{" "}
            <button onClick={() => navigate("/login")}>Back to login</button>
          </p>

        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .rp-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f6ff;
    font-family: 'Sora', sans-serif;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .rp-page::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 420px; height: 420px;
    background: radial-gradient(circle, #bfdbfe 0%, transparent 70%);
    pointer-events: none;
  }

  .rp-page::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -100px;
    width: 380px; height: 380px;
    background: radial-gradient(circle, #e0f2fe 0%, transparent 70%);
    pointer-events: none;
  }

  .rp-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 4px 6px -1px rgba(14,63,126,0.06), 0 20px 60px -10px rgba(14,63,126,0.12);
    border: 1px solid rgba(186,220,255,0.6);
    position: relative;
    z-index: 1;
    animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .rp-icon-ring {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    border: 2px solid rgba(147,197,253,0.5);
    animation: iconPop 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  .rp-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 8px;
    letter-spacing: -0.3px;
  }

  .rp-subtitle {
    font-size: 13.5px;
    color: #64748b;
    text-align: center;
    margin: 0 0 32px;
    line-height: 1.6;
  }

  .rp-subtitle strong { color: #1e40af; font-weight: 600; }

  .rp-form { display: flex; flex-direction: column; gap: 18px; }

  .rp-field { display: flex; flex-direction: column; gap: 6px; }

  .rp-label {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
  }

  .rp-input-wrap { position: relative; }

  .rp-input {
    width: 100%;
    padding: 12px 42px 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #0f172a;
    outline: none;
    transition: all 0.18s ease;
    box-sizing: border-box;
  }

  .rp-input:focus {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
  }

  .rp-input.match   { border-color: #22c55e; background: #f0fdf4; }
  .rp-input.no-match { border-color: #f87171; background: #fff5f5; }

  .rp-eye {
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: #94a3b8; cursor: pointer;
    padding: 0; display: flex;
    transition: color 0.15s;
  }
  .rp-eye:hover { color: #3b82f6; }

  .strength-wrap {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }

  .strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 99px;
    transition: background 0.3s ease;
  }

  .rp-error {
    font-size: 13px;
    color: #dc2626;
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    margin: 0;
  }

  .rp-success {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #16a34a;
  }

  .btn-reset {
    width: 100%;
    padding: 13px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
  }

  .btn-reset:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.4);
  }

  .btn-reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .rp-spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .back-link {
    text-align: center;
    margin-top: 20px;
    font-size: 12.5px;
    color: #94a3b8;
  }

  .back-link button {
    background: none; border: none;
    color: #3b82f6; font-weight: 600;
    cursor: pointer; font-family: 'Sora', sans-serif;
    font-size: 12.5px; padding: 0;
  }

  .back-link button:hover { text-decoration: underline; }
`;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [msg, setMsg]         = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const navigate              = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      setMsg(res.data.message || "If an account exists, a reset link has been sent.");
      setSent(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="fp-page">
        <div className="fp-card">

          {!sent ? (
            <>
              {/* Icon */}
              <div className="fp-icon-ring">
                <Mail size={28} color="#2563eb" />
              </div>

              <h2 className="fp-title">Forgot password?</h2>
              <p className="fp-subtitle">
                No worries — enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="fp-form">
                <div className="fp-field">
                  <label className="fp-label">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="fp-input"
                  />
                </div>

                {msg && !sent && (
                  <p className="fp-error">{msg}</p>
                )}

                <button type="submit" disabled={loading} className="fp-btn">
                  {loading
                    ? <><Loader2 size={17} className="fp-spin" /> Sending…</>
                    : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="fp-icon-ring success">
                <CheckCircle2 size={30} color="#16a34a" />
              </div>

              <h2 className="fp-title">Check your inbox</h2>
              <p className="fp-subtitle">
                {msg}
              </p>

              <div className="fp-email-badge">
                <Mail size={14} />
                {email}
              </div>

              <p className="fp-hint">
                Didn't receive it? Check your spam folder or{" "}
                <button className="fp-retry" onClick={() => { setSent(false); setMsg(""); }}>
                  try again
                </button>.
              </p>
            </>
          )}

          {/* Back to login */}
          <button className="fp-back" onClick={() => navigate("/login")}>
            <ArrowLeft size={15} />
            Back to login
          </button>

        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .fp-page {
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

  .fp-page::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 420px; height: 420px;
    background: radial-gradient(circle, #bfdbfe 0%, transparent 70%);
    pointer-events: none;
  }

  .fp-page::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -100px;
    width: 380px; height: 380px;
    background: radial-gradient(circle, #e0f2fe 0%, transparent 70%);
    pointer-events: none;
  }

  .fp-card {
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

  .fp-icon-ring {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    border: 2px solid rgba(147,197,253,0.5);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    animation: iconPop 0.6s 0.15s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  .fp-icon-ring.success {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border-color: rgba(134,239,172,0.5);
  }

  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }

  .fp-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 8px;
    letter-spacing: -0.3px;
  }

  .fp-subtitle {
    font-size: 13.5px;
    color: #64748b;
    text-align: center;
    line-height: 1.7;
    margin: 0 0 28px;
  }

  .fp-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .fp-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fp-label {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
  }

  .fp-input {
    width: 100%;
    padding: 12px 16px;
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

  .fp-input:focus {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
  }

  .fp-error {
    font-size: 13px;
    color: #dc2626;
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    margin: 0;
  }

  .fp-btn {
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

  .fp-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.4);
  }

  .fp-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .fp-spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fp-email-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    border-radius: 99px;
    padding: 7px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #1d4ed8;
    margin: 0 auto 20px;
    width: fit-content;
    display: flex;
  }

  .fp-hint {
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
    margin: 0 0 4px;
    line-height: 1.6;
  }

  .fp-retry {
    background: none; border: none;
    color: #3b82f6; font-weight: 600;
    cursor: pointer; font-family: 'Sora', sans-serif;
    font-size: 13px; padding: 0;
  }

  .fp-retry:hover { text-decoration: underline; }

  .fp-back {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 24px;
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: color 0.15s;
    padding: 0;
  }

  .fp-back:hover { color: #3b82f6; }
`;

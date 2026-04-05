import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const VerifyOTP = () => {
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [timer, setTimer]     = useState(600);
  const [loading, setLoading] = useState(false);
  const inputRefs             = useRef([]);
  const navigate              = useNavigate();
  const location              = useLocation();
  const { verifyOTP, resendOTP, pendingEmail } = useAuthStore();

  const email = location.state?.email || pendingEmail;

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    const success = await verifyOTP({ email, otp: code });
    setLoading(false);
    if (success) navigate("/dashboard");
  };

  const handleResend = async () => {
    await resendOTP(email);
    setTimer(600);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const filled = otp.filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        .otp-page {
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

        .otp-page::before {
          content: '';
          position: absolute;
          top: -120px; left: -120px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, #bfdbfe 0%, transparent 70%);
          pointer-events: none;
        }

        .otp-page::after {
          content: '';
          position: absolute;
          bottom: -100px; right: -100px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, #e0f2fe 0%, transparent 70%);
          pointer-events: none;
        }

        .otp-card {
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

        .otp-icon-ring {
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

        .otp-icon-ring svg {
          width: 30px; height: 30px;
          color: #2563eb;
        }

        .otp-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin: 0 0 8px;
          letter-spacing: -0.3px;
        }

        .otp-subtitle {
          font-size: 13.5px;
          color: #64748b;
          text-align: center;
          margin: 0 0 32px;
          line-height: 1.6;
        }

        .otp-subtitle strong {
          color: #1e40af;
          font-weight: 600;
        }

        .otp-inputs {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 8px;
        }

        .otp-input {
          width: 42px; height: 60px;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          outline: none;
          transition: all 0.18s ease;
          caret-color: #2563eb;
        }

        .otp-input:focus {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
          transform: translateY(-2px);
        }

        .otp-input.filled {
          border-color: #2563eb;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .progress-bar-wrap {
          height: 3px;
          background: #e2e8f0;
          border-radius: 99px;
          margin: 16px 0 20px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #0ea5e9);
          border-radius: 99px;
          transition: width 0.3s ease;
        }

        .otp-timer {
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace;
        }

        .otp-timer .time {
          color: #3b82f6;
          font-weight: 600;
        }

        .otp-timer .expired {
          color: #ef4444;
          font-weight: 600;
        }

        .btn-verify {
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
          letter-spacing: 0.1px;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }

        .btn-verify:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }

        .btn-verify:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .divider-line {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: #cbd5e1;
          font-size: 12px;
        }

        .divider-line::before,
        .divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .btn-resend {
          width: 100%;
          padding: 11px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: transparent;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-resend:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #2563eb;
          background: #eff6ff;
        }

        .btn-resend:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .back-link {
          text-align: center;
          margin-top: 20px;
          font-size: 12.5px;
          color: #94a3b8;
        }

        .back-link button {
          background: none;
          border: none;
          color: #3b82f6;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12.5px;
          padding: 0;
        }

        .back-link button:hover { text-decoration: underline; }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
          .support-text {
  text-align: center;
  font-size: 12.5px;
  color: #94a3b8;
  margin-top: 14px;
  line-height: 1.5;
}

.support-text a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.support-text a:hover {
  text-decoration: underline;
}

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="otp-page">
        <div className="otp-card">

          {/* Icon */}
          <div className="otp-icon-ring">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <h2 className="otp-title">Check your inbox</h2>
          <p className="otp-subtitle">
            We sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`otp-input ${digit ? "filled" : ""}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${(filled / 6) * 100}%` }} />
            </div>

            {/* Timer */}
            <p className="otp-timer">
              {timer > 0
                ? <>Expires in <span className="time">{formatTime(timer)}</span></>
                : <span className="expired">Code expired — request a new one</span>
              }
            </p>

            <button
              type="submit"
              disabled={filled < 6 || loading}
              className="btn-verify"
            >
              {loading ? <><div className="spinner" /> Verifying…</> : "Verify Email"}
            </button>
          </form>

          <div className="divider-line">or</div>

          <button
            onClick={handleResend}
            disabled={timer > 540}
            className="btn-resend"
          >
            {timer > 540
              ? `Resend available in ${formatTime(timer - 540)}`
              : "Resend code"}
          </button>
          <p className="support-text">
  Didn’t get the code? Contact support at{" "}
  <a href="mailto:support@yourapp.com">digitalwealth38@gmail.com</a>
</p>

          <p className="back-link">
            Wrong email?{" "}
            <button onClick={() => navigate("/signup")}>Go back</button>
          </p>

        </div>
      </div>
    </>
  );
};

export default VerifyOTP;
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoggingIn, handleGoogleLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.email?.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
    const valid = validateForm();
    if (valid !== true) return;

    const result = await login(formData);
    console.log(result)

    // ✅ redirect to OTP page if email not verified
    if (result?.requiresVerification) {
      navigate("/verify-otp", { state: { email: result.email } });
    }
  };

  /* ---------- visual-only helpers ---------- */
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const perks = [
    { icon: <TrendingUp size={18} />, title: "Daily Profit Plans", sub: "Smart, consistent growth" },
    { icon: <ShieldCheck size={18} />, title: "Encrypted & Secure", sub: "Your funds stay protected" },
    { icon: <Zap size={18} />, title: "Instant Withdrawals", sub: "Anytime, hassle-free" },
  ];

  const particles = [
    { l: "10%", t: "14%", s: 8, d: "0s" },
    { l: "28%", t: "78%", s: 6, d: "-2s" },
    { l: "52%", t: "10%", s: 10, d: "-4s" },
    { l: "70%", t: "66%", s: 7, d: "-1s" },
    { l: "88%", t: "28%", s: 9, d: "-3s" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-sky-100 via-white to-sky-50 text-gray-800">
      <style>{`
        @keyframes lg-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,30px) scale(0.95); } }
        @keyframes lg-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes lg-drift { 0%,100% { transform: translate(0,0); opacity: .5; } 50% { transform: translate(14px,-26px); opacity: 1; } }
        @keyframes lg-gradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes lg-spin { to { transform: rotate(360deg); } }
        @keyframes lg-ring { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes lg-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .lg-blob { animation: lg-blob 14s ease-in-out infinite; }
        .lg-float { animation: lg-float 5s ease-in-out infinite; }
        .lg-float-slow { animation: lg-float 7s ease-in-out infinite; }
        .lg-drift { animation: lg-drift 9s ease-in-out infinite; }
        .lg-animbg { background-size: 200% 200%; animation: lg-gradient 8s ease infinite; }
        .lg-spin { animation: lg-spin 30s linear infinite; }
        .lg-ring { animation: lg-ring 3.5s ease-out infinite; }
        .lg-shimmer { background-size: 200% auto; animation: lg-shimmer 4s linear infinite; }
        .lg-grid { background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 44px 44px; }
        .lg-grid-light { background-image: linear-gradient(rgba(2,132,199,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(2,132,199,0.07) 1px, transparent 1px); background-size: 40px 40px; }
        @media (prefers-reduced-motion: reduce) {
          .lg-blob, .lg-float, .lg-float-slow, .lg-drift, .lg-animbg, .lg-spin, .lg-ring, .lg-shimmer { animation: none !important; }
        }
      `}</style>

      {/* page background decoration (visible mostly on mobile) */}
      <div className="absolute inset-0 lg-grid-light [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] lg:hidden" />
      <div className="lg-blob absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-300/40 blur-3xl lg:hidden" />
      <div className="lg-blob absolute bottom-0 -right-24 w-72 h-72 rounded-full bg-indigo-300/30 blur-3xl [animation-delay:-6s] lg:hidden" />

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* ================= LEFT BRAND PANEL (desktop) ================= */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 lg-animbg p-12 xl:p-16 text-white">
          <div className="absolute inset-0 lg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <div className="lg-blob absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-sky-300/25 blur-3xl" />
          <div className="lg-blob absolute bottom-[-8rem] right-[-6rem] w-[30rem] h-[30rem] rounded-full bg-indigo-400/25 blur-3xl [animation-delay:-6s]" />
          <div className="absolute -right-40 top-1/3 w-[32rem] h-[32rem] rounded-full border border-dashed border-white/20 lg-spin" />
          {particles.map((p, i) => (
            <span
              key={i}
              className="lg-drift absolute rounded-full bg-white/70"
              style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: p.d }}
            />
          ))}

          {/* top brand */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="relative flex items-center gap-3"
          >
            <div className="relative w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center font-black text-lg shadow-lg">
              D
              <span className="absolute inset-0 rounded-xl border border-white/50 lg-ring" />
            </div>
            <div className="text-2xl font-black tracking-tighter">
              DIGITAL <span className="text-sky-200">WEALTH</span>
            </div>
          </motion.div>

          {/* middle copy */}
          <div className="relative max-w-lg">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] uppercase bg-white/10 backdrop-blur border border-white/25 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Welcome Back
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-5xl xl:text-6xl font-black leading-[1.02] tracking-tight mb-6"
            >
              Log in and keep{" "}
              <span className="lg-shimmer text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-200 italic">
                growing
              </span>{" "}
              your wealth.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="text-sky-100/90 leading-relaxed mb-10"
            >
              Track your plans, check your earnings and withdraw whenever you want,
              all from one secure dashboard.
            </motion.p>

            <div className="grid gap-3">
              {perks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial="hidden"
                  animate="visible"
                  custom={4 + i}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-xl shadow-black/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">{p.icon}</div>
                  <div>
                    <p className="text-sm font-black">{p.title}</p>
                    <p className="text-xs text-sky-100/80">{p.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* bottom stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={8}
            variants={fadeUp}
            className="relative grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
          >
            {[
              { n: "12k+", l: "Active Investors" },
              { n: "24/7", l: "Platform Access" },
              { n: "3", l: "Ways To Earn" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-black tracking-tighter">{s.n}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-200">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="hidden lg:block absolute inset-0 lg-grid-light [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="hidden lg:block lg-blob absolute top-10 right-10 w-72 h-72 rounded-full bg-sky-200/50 blur-3xl" />

          {/* floating chips (tablet+) */}
          <div className="hidden sm:block lg-float absolute top-10 left-6 lg:left-10 z-10">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl shadow-sky-200/60 border border-sky-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white">📈</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daily Profit</p>
                <p className="text-sm font-black text-gray-900">Smart Plans</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block lg-float-slow absolute bottom-10 right-6 lg:right-10 z-10">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl shadow-sky-200/60 border border-sky-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white">🔒</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Protected</p>
                <p className="text-sm font-black text-gray-900">Encrypted Funds</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-full max-w-md"
          >
            {/* glow behind card */}
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-sky-300/50 via-transparent to-indigo-300/50 blur-2xl" />

            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-6 sm:p-9 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(2,132,199,0.35)] border border-sky-100">
              {/* top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-600 lg-animbg" />

              {/* Logo + App Name */}
              <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-sky-300/40 blur-2xl scale-110" />
                  <img
                    src="/logo.png"
                    alt="Digital Wealth Logo"
                    className="relative h-24 sm:h-28 w-auto object-contain drop-shadow-lg"
                  />
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                  Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Back</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500 font-medium">Login to continue to your account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 ">
                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className="w-full bg-sky-50/80 text-gray-800 pl-11 pr-4 py-3 rounded-xl border border-sky-100 outline-none transition-all focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-sky-50/80 text-gray-800 pl-11 pr-12 py-3 rounded-xl border border-sky-100 outline-none transition-all focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-100 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* 🔹 Forgot Password Link */}
                  <div className="text-right mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-sky-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-sky-500 via-blue-700 to-sky-500 lg-animbg text-white font-black py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-sky-300/60"
                >
                  <span className="relative z-10">
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-7 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>

                {/* OR Divider */}
                <div className="flex items-center justify-center my-3">
                  <div className="h-px bg-gradient-to-r from-transparent to-gray-300 flex-1"></div>
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest mx-3">or</span>
                  <div className="h-px bg-gradient-to-l from-transparent to-gray-300 flex-1"></div>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-sky-50 hover:border-sky-200 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm hover:shadow-lg hover:shadow-sky-100"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </button>
              </form>

              <p className="text-sm text-gray-600 text-center mt-6">
                Create Account?{" "}
                <Link
                  to="/signup"
                  className="text-sky-600 font-bold hover:text-blue-700 hover:underline"
                >
                  Signup here
                </Link>
              </p>

              {/* trust strip */}
              <div className="mt-6 pt-5 border-t border-sky-100 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-sky-500" /> Secure</span>
                <span className="inline-flex items-center gap-1.5"><Lock size={14} className="text-sky-500" /> Encrypted</span>
                <span className="inline-flex items-center gap-1.5"><Zap size={14} className="text-sky-500" /> Instant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
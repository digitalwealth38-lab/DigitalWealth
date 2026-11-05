import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';

/* ================= SMALL REUSABLE PIECES (visual only) ================= */

// Image with graceful fallback (if a photo fails to load, a gradient shows instead)
const Img = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700`}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

// Animated number counter
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

// 3D tilt on mouse move
const TiltCard = ({ children, className = '', strength = 8 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 150, damping: 15 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const marqueeItems = [
  'Secure Platform',
  'Daily Profit Plans',
  'Instant Withdrawals',
  'Network Earnings',
  'Crypto Opportunities',
  'Separate Rewards Program',
];

const navIds = ['home', 'about', 'how-it-works', 'Earn', 'testimonials'];

// Floating background particles (visual only)
const particles = [
  { l: '8%', t: '18%', s: 8, d: '0s' },
  { l: '22%', t: '70%', s: 6, d: '-2s' },
  { l: '46%', t: '12%', s: 10, d: '-4s' },
  { l: '63%', t: '82%', s: 7, d: '-1s' },
  { l: '78%', t: '26%', s: 9, d: '-3s' },
  { l: '92%', t: '60%', s: 6, d: '-5s' },
];

/* ================= HEADER (own component so menu state never re-mounts the page) ================= */
const Header = ({ onNav }) => {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    onNav(id);
  };

  return (
    <header className="py-3 bg-white/70 backdrop-blur-xl sticky top-0 z-[100] border-b border-sky-100/60 shadow-[0_8px_30px_-12px_rgba(2,132,199,0.25)]">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer" onClick={() => go('home')}>
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white font-black shadow-lg shadow-sky-300/50 group-hover:rotate-12 transition-transform duration-300">
            D
            <span className="absolute inset-0 rounded-xl border border-sky-300 dw-ring" />
          </div>
          <div className="text-base sm:text-xl md:text-2xl font-black text-gray-800 tracking-tighter">
            DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">WEALTH</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navIds.map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="relative text-xs font-bold text-gray-500 hover:text-sky-600 transition-all uppercase tracking-widest group py-1"
            >
              {id.replace('-', ' ')}
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            className="flex items-center justify-center h-9 px-3 sm:px-5 text-xs sm:text-sm font-bold text-sky-600 rounded-full border border-sky-100 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="flex items-center justify-center h-9 px-3 sm:px-5 text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-lg shadow-sky-300/50 hover:shadow-sky-400/60 hover:-translate-y-0.5 transition-all"
          >
            Sign Up
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-9 h-9 rounded-full border border-sky-100 bg-white/80 flex flex-col items-center justify-center gap-[5px]"
          >
            <span className={`block h-0.5 w-4 bg-sky-600 rounded transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 w-4 bg-sky-600 rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-4 bg-sky-600 rounded transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2 grid gap-2">
              {navIds.map((id, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => go(id)}
                  className="text-left px-4 py-3 rounded-xl bg-sky-50/80 text-xs font-black uppercase tracking-widest text-sky-700 active:bg-sky-100"
                >
                  {id.replace('-', ' ')}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Home = () => {
  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const fadeUpStagger = {
    hidden: { opacity: 0, y: 40 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" }
    })
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const Section = ({ children, id, className = "" }) => {
    const ref = useRef(null);
    const controls = useAnimation();
    const inView = useInView(ref, { margin: '-100px 0px', once: true });

    useEffect(() => {
      if (inView) controls.start('visible');
    }, [controls, inView]);

    return (
      <motion.section
        id={id}
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeUp}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

  // Scroll progress bar + hero parallax
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const heroImgY = useTransform(scrollY, [0, 700], [0, -60]);
  const blobY = useTransform(scrollY, [0, 700], [0, 120]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">

      {/* Custom animations */}
      <style>{`
        @keyframes dw-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes dw-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,30px) scale(0.95); } }
        @keyframes dw-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes dw-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes dw-ping-ring { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes dw-spin-slow { to { transform: rotate(360deg); } }
        @keyframes dw-pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.45); } 50% { box-shadow: 0 0 0 16px rgba(14,165,233,0); } }
        @keyframes dw-drift { 0%,100% { transform: translate(0,0); opacity: .5; } 50% { transform: translate(14px,-26px); opacity: 1; } }
        @keyframes dw-gradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .dw-marquee { animation: dw-marquee 28s linear infinite; }
        .dw-marquee:hover { animation-play-state: paused; }
        .dw-blob { animation: dw-blob 14s ease-in-out infinite; }
        .dw-float { animation: dw-float 5s ease-in-out infinite; }
        .dw-float-slow { animation: dw-float 7s ease-in-out infinite; }
        .dw-shimmer { background-size: 200% auto; animation: dw-shimmer 4s linear infinite; }
        .dw-ring { animation: dw-ping-ring 3.5s ease-out infinite; }
        .dw-spin-slow { animation: dw-spin-slow 30s linear infinite; }
        .dw-glow { animation: dw-pulse-glow 2.4s ease-out infinite; }
        .dw-drift { animation: dw-drift 9s ease-in-out infinite; }
        .dw-animbg { background-size: 200% 200%; animation: dw-gradient 8s ease infinite; }
        .dw-grid { background-image: linear-gradient(rgba(2,132,199,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(2,132,199,0.07) 1px, transparent 1px); background-size: 48px 48px; }
        @media (max-width: 640px) { .dw-grid { background-size: 32px 32px; } }
        @media (prefers-reduced-motion: reduce) {
          .dw-marquee, .dw-blob, .dw-float, .dw-float-slow, .dw-shimmer, .dw-ring, .dw-spin-slow, .dw-glow, .dw-drift, .dw-animbg { animation: none !important; }
        }
      `}</style>

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-600 z-[200]"
      />

      {/* Premium Header */}
      <Header onNav={handleScroll} />

      {/* Hero Section */}
      <section id="home" className="relative pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-32 overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
        {/* Background decoration */}
        <div className="absolute inset-0 dw-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <motion.div style={{ y: blobY }} className="absolute inset-0 pointer-events-none">
          <div className="dw-blob absolute -top-24 -left-24 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-sky-300/40 blur-3xl" />
          <div className="dw-blob absolute top-40 -right-24 sm:right-[-8rem] w-72 h-72 sm:w-[30rem] sm:h-[30rem] rounded-full bg-indigo-300/30 blur-3xl [animation-delay:-5s]" />
          <div className="dw-blob absolute bottom-[-10rem] left-1/3 w-64 h-64 sm:w-[26rem] sm:h-[26rem] rounded-full bg-blue-300/30 blur-3xl [animation-delay:-9s]" />
        </motion.div>
        {/* floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <span
              key={i}
              className="dw-drift absolute rounded-full bg-sky-400/60"
              style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: p.d }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <motion.div
            className="text-center lg:text-left"
            initial="hidden" animate="visible" variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}>
            <motion.div variants={fadeUp} className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 text-[9px] sm:text-[10px] font-black tracking-[0.12em] sm:tracking-[0.2em] whitespace-nowrap text-sky-700 uppercase bg-white/80 backdrop-blur border border-sky-100 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600" />
              </span>
              Trust & Transparency First
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 sm:mb-8 sm:leading-[0.95] tracking-tight">
              Build{' '}
              <span className="dw-shimmer inline-block pr-2 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-700 to-sky-400 italic">
                Your Wealth
              </span>{' '}
              <br className="hidden sm:block" />
              with Smart Investments
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Explore our investment products and digital earning opportunities,
              with a separate rewards program featuring eligible partner offers
              and activities.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-center lg:justify-start">
              <a
                href="/signup"
                className="group relative px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-black bg-gradient-to-r from-sky-500 via-blue-700 to-sky-500 dw-animbg text-white text-center rounded-2xl shadow-2xl shadow-sky-300/60 hover:scale-105 transition-all overflow-hidden dw-glow"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>

              <div className="flex items-center justify-center space-x-3 px-5 sm:px-6 py-3.5 sm:py-4 bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-lg shadow-sky-100/50">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
                  ].map((src, i) => (
                    <Img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={src} alt="user" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500 italic">12k+ Active Investors</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y: heroImgY }}
            className="relative mx-3 sm:mx-8 lg:mx-0"
          >
            {/* Spinning ring behind image */}
            <div className="absolute -inset-3 sm:-inset-6 rounded-[2.5rem] sm:rounded-[4rem] border border-dashed border-sky-300/60 dw-spin-slow" />
            <div className="absolute -inset-3 rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-tr from-sky-300/40 via-transparent to-indigo-300/40 blur-xl" />

            <TiltCard strength={6} className="relative z-10">
              <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(2,132,199,0.35)] border border-white/60 aspect-[4/3] sm:aspect-[5/4]">
                <Img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000"
                  alt="Investment Dashboard"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </TiltCard>

            {/* Floating Element 1 */}
            <div className="dw-float absolute -left-2 sm:-left-6 md:-left-12 top-6 sm:top-12 z-20 scale-90 sm:scale-100 origin-left">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-3.5 sm:px-5 py-3 sm:py-4 shadow-2xl shadow-sky-200/60 border border-sky-50 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-lg">📈</div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Daily Profit</p>
                  <p className="text-sm font-black text-gray-900">Smart Plans</p>
                </div>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div className="dw-float-slow absolute -right-2 sm:-right-4 md:-right-10 bottom-8 sm:bottom-16 z-20 scale-90 sm:scale-100 origin-right">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-3.5 sm:px-5 py-3 sm:py-4 shadow-2xl shadow-sky-200/60 border border-sky-50 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white text-lg">🔒</div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Protected</p>
                  <p className="text-sm font-black text-gray-900">Encrypted Funds</p>
                </div>
              </div>
            </div>

            {/* Floating Element 3 */}
            <div className="dw-float absolute right-4 sm:right-10 -top-5 sm:-top-8 z-20 [animation-delay:-2s]">
              <div className="bg-gradient-to-r from-sky-500 to-blue-700 text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-sky-300/60">
                ⚡ Instant Withdrawals
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="relative bg-gradient-to-r from-sky-600 via-blue-700 to-sky-600 py-4 sm:py-5 overflow-hidden border-y border-sky-400/30">
        <div className="flex w-max dw-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <div key={i} className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 text-white/95 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] whitespace-nowrap">
              <span>{t}</span>
              <span className="text-sky-200">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="relative -mt-0 py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {[
            { to: 12, suffix: 'k+', label: 'Active Investors' },
            { to: 3, suffix: '', label: 'Ways To Earn' },
            { to: 3, suffix: '', label: 'Simple Steps' },
            { to: 24, suffix: '/7', label: 'Platform Access' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 shadow-lg shadow-sky-100/40 group"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-sky-200/40 blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-blue-700 tracking-tighter">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="relative mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <Section id="about" className="relative py-16 sm:py-20 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-sky-100/60 rounded-full blur-3xl -z-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-sky-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Core Principles</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">DIGITAL WEALTH</span>
            </h3>
            <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-sky-400 to-blue-700" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '💹', title: 'High Returns', desc: 'Earn consistent profits with smart, diversified investment plans designed to maximize your returns.', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200' },
              { icon: '🔒', title: 'Secure Platform', desc: 'All funds are encrypted and protected. We prioritize your safety with top-notch security measures.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200' },
              { icon: '⚡', title: 'Instant Withdrawals', desc: 'Withdraw your profits anytime. Our platform ensures instant and hassle-free transactions.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200' },
            ].map((feature, i) => (
              <motion.div key={i} custom={i} variants={fadeUpStagger} className={i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <TiltCard strength={6} className="h-full">
                  <div className="relative h-full bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col group border border-sky-100 shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-300/40 transition-shadow duration-500">
                    <div className="relative h-48 sm:h-52">
                      <div className="absolute inset-0 overflow-hidden">
                        <Img src={feature.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={feature.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 via-sky-900/10 to-transparent" />
                        <div className="absolute top-4 right-4 text-xs font-black text-white/90 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
                          0{i + 1}
                        </div>
                      </div>
                      <div className="absolute -bottom-7 left-6 sm:left-8 z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xl shadow-sky-300/50 border border-sky-100 flex items-center justify-center text-2xl sm:text-3xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="p-6 sm:p-10 pt-10 sm:pt-12">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm font-medium">{feature.desc}</p>
                      <div className="mt-6 sm:mt-8 h-1 w-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-700 group-hover:w-full transition-all duration-500" />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <div className="absolute inset-0 dw-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-14 lg:gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-8 sm:mb-12 tracking-tighter leading-none text-center lg:text-left">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Works</span>
              </h2>
              <div className="relative space-y-6 sm:space-y-10">
                {/* Animated timeline line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="absolute left-7 top-8 bottom-8 w-0.5 origin-top bg-gradient-to-b from-sky-400 via-blue-500 to-transparent"
                />
                {[
                  { icon: '📝', title: 'Sign Up', desc: 'Create an account in minutes and access our investment platform easily.' },
                  { icon: '💰', title: 'Invest', desc: 'Choose your plan, deposit funds securely, and start earning profits daily.' },
                  { icon: '📈', title: 'Withdraw', desc: 'Track your earnings and withdraw profits instantly to your account anytime.' },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.7 }}
                    className="relative flex gap-4 sm:gap-6 items-start group"
                  >
                    <div className="relative w-14 h-14 shrink-0 bg-white border border-sky-100 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-sky-200/50 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-blue-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10">
                      {step.icon}
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white text-[10px] font-black flex items-center justify-center shadow-md">
                        {i + 1}
                      </span>
                    </div>
                    <div className="bg-white/70 backdrop-blur border border-sky-100 rounded-2xl p-4 sm:p-5 flex-1 shadow-md shadow-sky-100/40 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">{step.title}</h4>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative px-2 sm:px-6 lg:px-0 pb-6 lg:pb-0">
              <div className="absolute -inset-4 bg-gradient-to-tr from-sky-300/40 to-indigo-300/40 rounded-[3rem] blur-2xl" />
              <TiltCard strength={5} className="relative">
                <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-sky-300/40 border-4 border-white aspect-[4/3]">
                  <Img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1400" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Analytics" />
                </div>
              </TiltCard>
              <div className="dw-float absolute -bottom-2 sm:-bottom-6 left-0 sm:-left-4 md:-left-8 bg-white rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-2xl shadow-sky-300/50 border border-sky-50 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Setup</p>
                  <p className="text-sm font-black text-gray-900">Start in Minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Plans / Earn Section */}
      <Section id="Earn" className="relative py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="absolute -left-32 top-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              How You Can Grow <span className="dw-shimmer text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-700 to-sky-400">Earn</span>
            </h2>
            <p className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-4">
              Investment & Earning Opportunities
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Earn Profit with Plans', desc: 'Invest in our carefully designed investment plans and earn consistent daily profits.', icon: '💹', color: 'bg-white', text: 'text-gray-900', img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=900' },
              { title: 'Earn Profit with Network', desc: 'Refer others to join Digital Wealth and earn commissions from your network growth.', icon: '🌐', color: 'bg-white', text: 'text-gray-900', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=900' },
              {
                title: 'Earn Profit with Crypto',
                desc: 'Invest in select cryptocurrencies and enjoy potential high-yield crypto profits safely.',
                icon: '₿',
                color: 'bg-white',
                text: 'text-gray-900',
                img: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=900'
              },

            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUpStagger}
                className={`${item.color} ${item.text} ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''} relative rounded-[2rem] sm:rounded-[3rem] border border-sky-100 shadow-xl shadow-sky-100/30 group hover:-translate-y-3 sm:hover:-translate-y-4 hover:shadow-2xl hover:shadow-sky-300/50 transition-all duration-500 overflow-hidden`}
              >
                {/* hover gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-40 overflow-hidden">
                  <Img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                </div>
                <div className="relative p-7 sm:p-12 pt-4">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 opacity-90 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6 origin-left">{item.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 tracking-tight leading-tight">{item.title}</h3>
                  <p className={`font-medium text-sm leading-relaxed ${item.color === 'bg-white' ? 'text-gray-500' : 'text-sky-50'}`}>
                    {item.desc}
                  </p>
                  <div className={`mt-8 sm:mt-10 h-1.5 w-12 rounded-full group-hover:w-32 transition-all duration-500 ${item.color === 'bg-white' ? 'bg-gradient-to-r from-sky-400 to-blue-700' : 'bg-white'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-14 sm:mt-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 dw-animbg rounded-[2rem] sm:rounded-[3rem] p-7 sm:p-10 md:p-16 shadow-2xl shadow-sky-300/50">
            <div className="dw-blob absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
            <div className="dw-blob absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-sky-300/20 blur-2xl [animation-delay:-6s]" />
            <div className="absolute inset-0 dw-grid opacity-20" />
            <div className="relative max-w-3xl mx-auto text-center">

              <div className="dw-float inline-block text-5xl sm:text-6xl mb-5 sm:mb-6">🎁</div>

              <div>
                <span className="inline-block px-4 py-2 mb-5 text-[9px] sm:text-[10px] font-black
                  tracking-[0.2em] uppercase text-sky-700 bg-white rounded-full shadow-lg">
                  Separate Rewards Program
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-5">
                Earn Rewards Through Partner Offers
              </h3>

              <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl mx-auto mb-7 sm:mb-8">
                Complete eligible surveys, offers, and partner activities to earn
                rewards through our separate rewards program. Rewards are independent
                of our investment products and are not investment returns.
              </p>

              <a
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 bg-white text-sky-700
                font-black rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-black/20 transition-all"
              >
                Join & Explore Rewards
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="dw-blob absolute -top-32 left-1/4 w-72 h-72 sm:w-[30rem] sm:h-[30rem] rounded-full bg-sky-300/20 blur-3xl" />
        <div className="dw-blob absolute bottom-[-10rem] right-0 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-indigo-400/20 blur-3xl [animation-delay:-7s]" />
        <div className="absolute inset-0 dw-grid opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 sm:mb-6 uppercase">Trusted by Thousands</h2>
          <div className="text-sky-200 text-xl sm:text-2xl tracking-[0.4em] mb-12 sm:mb-20">★★★★★</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {[
              { text: '"Digital Wealth changed my life! Consistent profits and easy withdrawals."', name: 'Ali.', city: 'Karachi' },
              { text: '"Safe, reliable, and profitable. Highly recommend to anyone looking to invest."', name: 'Fahad.', city: 'Lahore' },
              { text: '"The daily profit system is amazing! Withdrawals are instant."', name: 'Roman.', city: 'Islamabad' },
            ].map((user, i) => (
              <motion.div key={i} custom={i} variants={fadeUpStagger} className={i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <TiltCard strength={7} className="h-full">
                  <div className="h-full bg-white/10 backdrop-blur-xl p-7 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 text-white text-left relative overflow-hidden group hover:bg-white/15 transition-colors duration-300 shadow-2xl shadow-black/10">
                    <div className="text-5xl sm:text-6xl absolute -top-4 -left-4 opacity-5 font-black uppercase tracking-tighter">Profit</div>
                    <div className="absolute top-4 right-6 text-6xl sm:text-7xl font-black text-white/10 leading-none select-none">”</div>
                    <p className="text-base sm:text-lg font-medium italic mb-6 sm:mb-8 relative z-10 leading-relaxed">{user.text}</p>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-sky-600 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        {user.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-white">{user.name}</h4>
                        <span className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">{user.city}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Footer Section */}
      <Section className="relative py-12 sm:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 dw-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] sm:w-[34rem] sm:h-[34rem] rounded-full bg-sky-200/50 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 sm:mb-12 leading-[1.05] sm:leading-none">
            Ready to Build Your{' '}
            <span className="dw-shimmer text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-700 to-sky-400">Future?</span>
          </h2>
          <div className="relative inline-block">
            <span className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] bg-sky-500/40 dw-ring" />
            <a
              href="/signup"
              className="relative inline-block px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-2xl font-black bg-gradient-to-r from-sky-500 via-blue-700 to-sky-500 dw-animbg text-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-sky-300/60 hover:scale-105 transition-all"
            >
              Start Earning Today
            </a>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="relative py-10 sm:py-20 bg-gradient-to-b from-white to-sky-50 border-t border-sky-100 text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
            <div className="col-span-2">
              <div className="text-xl sm:text-2xl font-black text-gray-800 tracking-tighter mb-4 sm:mb-6 uppercase">
                DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">WEALTH</span>
              </div>
              <p className="max-w-xs font-medium text-sm leading-relaxed"> Digital Wealth provides investment products and separate digital
                rewards opportunities through selected partner activities.</p>
            </div>
            <div>
              <h5 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-5 sm:mb-6">Explore</h5>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><button onClick={() => handleScroll('about')} className="hover:text-sky-600 hover:translate-x-1 transition-all">About Us</button></li>
                <li><button onClick={() => handleScroll('Earn')} className="hover:text-sky-600 hover:translate-x-1 transition-all">Plans</button></li>
                <li><button onClick={() => handleScroll('how-it-works')} className="hover:text-sky-600 hover:translate-x-1 transition-all">How it works</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-5 sm:mb-6">Legal</h5>
              <ul className="space-y-4 text-xs font-bold  tracking-widest">
                <li className="hover:text-sky-600 hover:translate-x-1 transition-all cursor-pointer">Terms of Service</li>
                <li className="hover:text-sky-600 hover:translate-x-1 transition-all cursor-pointer">Privacy Policy</li>
                <li className="hover:text-sky-600 hover:translate-x-1 transition-all cursor-pointer">Risk Disclosure</li>
                <li className="hover:text-sky-600 hover:translate-x-1 transition-all cursor-pointer">
                  Rewards Terms
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 sm:pt-10 border-t border-sky-100 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 text-center md:text-left">
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">
              Digital Wealth © 2025. Investment involves risk.
            </div>
            <div className="flex gap-6 items-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-8 h-8 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
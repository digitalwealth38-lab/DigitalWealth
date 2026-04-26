import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

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

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Premium Header */}
      <header className="py-4 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-sky-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleScroll('home')}>
            
            <div className="text-1xl md:text-2xl font-black text-gray-800 tracking-tighter">
    DIGITAL <span className="text-sky-600">WEALTH</span>
  </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {['home', 'about', 'how-it-works', 'Earn', 'testimonials'].map((id) => (
              <button 
                key={id} 
                onClick={() => handleScroll(id)} 
                className="text-xs font-bold text-gray-500 hover:text-sky-600 transition-all uppercase tracking-widest"
              >
                {id.replace('-', ' ')}
              </button>
            ))}
          </nav>

         <div className="flex items-center space-x-3">
  <a
    href="/login"
    className="flex items-center justify-center h-6 px-4 text-sm font-bold text-sky-600 rounded-lg hover:bg-sky-50 transition"
  >
    Login
  </a>

  <a
    href="/signup"
    className="flex items-center justify-center h-6 px-3 text-sm font-bold bg-sky-600 text-white rounded-full shadow-xl shadow-sky-200 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
  >
    Sign Up
  </a>
</div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-sky-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}>
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-sky-600 uppercase bg-sky-100 rounded-full">
              Trust & Transparency First
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.95] tracking-tight">
              Grow <span className="text-sky-600 italic">Your Wealth</span> <br /> 
              with Smart Investments
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-12 max-w-lg leading-relaxed">
              Join thousands of users earning daily profits with safe, high-yield investment plans. Track your portfolio, invest smartly, and achieve financial freedom.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
               <a href="/signup" className="px-10 py-5 text-lg font-black bg-sky-600 text-white rounded-2xl shadow-2xl shadow-sky-200 hover:bg-sky-700 hover:scale-105 transition-all">Get Started</a>
             
              <div className="flex items-center space-x-3 px-6 py-4 bg-white rounded-2xl border border-sky-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />)}
                </div>
                <span className="text-xs font-bold text-gray-500 italic">12k+ Active Investors</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(2,132,199,0.2)] border border-sky-50">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                alt="Investment Dashboard" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Floating Element 1 */}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <Section id="about" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sky-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Core Principles</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Why Choose DIGITAL WEALTH</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💹', title: 'High Returns', desc: 'Earn consistent profits with smart, diversified investment plans designed to maximize your returns.', img: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=2000' },
              { icon: '🔒', title: 'Secure Platform', desc: 'All funds are encrypted and protected. We prioritize your safety with top-notch security measures.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop' },
              { icon: '⚡', title: 'Instant Withdrawals', desc: 'Withdraw your profits anytime. Our platform ensures instant and hassle-free transactions.', img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop' },
            ].map((feature, i) => (
              <motion.div key={i} custom={i} variants={fadeUpStagger} whileHover={{ y: -10 }} className="bg-sky-50 rounded-[2.5rem] overflow-hidden flex flex-col group border border-sky-100">
                <div className="h-48 overflow-hidden">
                  <img src={feature.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={feature.title} />
                </div>
                <div className="p-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="py-32 bg-sky-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-none">How It <span className="text-sky-600">Works</span></h2>
              <div className="space-y-8">
                {[
                  { icon: '📝', title: 'Sign Up', desc: 'Create an account in minutes and access our investment platform easily.' },
                  { icon: '💰', title: 'Invest', desc: 'Choose your plan, deposit funds securely, and start earning profits daily.' },
                  { icon: '📈', title: 'Withdraw', desc: 'Track your earnings and withdraw profits instantly to your account anytime.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-14 h-14 shrink-0 bg-white border border-sky-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop" className="w-full h-full object-cover" alt="Analytics" />
            </div>
          </div>
        </div>
      </Section>

      {/* Plans / Earn Section */}
      <Section id="Earn" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">How You Can <span className="text-sky-600">Earn</span></h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-4">Multiple streams of income</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Earn Profit with Plans', desc: 'Invest in our carefully designed investment plans and earn consistent daily profits.', icon: '💹', color: 'bg-white', text: 'text-gray-900' },
              { title: 'Earn Profit with Network', desc: 'Refer others to join Digital Wealth and earn commissions from your network growth.', icon: '🌐', color: 'bg-white', text: 'text-gray-900' },
              { title: 'Earn Profit with Crypto', desc: 'Invest in select cryptocurrencies and enjoy potential high-yield crypto profits safely.', icon: '🪙', color: 'bg-white', text: 'text-gray-900' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                custom={i} 
                variants={fadeUpStagger} 
                className={`${item.color} ${item.text} p-12 rounded-[3rem] border border-sky-100 shadow-xl shadow-sky-100/20 group hover:-translate-y-4 transition-all duration-500`}
              >
                <div className={`text-6xl mb-8 opacity-90 transition-transform group-hover:scale-110`}>{item.icon}</div>
                <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">{item.title}</h3>
                <p className={`font-medium text-sm leading-relaxed ${item.color === 'bg-white' ? 'text-gray-500' : 'text-sky-50'}`}>
                  {item.desc}
                </p>
                <div className={`mt-10 h-1.5 w-12 rounded-full ${item.color === 'bg-white' ? 'bg-sky-600' : 'bg-white'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="py-32 bg-sky-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-20 uppercase">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { text: '"Digital Wealth changed my life! Consistent profits and easy withdrawals."', name: 'Ali.', city: 'Karachi' },
              { text: '"Safe, reliable, and profitable. Highly recommend to anyone looking to invest."', name: 'Fahad.', city: 'Lahore' },
              { text: '"The daily profit system is amazing! Withdrawals are instant."', name: 'Roman.', city: 'Islamabad' },
            ].map((user, i) => (
              <motion.div key={i} custom={i} variants={fadeUpStagger} className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 text-white text-left relative overflow-hidden group">
                <div className="text-6xl absolute -top-4 -left-4 opacity-5 font-black uppercase tracking-tighter">Profit</div>
                <p className="text-lg font-medium italic mb-8 relative z-10 leading-relaxed">"{user.text}"</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-sky-600">
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-white">{user.name}</h4>
                    <span className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">{user.city}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Footer Section */}
      <Section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
       <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-10 leading-none">Ready to Build Your <span className="text-sky-600">Future?</span></h2>
               <a href="/signup"className="px-12 py-6 text-2xl font-black bg-sky-600 text-white rounded-[2rem] shadow-2xl shadow-sky-200 hover:scale-105 transition-all">
           Start Earning Today</a>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-sky-50 text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="text-2xl font-black text-gray-800 tracking-tighter mb-6 uppercase">
                DIGITAL <span className="text-sky-600">WEALTH</span>
              </div>
              <p className="max-w-xs font-medium text-sm leading-relaxed">The most transparent daily profit platform built on trust and smart investment algorithms.</p>
            </div>
            <div>
              <h5 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Explore</h5>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><button onClick={() => handleScroll('about')} className="hover:text-sky-600 transition">About Us</button></li>
                <li><button onClick={() => handleScroll('Earn')} className="hover:text-sky-600 transition">Plans</button></li>
                <li><button onClick={() => handleScroll('how-it-works')} className="hover:text-sky-600 transition">How it works</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Legal</h5>
              <ul className="space-y-4 text-xs font-bold  tracking-widest">
                <li className="hover:text-sky-600 transition cursor-pointer">Terms of Service</li>
                <li className="hover:text-sky-600 transition cursor-pointer">Privacy Policy</li>
                <li className="hover:text-sky-600 transition cursor-pointer">Risk Disclosure</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-sky-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">
              Digital Wealth © 2025. Investment involves risk.
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-8 h-8 bg-sky-50 rounded-lg"></div>
              <div className="w-8 h-8 bg-sky-50 rounded-lg"></div>
              <div className="w-8 h-8 bg-sky-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
const Home = () => {
  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeUpStagger = {
    hidden: { opacity: 0, y: 40 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 }
    })
  };

  // Smooth scroll handler
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll-triggered animation wrapper
const Section = ({ children, startVisible = false }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { margin: '-100px 0px', once: true });

  useEffect(() => {
    if (inView || startVisible) {
      controls.start('visible');
    }
  }, [controls, inView, startVisible]);

  return (
    <motion.div
      ref={ref}
      initial={startVisible ? 'visible' : 'hidden'}
      animate={controls}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">

      {/* Header */}
      <header className="py-5 bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-sky-600 tracking-wide">
            Digital <span className="text-gray-800">Wealth</span>
          </div>

          <nav className="hidden md:flex space-x-6 text-sm font-semibold">
            {['home', 'about', 'how-it-works', 'Earn', 'testimonials'].map((id) => (
              <button key={id} onClick={() => handleScroll(id)} className="hover:text-sky-500 transition capitalize">
                {id.replace('-', ' ')}
              </button>
            ))}
          </nav>

          <div className="flex space-x-3">
            <a href="/login" className="px-5 py-2 text-sm font-semibold border border-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition">Login</a>
            <a href="/signup" className="px-5 py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">Signup</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}

{/* Hero Section */}
<section id="home" className="text-center py-28 md:py-36 bg-gradient-to-b from-sky-100 to-white">
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.2,
          duration: 0.8,
          ease: 'easeOut',
        },
      },
    }}
  >
    <motion.h1
      className="text-5xl md:text-6xl font-extrabold text-sky-700 mb-6 leading-tight"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
      Grow <span className="text-sky-600">Your Wealth</span> with Smart Investments
    </motion.h1>

    <motion.p
      className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
    >
      Join thousands of users earning daily profits with safe, high-yield investment plans. Track your portfolio, invest smartly, and achieve financial freedom.
    </motion.p>

    <motion.div
      className="flex justify-center mb-16"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}
    >
      <a
        href="/signup"
        className="px-12 py-4 text-lg font-bold bg-sky-600 text-white rounded-xl shadow-lg hover:bg-sky-700 transition duration-300"
      >
        Get Started
      </a>
    </motion.div>
  </motion.div>

  {/* Profit Cards */}
  {/* Profit Cards */}
</section>



      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <Section>
          <h2 className="text-4xl font-bold text-center text-sky-700 mb-16">Why Choose DIGITAL WEALTH</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 text-center md:px-16">
            {[
              { icon: '💹', title: 'High Returns', desc: 'Earn consistent profits with smart, diversified investment plans designed to maximize your returns.' },
              { icon: '🔒', title: 'Secure Platform', desc: 'All funds are encrypted and protected. We prioritize your safety with top-notch security measures.' },
              { icon: '⚡', title: 'Instant Withdrawals', desc: 'Withdraw your profits anytime. Our platform ensures instant and hassle-free transactions.' },
            ].map((feature, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpStagger} className="p-6 bg-sky-50 rounded-xl border border-sky-100 hover:border-sky-500 transition duration-300 shadow-md">
                <div className="text-4xl text-sky-500 mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-sky-700 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-sky-50">
        <Section>
          <h2 className="text-4xl font-bold text-center text-sky-700 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-6 md:px-16">
            {[
              { icon: '📝', title: 'Sign Up', desc: 'Create an account in minutes and access our investment platform easily.' },
              { icon: '💰', title: 'Invest', desc: 'Choose your plan, deposit funds securely, and start earning profits daily.' },
              { icon: '📈', title: 'Withdraw', desc: 'Track your earnings and withdraw profits instantly to your account anytime.' },
            ].map((step, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpStagger} className="p-6 bg-white rounded-xl shadow-md">
                <div className="text-4xl mb-4 text-sky-500">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* Plans Section */}
   <section id="Earn" className="py-20 bg-white">
  <Section>
    <h2 className="text-4xl font-bold text-center text-sky-700 mb-16">
      How You Can Earn
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-6 md:px-16">
      {[
        {
          title: 'Earn Profit with Plans',
          desc: 'Invest in our carefully designed investment plans and earn consistent daily profits.',
          icon: '💹',
        },
        {
          title: 'Earn Profit with Network',
          desc: 'Refer others to join Digital Wealth and earn commissions from your network growth.',
          icon: '🌐',
        },
        {
          title: 'Earn Profit with Crypto',
          desc: 'Invest in select cryptocurrencies and enjoy potential high-yield crypto profits safely.',
          icon: '🪙',
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpStagger}
          className="p-6 bg-sky-50 rounded-xl border border-sky-100 hover:border-sky-500 shadow-md"
        >
          <div className="text-5xl mb-4 text-sky-500">{item.icon}</div>
          <h3 className="text-2xl font-semibold text-sky-700 mb-3">{item.title}</h3>
          <p className="text-gray-700">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </Section>
</section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-sky-100">
        <Section>
          <h2 className="text-4xl font-bold text-center text-sky-700 mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-6 md:px-16">
            {[
              { text: '"Digital Wealth changed my life! Consistent profits and easy withdrawals."', name: 'Uzair.' },
              { text: '"Safe, reliable, and profitable. Highly recommend to anyone looking to invest."', name: 'Ahmed.' },
              { text: '"The daily profit system is amazing! Withdrawals are instant."', name: 'Waqar.' },
            ].map((user, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpStagger} className="p-6 bg-white rounded-xl shadow-md">
                <p className="text-gray-700 mb-4">{user.text}</p>
                <h4 className="font-bold text-sky-600">{user.name}</h4>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-200 text-gray-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          Digital Wealth © 2025. Investment involves risk. Please invest responsibly.
        </div>
      </footer>

    </div>
  );
};

export default Home;


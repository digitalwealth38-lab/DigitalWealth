import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaEnvelope,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs
      .sendForm(serviceId, templateId, e.target, publicKey)
      .then(() => {
        toast.success("Message sent successfully 🚀");
        setLoading(false);
        e.target.reset();
      })
      .catch(() => {
        toast.error("Something went wrong ❌");
        setLoading(false);
      });
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-white flex flex-col overflow-hidden items-center justify-center py-20 px-6"
    >
      {/* Heading */}
     <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-extrabold text-sky-800 mb-12 tracking-tight text-center"
          >
            Contact <span className="text-sky-500">Us</span>
          </motion.h1>

      <motion.p
        className="text-gray-600 max-w-xl text-center mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
       Need help with our networking investment platform? 
  I’m here to provide support and answer your questions. 🚀
      </motion.p>

      {/* Contact Form */}
      <motion.form
        ref={form}
        onSubmit={sendEmail}
        className="w-full max-w-lg bg-gray-50 shadow-lg rounded-2xl p-8 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="user_name"
            placeholder="Your name"
            required
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="user_email"
            placeholder="Your email"
            required
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
          <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700">
      Phone
    </label>
    <input
      type="tel"
      name="user_phone"
      placeholder="Your phone number"
      required
      className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            placeholder="Write your message..."
            rows="4"
            required
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </motion.form>

      {/* Contact Info */}
      <div className="flex flex-col items-center mt-12 space-y-4 text-gray-700">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-blue-600" />
          <span>stoneghold4103@gmail.com</span>
        </div>
      
      </div>

      {/* Social Links */}
    </section>
  );
}


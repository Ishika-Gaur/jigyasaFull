"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FaMapMarkerAlt,
  FaHeadset,
  FaEnvelope,
  FaClock,
  FaHome,
  FaCalendarPlus,
} from "react-icons/fa";

const ThankYou = () => {
  const [visible, setVisible] = useState(false);
  const [countDown, setCountDown] = useState(10);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = "/";
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ty-font { font-family: 'DM Sans', sans-serif; }
        .ty-serif { font-family: 'DM Serif Display', serif; }

        /* Check circle bounce in */
        .check-circle {
          width: 110px; height: 110px; border-radius: 50%;
          background: linear-gradient(135deg, #20B2AA, #17a89d);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 40px rgba(32,178,170,0.45);
          opacity: 0; transform: scale(0.2);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
        }
        .check-circle.show { opacity: 1; transform: scale(1); }

        /* Pulse rings */
        .pulse-ring {
          position: absolute; border-radius: 50%;
          border: 2.5px solid rgba(32,178,170,0.28);
          animation: pulseRing 2.6s ease-out infinite;
        }
        .pr1 { width: 148px; height: 148px; animation-delay: 0s; }
        .pr2 { width: 190px; height: 190px; animation-delay: 0.75s; }
        .pr3 { width: 232px; height: 232px; animation-delay: 1.5s; }
        @keyframes pulseRing {
          0%   { opacity: 0.6; transform: scale(0.86); }
          100% { opacity: 0;   transform: scale(1.1); }
        }

        /* Fade up stagger */
        .fade-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.18s; }
        .d2 { transition-delay: 0.32s; }
        .d3 { transition-delay: 0.46s; }
        .d4 { transition-delay: 0.60s; }
        .d5 { transition-delay: 0.74s; }
        .d6 { transition-delay: 0.88s; }

        /* Progress bar */
        .progress-track {
          height: 4px; background: #d1f0ee;
          border-radius: 99px; overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #20B2AA, #17a89d);
          border-radius: 99px;
          animation: shrink 10s linear forwards;
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }

        /* Dots decorations */
        .dots-tr {
          position: absolute; top: 0; right: 0;
          width: 240px; height: 240px; pointer-events: none;
          background-image: radial-gradient(circle, rgba(32,178,170,0.15) 1.5px, transparent 1.5px);
          background-size: 22px 22px;
        }
        .dots-bl {
          position: absolute; bottom: 40px; left: 0;
          width: 180px; height: 180px; pointer-events: none;
          background-image: radial-gradient(circle, rgba(32,178,170,0.1) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* ── Hero Banner (same style as Contact page) ── */}
      <section
        className="text-white py-[120px] px-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative bg-cover bg-center max-lg:py-20 max-md:py-[60px] max-sm:py-[60px] max-sm:px-[15px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,54,93,0.85), rgba(26,54,93,0.85)), url('https://i.pinimg.com/1200x/8e/e5/30/8ee5309347aef92d6f7b578f635bd889.jpg')",
        }}
      >
        <h1 className="text-[4rem] font-bold m-0 text-white [text-shadow:2px_2px_8px_rgba(0,0,0,0.3)] tracking-[2px] max-lg:text-[3rem] max-md:text-[2.5rem] max-sm:text-[2rem] max-[400px]:text-[1.75rem]">
          Thank You!
        </h1>
      </section>

      {/* ── Main Content ── */}
      <div className="ty-font max-w-[1400px] mx-auto py-[60px] px-5 max-sm:py-10 max-sm:px-[15px] max-[1600px]:max-w-[1600px]">
        <div className="relative flex flex-col items-center text-center gap-8">
          <div className="dots-tr" />
          <div className="dots-bl" />

          {/* Animated Check */}
          <div className="relative flex items-center justify-center">
            <div className="pulse-ring pr1" />
            <div className="pulse-ring pr2" />
            <div className="pulse-ring pr3" />
            <div className={`check-circle ${visible ? "show" : ""}`}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path
                  d="M11 25L21 36L39 15"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Badge + Heading */}
          <div className={`fade-up d1 ${visible ? "show" : ""} flex flex-col items-center gap-3`}>
            <span className="inline-block bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white py-2 px-5 rounded-[25px] text-[0.85rem] font-semibold tracking-wider uppercase">
              Request Received
            </span>
            <h2 className="ty-serif text-[2.8rem] text-[#2d3748] m-0 leading-tight max-sm:text-[2.1rem] max-[400px]:text-[1.8rem]">
              Appointment Submitted <br />
              <em className="text-[#20B2AA]">Successfully!</em>
            </h2>
          </div>

          {/* Description */}
          <p className={`fade-up d2 ${visible ? "show" : ""} text-[#4a5568] leading-[1.8] text-[1.05rem] max-w-[580px] m-0 max-sm:text-base`}>
            We've received your appointment request. Our dedicated team at{" "}
            <strong className="text-[#2d3748]">Jigyasa Hospital</strong> will
            review your details and reach out to you shortly on your registered
            phone number to confirm your appointment.
          </p>

          {/* What Happens Next box */}
          <div className={`fade-up d3 ${visible ? "show" : ""} w-full max-w-[680px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 max-sm:p-6 max-[400px]:p-5`}>
            <h3 className="text-[1.2rem] font-bold text-[#2d3748] mb-5 m-0">
              What Happens Next?
            </h3>
            <div className="flex flex-col gap-4 text-left">
              {[
                {
                  step: "01",
                  title: "Request Review",
                  desc: "Our team will review your appointment request within a few hours.",
                },
                {
                  step: "02",
                  title: "Confirmation Call",
                  desc: "We will call you on your registered number to confirm the date & time.",
                },
                {
                  step: "03",
                  title: "Your Visit",
                  desc: "Visit Jigyasa Hospital at your scheduled time. We look forward to seeing you!",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white text-sm font-bold flex items-center justify-center shadow-[0_4px_12px_rgba(32,178,170,0.3)]">
                    {step}
                  </span>
                  <div>
                    <p className="text-[#2d3748] font-semibold m-0 mb-0.5">{title}</p>
                    <p className="text-[#4a5568] text-sm m-0 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`fade-up d4 ${visible ? "show" : ""} flex flex-wrap gap-4 justify-center`}>
            <Link
              href="/"
              className="flex items-center gap-2 bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white no-underline py-[15px] px-[35px] text-[1.05rem] font-semibold rounded-[30px] transition-all duration-300 uppercase tracking-[0.5px] shadow-[0_4px_15px_rgba(32,178,170,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(32,178,170,0.4)] max-sm:py-3 max-sm:px-7 max-sm:text-base"
            >
              <FaHome className="text-[1rem]" />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border-2 border-[#20B2AA] text-[#20B2AA] no-underline py-[13px] px-[35px] text-[1.05rem] font-semibold rounded-[30px] transition-all duration-300 uppercase tracking-[0.5px] bg-transparent hover:bg-[#20B2AA] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(32,178,170,0.3)] max-sm:py-3 max-sm:px-7 max-sm:text-base"
            >
              <FaCalendarPlus className="text-[1rem]" />
              New Appointment
            </Link>
          </div>

          {/* Redirect countdown */}
          <div className={`fade-up d5 ${visible ? "show" : ""} w-full max-w-[340px] flex flex-col items-center gap-2`}>
            <p className="text-[#718096] text-sm m-0">
              Redirecting to home in{" "}
              <span className="font-bold text-[#20B2AA]">{countDown}s</span>
            </p>
            <div className="progress-track w-full">
              <div className="progress-fill" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Cards (same as Contact page) ── */}
      <div className="max-w-[1400px] mx-auto mt-10 pt-0 pb-[60px] px-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[25px] max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-5 max-sm:pb-10 max-[1600px]:max-w-[1600px] max-[1600px]:grid-cols-4">
        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaMapMarkerAlt className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Location
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <span className="block font-semibold text-[#2d3748] mb-[5px]">Visit us at:</span>
            Jigyasa Hospital
            <br />
            Near Miglani Cinema,
            <br />
            Rampur Road, Moradabad 244001
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaHeadset className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              24/7 Service
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <span className="block font-semibold text-[#2d3748] mb-[5px]">Call us on:</span>
            Mob: 7900903333
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaEnvelope className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Drop a Line
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <span className="block font-semibold text-[#2d3748] mb-[5px]">Email us at:</span>
            info@jigyasahospital.in
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaClock className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Office Hours
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <span className="block font-semibold text-[#2d3748] mb-[5px]">Hours of Operation:</span>
            24/7 Medical Care & Support
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYou;
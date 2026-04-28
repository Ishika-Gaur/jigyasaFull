"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";

const About = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const cards = [
    {
      image: "https://i.pinimg.com/1200x/48/64/98/4864980686348f1d1ef065fb654fe059.jpg", // Apni image path yahan add karein
      title: "Transparency On Report",
      description: "We believe in complete transparency when it comes to your health. All medical reports are provided clearly and accurately, ensuring you understand your diagnosis, treatment plan, and any further steps. Our goal is to keep you fully informed every step of the way.",
    },
    {
      image: "https://i.pinimg.com/1200x/86/de/25/86de25bf5b2b497bb8be816e43e60bc0.jpg", // Apni image path yahan add karein
      title: "Our Vision",
      description: "To be a leading healthcare provider, delivering exceptional care with compassion and innovation. We strive to enhance the well-being of individuals and communities, setting new standards in healthcare through advanced practices, dedicated professionals, and a patient-centered approach.",
    },
    {
      image: "https://i.pinimg.com/736x/81/05/c9/8105c9f21c27f88f01f1e21b8a855652.jpg", // Apni image path yahan add karein
      title: "History Of Beginning",
      description: "Healthcare has its roots in ancient civilizations, where people used herbal remedies and early surgical techniques to treat illnesses. Over centuries, these practices developed into more organized systems, eventually evolving into the advanced healthcare services .",
    },
    {
      image: "https://i.pinimg.com/736x/c0/7a/5f/c07a5fea7e514d97fb482cbde375a88f.jpg", // Apni image path yahan add karein
      title: "Qualified Doctors",
      description: "Our team of highly qualified doctors is committed to providing exceptional care. With expertise in various medical fields, they combine advanced knowledge, years of experience, and a compassionate approach to ensure the best possible outcomes for our patients.",
    },
    {
      image: "https://i.pinimg.com/1200x/be/83/05/be830535e2664777f75b2f79089e670f.jpg", // Apni image path yahan add karein
      title: "24/7 Emergency Care",
          description: "Our emergency department is open round the clock to provide immediate medical attention. With state-of-the-art equipment and experienced emergency specialists, we ensure prompt and effective care whenever you need it most.",

    },
    {
      image: "https://i.pinimg.com/736x/f1/3f/25/f13f250b7f1fef876ef50bb360dfefd8.jpg", // Apni image path yahan add karein
      title: "Pharmacy Store",
      description: "Our pharmacy offers a wide range of prescription medications, over-the-counter products, and health supplements. With knowledgeable pharmacists available for personalized advice, we ensure you receive the right medications and expert guidance for all your health needs.",
    },
  ];

  return (
    <div className="font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] text-[#1a202c] overflow-x-hidden bg-gradient-to-b from-white to-[#f7fafc]">
      {/* Hero Section */}
      <section 
        className="min-h-[60vh] flex items-center justify-center text-white text-center px-4 relative overflow-hidden bg-cover bg-center bg-no-repeat max-[991px]:min-h-[50vh] max-[600px]:min-h-[45vh]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(10, 27, 59, 0.9), rgba(65, 90, 144, 0.6)), url('/hospital.png')"
        }}
      >
        <h1 className="font-['Sora',sans-serif] text-[4rem] font-bold m-0 text-white [text-shadow:1px_1px_4px_rgba(0,0,0,0.4)] max-[991px]:text-[2.5rem] max-[600px]:text-[1.8rem]">
          About us
        </h1>
      </section>

      {/* Section: We Are Best Among Others */}
      <section className="py-24 px-12 flex flex-row gap-16 items-start justify-between flex-wrap max-w-[1400px] mx-auto max-[991px]:flex-col max-[991px]:gap-12 max-[991px]:py-16 max-[991px]:px-8 max-[600px]:py-12 max-[600px]:px-6">
        <div className="flex-1 min-w-[350px] max-[991px]:min-w-full">
          <h4 className="inline-block text-[13px] text-[#0dbd9d] font-bold mb-5 uppercase tracking-[1.8px] bg-gradient-to-br from-[#cff0ef] to-[#e8f5f4] py-2.5 px-6 rounded-[25px] border-2 border-[rgba(13,189,157,0.2)] relative overflow-hidden shadow-[0_6px_20px_rgba(13,189,157,0.15)] animate-[slideInDown_0.8s_ease_0.2s_both]">
            WHO WE ARE
          </h4>
          <h2 className="font-['Sora',sans-serif] text-[2.5rem] mb-4 font-bold text-[#111827] max-[991px]:text-[1.8rem] max-[600px]:text-[1.6rem]">
            We Are Best Among Others?
          </h2>
          <p className="text-base leading-[1.7] text-[#333] mb-6">
            Our commitment to excellence sets us apart. With a team of skilled
            professionals, state-of-the-art technology, and a patient-centered
            approach, we deliver unmatched healthcare services, ensuring your
            well-being is our top priority.
          </p>
          <ul className="bg-white p-8 rounded-2xl list-none flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <li className="text-base flex items-center font-medium before:content-['✓'] before:text-[#0dbd9d] before:mr-2.5 before:font-bold">
              Experienced Medical Team
            </li>
            <li className="text-base flex items-center font-medium before:content-['✓'] before:text-[#0dbd9d] before:mr-2.5 before:font-bold">
              Quick & Efficient Service
            </li>
            <li className="text-base flex items-center font-medium before:content-['✓'] before:text-[#0dbd9d] before:mr-2.5 before:font-bold">
              Affordable & Transparent Pricing
            </li>
            <li className="text-base flex items-center font-medium before:content-['✓'] before:text-[#0dbd9d] before:mr-2.5 before:font-bold">
              Patient-Centered Care
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-[350px] flex flex-col max-[991px]:min-w-full">
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-black max-[600px]:h-[350px] group">
            {!isVideoPlaying ? (
              <>
                <img 
                  src="/ph-5.jpeg" 
                  alt="Doctors" 
                  className="w-full h-full object-cover block group-hover:brightness-[0.8] transition-all duration-300" 
                />
                <button
                  onClick={handlePlayVideo}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[rgba(255,255,255,0.95)] border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.3)] z-10 hover:scale-110 hover:bg-white hover:shadow-[0_12px_35px_rgba(0,0,0,0.4)] active:scale-95 max-[600px]:w-[60px] max-[600px]:h-[60px]"
                  aria-label="Play video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-[#25B1A8] ml-1 max-[600px]:w-6 max-[600px]:h-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </>
            ) : (
              <video
                controls
                autoPlay
                className="w-full h-full object-cover block"
                src="/patientCareVd.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 text-center p-12 bg-gradient-to-br from-[#d1efe9] to-[#e6f9f8] mx-12 my-12 rounded-3xl max-[991px]:grid-cols-2 max-[991px]:gap-6 max-[991px]:mx-8 max-[600px]:grid-cols-1 max-[600px]:gap-4 max-[600px]:mx-6 max-[600px]:py-8 max-[600px]:px-6">
        <div>
          <h3 className="font-['Sora',sans-serif] text-[1.8rem] text-[#25B1A8] max-[600px]:text-[1.4rem]">120K +</h3>
          <p className="text-[0.85rem] uppercase text-[#555]">HAPPY PATIENTS</p>
        </div>
        <div>
          <h3 className="font-['Sora',sans-serif] text-[1.8rem] text-[#25B1A8] max-[600px]:text-[1.4rem]">200</h3>
          <p className="text-[0.85rem] uppercase text-[#555]">SPECIALIST DOCTORS</p>
        </div>
        <div>
          <h3 className="font-['Sora',sans-serif] text-[1.8rem] text-[#25B1A8] max-[600px]:text-[1.4rem]">30+</h3>
          <p className="text-[0.85rem] uppercase text-[#555]">MEDICAL SERVICES</p>
        </div>
        <div>
          <h3 className="font-['Sora',sans-serif] text-[1.8rem] text-[#25B1A8] max-[600px]:text-[1.4rem]">150K</h3>
          <p className="text-[0.85rem] uppercase text-[#555]">PROBLEM SOLVE</p>
        </div>
      </section>

      {/* Quality Care Section */}
      <section className="text-center max-w-[900px] mx-auto my-[100px] mb-20 px-8 animate-[fadeInUp_0.8s_ease] max-[991px]:my-20 max-[991px]:mb-[60px] max-[600px]:my-[60px] max-[600px]:mb-10 max-[600px]:px-6">
        <h3 className="font-['Sora',sans-serif] inline-block text-[13px] text-[#0dbd9d] font-bold mb-5 uppercase tracking-[1.8px] bg-gradient-to-br from-[#cff0ef] to-[#e8f5f4] py-2.5 px-6 rounded-[25px] border-2 border-[rgba(13,189,157,0.2)] relative overflow-hidden shadow-[0_6px_20px_rgba(13,189,157,0.15)] animate-[slideInDown_0.8s_ease_0.2s_both] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.4)] before:to-transparent before:animate-[tagShine_3s_ease-in-out_infinite] max-[600px]:text-[11px] max-[600px]:py-2 max-[600px]:px-[18px]">
          WHAT WE OFFER
        </h3>
        <h2 className="font-['Sora',sans-serif] text-[2.5rem] text-[#111] mb-5 font-bold leading-[1.2] animate-[fadeInUp_0.8s_ease_0.3s_both] max-[991px]:text-[2rem] max-[600px]:text-[1.7rem]">
          Delivering the highest quality care.
        </h2>
        <p className="text-base text-[#666] leading-[1.7] mb-0 animate-[fadeInUp_0.8s_ease_0.4s_both] font-normal">
          We are committed to providing exceptional healthcare through advanced
          treatments, experienced doctors, and a compassionate approach. Our
          focus is on achieving the best possible outcomes for our patients,
          ensuring their comfort, safety, and satisfaction at every step of
          their healthcare journey.
        </p>
      </section>

      {/* About Cards Section */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 max-w-[1400px] mx-auto my-20 px-12 max-[991px]:grid-cols-2 max-[991px]:gap-8 max-[991px]:px-8 max-[600px]:grid-cols-1 max-[600px]:gap-8 max-[600px]:px-6 max-[600px]:my-[60px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-[#f8fbfb] py-12 px-10 rounded-3xl text-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative overflow-hidden border border-[rgba(13,189,157,0.1)] animate-[cardFadeIn_0.6s_ease_both] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(13,189,157,0.08)] before:to-transparent before:transition-[left] before:duration-700 before:ease-in-out after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-[#0dbd9d] after:to-[#25b1a8] after:scale-x-0 after:transition-transform after:duration-500 after:ease-in-out hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(13,189,157,0.2)] hover:bg-gradient-to-br hover:from-white hover:to-[#e6f9f8] hover:before:left-full hover:after:scale-x-100 max-[600px]:py-10 max-[600px]:px-8 max-[480px]:py-8 max-[480px]:px-6 group"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            <div className="w-[90px] h-[90px] mx-auto mb-[30px] bg-gradient-to-br from-[#0dbd9d] to-[#25b1a8] rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(13,189,157,0.3)] relative animate-[iconFloat_3s_ease-in-out_infinite] overflow-hidden before:content-[''] before:absolute before:-top-1 before:-left-1 before:-right-1 before:-bottom-1 before:bg-gradient-to-br before:from-[#0dbd9d] before:to-[#25b1a8] before:rounded-full before:opacity-0 before:transition-opacity before:duration-400 before:ease-in-out before:-z-10 group-hover:translate-y-[-5px] group-hover:scale-[1.08] group-hover:shadow-[0_15px_45px_rgba(13,189,157,0.45)] group-hover:animate-none group-hover:before:opacity-30 group-hover:before:animate-[iconPulse_1.5s_ease-in-out_infinite] max-[600px]:w-[75px] max-[600px]:h-[75px] max-[600px]:mb-[25px]">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover rounded-full transition-all duration-400 ease-in-out group-hover:scale-[1.1] group-hover:rotate-[3deg]"
              />
            </div>
            <h3 className="font-['Sora',sans-serif] text-[1.4rem] text-[#111] mb-[15px] font-semibold transition-colors duration-300 ease-in-out leading-[1.4] group-hover:text-[#0dbd9d] max-[600px]:text-[1.2rem]">
              {card.title}
            </h3>
            <p className="text-[#666] leading-[1.6] text-[0.95rem] m-0 transition-colors duration-300 ease-in-out font-normal group-hover:text-[#2d3748] max-[600px]:text-[0.9rem]">
              {card.description}
            </p>
          </div>
        ))}
      </section>

      <Footer />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tagShine {
          0%, 100% { left: -100%; }
          50% { left: 100%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
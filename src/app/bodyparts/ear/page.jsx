"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Ear() {
  const router = useRouter();
  const [selectedDisease, setSelectedDisease] = useState(null);

  const diseases = [
    {
      name: "Ear Infections (Otitis)",
      description:
        "Infections of the outer, middle, or inner ear causing pain and hearing difficulty."
    },
    {
      name: "Hearing Loss",
      description:
        "Partial or complete hearing loss managed with evaluation and rehabilitation."
    },
    {
      name: "Ear Wax (Cerumen Impaction)",
      description:
        "Excessive wax buildup treated with safe removal techniques."
    },
    {
      name: "Tinnitus",
      description:
        "Ringing or buzzing in ears treated with counseling and therapy."
    },
    {
      name: "Vertigo & Balance Disorders",
      description:
        "Inner ear disorders causing dizziness managed with medication and therapy."
    }
  ];

  const toggleDisease = (disease) => {
    setSelectedDisease(
      selectedDisease?.name === disease.name ? null : disease
    );
  };

  return (
    <>
      {/* Hero Section - Full Width Banner */}
      <div className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.pinimg.com/1200x/79/ca/cd/79cacd36b206e0e26204d7a48e4f8dc1.jpg')"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-[1000px] px-8 animate-[slideInUp_1s_ease-out]">
          <div className="inline-block bg-white/15 backdrop-blur-[10px] text-white py-2.5 px-6 rounded-full text-sm font-medium mb-6 border border-white/30 animate-[tagFloat_3s_ease-in-out_infinite]">
            👂 ENT
          </div>
          
          <h1 className="font-['Playfair_Display'] text-5xl md:text-[3.5rem] font-bold text-white leading-tight mb-5 [text-shadow:2px_2px_8px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.2s_backwards]">
            ENT & Ear Care Department
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-[800px] mx-auto leading-relaxed [text-shadow:1px_1px_4px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.4s_backwards]">
            Advanced care for ear, hearing & balance disorders
          </p>

          <button
            className="bg-white text-teal-500 py-4 px-12 text-base font-semibold border-none rounded-full cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:translate-y-[-4px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:bg-teal-50 animate-[fadeIn_1s_ease-out_0.6s_backwards]"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1400px] mx-auto my-24 px-12">
        <div className="text-center mb-15 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative">
            About ENT Department
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-sm relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <p className="text-[1.05rem] leading-relaxed text-slate-600 mb-6 text-justify animate-[fadeIn_0.8s_ease-out_0.1s_backwards]">
              The ENT Department at <strong>Jigyasa Hospital</strong> provides
              comprehensive and patient-centered care for disorders of the ear,
              nose, and throat across all age groups.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-slate-600 text-justify animate-[fadeIn_0.8s_ease-out_0.2s_backwards]">
              Our experienced ENT specialists diagnose and treat ear infections,
              hearing loss, dizziness, tinnitus, sinus disorders, and throat
              conditions using modern diagnostic tools and minimally invasive
              treatment techniques.
            </p>
          </div>

          <div className="relative animate-[slideInRight_1s_ease-out]">
            <img
              src="/ent.jpg"
              alt="ENT Department"
              className="w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(20,184,166,0.15)] transition-all duration-400 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(20,184,166,0.2)]"
            />
          </div>
        </div>
      </div>

      {/* Services Section - 4 Cards */}
      <div className="max-w-[1400px] mx-auto my-24 px-12">
        <div className="text-center mb-15 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative">
            Our Services
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-sm relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "🔬",
              title: "Diagnostics",
              items: ["Hearing Tests", "Endoscopy", "Imaging Studies", "Balance Assessment"]
            },
            {
              icon: "💊",
              title: "Medical Treatment",
              items: ["Infection Management", "Allergy Care", "Medication Therapy", "Vertigo Treatment"]
            },
            {
              icon: "🏥",
              title: "Surgical Care",
              items: ["Ear Surgery", "Sinus Surgery", "Throat Procedures", "Minimally Invasive"]
            },
            {
              icon: "👂",
              title: "Hearing Solutions",
              items: ["Hearing Aids", "Implants", "Rehabilitation", "Follow-up Care"]
            }
          ].map((service, index) => (
            <div
              key={index}
              className={`bg-white p-10 rounded-2xl shadow-[0_4px_12px_rgba(20,184,166,0.08)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[5px] before:bg-gradient-to-r before:from-teal-500 before:to-teal-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:translate-y-[-10px] hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] hover:before:scale-x-100 animate-[cardFadeIn_0.6s_ease-out_backwards]`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 transition-all duration-400 relative before:content-[''] before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-teal-500 before:to-teal-600 before:rounded-full before:opacity-0 before:transition-opacity before:duration-400 group-hover:scale-110 group-hover:rotate-[5deg]">
                <span className="text-4xl relative z-10">{service.icon}</span>
              </div>

              <h2 className="font-['Playfair_Display'] text-2xl text-slate-800 mb-5 font-semibold transition-colors duration-300 hover:text-teal-500">
                {service.title}
              </h2>

              <ul className="list-none p-0">
                {service.items.map((item, i) => (
                  <li
                    key={i}
                    className="py-3 pl-7 relative text-slate-600 text-[0.95rem] leading-relaxed transition-all duration-300 before:content-['✓'] before:absolute before:left-0 before:text-teal-500 before:font-bold before:text-base hover:pl-8 hover:text-slate-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[1400px] mx-auto my-24 px-12">
        <div className="text-center mb-15 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative">
            Gallery
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-sm relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full" />
        </div>

        <div className="py-12">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500 }}
            freeMode={true}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            modules={[Pagination, Autoplay, FreeMode]}
            className="[&_.swiper-pagination-bullet]:bg-teal-500 [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet-active]:opacity-100 [&_.swiper-pagination-bullet-active]:w-[30px] [&_.swiper-pagination-bullet-active]:rounded-[5px]"
          >
            {[1, 2, 3, 4].map((num) => (
              <SwiperSlide key={num}>
                <img
                  src={`/gallery${num}.png`}
                  alt={`Gallery ${num}`}
                  className="w-full h-[300px] object-cover rounded-2xl shadow-[0_8px_30px_rgba(20,184,166,0.12)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:scale-105 hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Conditions We Treat Section */}
      <div className="max-w-[1400px] mx-auto mt-24 mb-15 px-12">
        <div className="text-center mb-15 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative">
            Conditions We Treat
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-sm relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full" />
        </div>

        <p className="text-center text-lg text-slate-500 max-w-[700px] mx-auto mb-5 leading-relaxed">
          Expert treatment for a comprehensive range of ear, nose, and throat conditions
        </p>

        <div className="mt-15 grid grid-cols-1 md:grid-cols-2 gap-4">
          {diseases.map((disease, index) => (
            <div key={index} className="animate-[fadeInUp_0.6s_ease-out_backwards]">
              <div
                className={`bg-white py-4 px-6 rounded-lg shadow-[0_4px_12px_rgba(20,184,166,0.08)] cursor-pointer transition-all duration-300 flex items-center gap-3 border-l-[3px] ${
                  selectedDisease?.name === disease.name
                    ? "bg-teal-50 border-l-teal-500"
                    : "border-l-transparent hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] hover:border-l-teal-500 hover:bg-teal-50"
                }`}
                onClick={() => toggleDisease(disease)}
              >
                <span className="text-teal-500 text-[0.8rem] leading-none">●</span>
                <strong className="flex-1 text-slate-800 font-medium text-[0.95rem]">
                  {disease.name}
                </strong>
                <span
                  className={`w-5 h-5 flex items-center justify-center text-teal-500 text-xl font-light transition-transform duration-300 ${
                    selectedDisease?.name === disease.name ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </div>

              {selectedDisease?.name === disease.name && (
                <div className="bg-white py-4 px-6 mt-2 rounded-lg border-l-[3px] border-l-teal-500 animate-[slideDown_0.3s_ease-out]">
                  <p className="text-slate-600 leading-relaxed text-[0.9rem] m-0">
                    {disease.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tagFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }
      `}</style>
    </>
  );
}
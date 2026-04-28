"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Chest() {
  const router = useRouter();
  const [selectedDisease, setSelectedDisease] = useState(null);

  const diseases = [
    {
      name: "Asthma & COPD",
      description:
        "Chronic respiratory conditions managed with inhalers, medications, and pulmonary rehabilitation."
    },
    {
      name: "Pneumonia",
      description:
        "Lung infection treated with antibiotics, supportive care, and respiratory therapy."
    },
    {
      name: "Tuberculosis (TB)",
      description:
        "Bacterial lung infection treated with long-term antibiotic therapy and monitoring."
    },
    {
      name: "Lung Cancer",
      description:
        "Malignant tumors treated with surgery, chemotherapy, radiation, or targeted therapy."
    },
    {
      name: "Pleural Effusion",
      description:
        "Fluid accumulation around lungs managed with drainage procedures and treatment of underlying cause."
    },
    {
      name: "Chest Pain & Heart Conditions",
      description:
        "Cardiac evaluation including ECG, stress tests, and advanced cardiac care."
    },
    {
      name: "Bronchitis & Respiratory Infections",
      description:
        "Airway inflammation treated with medications, nebulization, and supportive care."
    }
  ];

  const toggleDisease = (disease) => {
    setSelectedDisease(
      selectedDisease?.name === disease.name ? null : disease
    );
  };

  return (
    <div className="font-['Poppins'] text-slate-800 overflow-x-hidden bg-teal-50/30">
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.pinimg.com/1200x/79/ca/cd/79cacd36b206e0e26204d7a48e4f8dc1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-[1000px] px-8 animate-[slideInUp_1s_ease-out]">
          <div className="inline-block bg-white/15 backdrop-blur-[10px] text-white py-2.5 px-6 rounded-full text-sm font-medium mb-6 border border-white/30 animate-[tagFloat_3s_ease-in-out_infinite]">
            🫁 Pulmonology & Chest Care
          </div>
          
          <h1 className="font-['Playfair_Display'] text-[3.5rem] font-bold text-white leading-tight mb-5 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.2s_backwards] max-md:text-[2.2rem] max-sm:text-[1.8rem]">
            Department of Chest & Respiratory Medicine
          </h1>
          
          <p className="text-xl text-white/95 mb-8 max-w-[800px] mx-auto leading-relaxed drop-shadow-[1px_1px_4px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.4s_backwards] max-md:text-base max-sm:text-[0.9rem]">
            Comprehensive care for lung, chest, and respiratory conditions
          </p>
          
          <button
            className="bg-white text-teal-500 py-4 px-12 text-base font-semibold border-0 rounded-full cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.6s_backwards] hover:translate-y-[-4px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:bg-teal-50 max-md:py-3.5 px-9 text-[15px] max-sm:py-3 px-8 text-sm"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1400px] mx-auto my-[100px] px-12 max-md:px-6 max-md:my-[60px] max-sm:px-4">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative max-md:text-[2rem] max-sm:text-[1.7rem]">
            About Chest & Respiratory Care
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-12">
          <div className="relative">
            <p className="text-[1.05rem] leading-relaxed text-slate-600 mb-6 text-justify animate-[fadeIn_0.8s_ease-out_0.1s_backwards] max-sm:text-[0.95rem]">
              The Chest & Respiratory Medicine Department at <strong>Jigyasa Hospital</strong> provides
              comprehensive diagnosis, treatment, and management for disorders
              affecting the lungs, airways, chest, and respiratory system.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-slate-600 mb-0 text-justify animate-[fadeIn_0.8s_ease-out_0.2s_backwards] max-sm:text-[0.95rem]">
              Our pulmonologists and respiratory specialists use advanced
              diagnostic tools including pulmonary function tests, bronchoscopy,
              and imaging to deliver precise care for asthma, COPD, pneumonia,
              tuberculosis, lung infections, and other respiratory conditions
              with a focus on improving breathing and quality of life.
            </p>
          </div>

          <div className="relative animate-[slideInRight_1s_ease-out] max-lg:max-w-[500px] max-lg:mx-auto">
            <img
              src="https://i.pinimg.com/736x/d8/67/b7/d867b7c06c62fcf1a2e2412caa6938bb.jpg"
              alt="Chest & Respiratory Care"
              className="w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(20,184,166,0.15)] transition-all duration-[400ms] ease hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(20,184,166,0.2)]"
            />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[1400px] mx-auto my-[100px] px-12 max-md:px-6 max-md:my-[60px] max-sm:px-4">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative max-md:text-[2rem] max-sm:text-[1.7rem]">
            Gallery
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
        </div>

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
          className="py-12"
        >
          {[1, 2, 3, 4].map((num) => (
            <SwiperSlide key={num}>
              <img
                src={`/gallery${num}.png`}
                alt={`Gallery ${num}`}
                className="w-full h-[300px] object-cover rounded-2xl shadow-[0_8px_30px_rgba(20,184,166,0.12)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:scale-105 hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] max-md:h-[250px] max-sm:h-[200px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Conditions Section */}
      <div className="max-w-[1400px] mx-auto mt-[100px] mb-[60px] px-12 max-md:px-6 max-md:my-[60px] max-sm:px-4">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-800 mb-4 relative max-md:text-[2rem] max-sm:text-[1.7rem]">
            Conditions We Treat
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
        </div>

        <div className="space-y-4">
          {diseases.map((disease, index) => (
            <div key={index} className="animate-[fadeInUp_0.6s_ease-out_backwards]">
              <div
                className={`bg-white py-4 px-6 rounded-lg shadow-[0_4px_12px_rgba(20,184,166,0.08)] cursor-pointer transition-all duration-300 ease flex items-center gap-3 border-l-[3px] ${
                  selectedDisease?.name === disease.name 
                    ? "bg-teal-50/30 border-l-teal-500" 
                    : "border-l-transparent hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] hover:border-l-teal-500 hover:bg-teal-50/30"
                } max-md:py-3 px-5`}
                onClick={() => toggleDisease(disease)}
              >
                <strong className="flex-1 text-slate-800 font-medium text-[0.95rem] max-sm:text-[0.85rem]">
                  {disease.name}
                </strong>
                <span className={`w-5 h-5 flex items-center justify-center text-teal-500 text-xl font-light transition-transform duration-300 ease ${
                  selectedDisease?.name === disease.name ? "rotate-45" : ""
                }`}>
                  +
                </span>
              </div>

              {selectedDisease?.name === disease.name && (
                <div className="bg-white py-4 px-6 mt-2 rounded-lg border-l-[3px] border-l-teal-500 animate-[slideDown_0.3s_ease-out] max-md:py-4 px-5">
                  <p className="text-slate-600 leading-relaxed text-[0.9rem] m-0 max-sm:text-[0.85rem]">
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
    </div>
  );
}
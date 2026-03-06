"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Thigh() {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState(null);

  const conditions = [
    {
      name: "Femur (Thigh Bone) Fractures",
      description:
        "Fractures caused by trauma treated with rods, plates, or screws."
    },
    {
      name: "Hip & Thigh Arthritis",
      description:
        "Degenerative joint disease managed with medication and joint replacement."
    },
    {
      name: "Muscle & Tendon Injuries",
      description:
        "Strains and tears treated with physiotherapy and surgical repair if required."
    },
    {
      name: "Sports Injuries",
      description:
        "Hamstring tears and athletic injuries treated with rehab programs."
    },
    {
      name: "Hip Joint Disorders",
      description:
        "AVN, dislocation and congenital disorders treated surgically."
    },
    {
      name: "Pediatric Thigh Conditions",
      description:
        "Growth plate injuries and congenital deformities managed carefully."
    }
  ];

  const toggleCondition = (condition) => {
    setSelectedCondition(
      selectedCondition?.name === condition.name ? null : condition
    );
  };

  return (
    <div className="overflow-x-hidden bg-teal-50/30">
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: "url('https://i.pinimg.com/1200x/79/ca/cd/79cacd36b206e0e26204d7a48e4f8dc1.jpg')" }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-[1000px] px-8 animate-[slideInUp_1s_ease-out]">
          <div className="inline-block bg-white/15 backdrop-blur-md text-white py-2.5 px-6 rounded-full text-sm font-medium mb-6 border border-white/30 animate-[tagFloat_3s_ease-in-out_infinite]">
            🦴 Orthopedics
          </div>
          
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.2s_backwards]">
            Department of Orthopedics (Thigh Care)
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-[800px] mx-auto leading-relaxed drop-shadow-[1px_1px_4px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.4s_backwards]">
            Advanced treatment for thigh bone, hip & muscle conditions
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
      <div className="max-w-[1400px] mx-auto my-24 px-6 sm:px-8 md:px-12">
        <div className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 relative">
            About Thigh Care Department
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <p className="text-base sm:text-[1.05rem] leading-relaxed text-slate-600 mb-6 text-justify animate-[fadeIn_0.8s_ease-out_0.1s_backwards]">
              The Orthopedic Thigh Care Unit at Jigyasa Hospital provides
              comprehensive diagnosis, treatment, and rehabilitation for
              conditions affecting the thigh bone, hip joint, muscles, and
              surrounding structures.
            </p>
            
            <p className="text-base sm:text-[1.05rem] leading-relaxed text-slate-600 text-justify animate-[fadeIn_0.8s_ease-out_0.2s_backwards]">
              Our experienced orthopedic surgeons specialize in trauma care,
              joint replacement, sports injuries, and rehabilitation with a
              strong focus on restoring mobility, strength, and pain-free
              movement.
            </p>
          </div>

          <div className="relative animate-[slideInRight_1s_ease-out]">
            <img
              src="/orthopedic.jpg"
              alt="Thigh Orthopedics"
              className="w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(20,184,166,0.15)] transition-all duration-400 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(20,184,166,0.2)]"
            />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[1400px] mx-auto my-24 px-6 sm:px-8 md:px-12">
        <div className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 relative">
            Gallery
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
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
            className="gallery-swiper"
          >
            {[1, 2, 3, 4].map((num) => (
              <SwiperSlide key={num}>
                <img
                  src={`/gallery${num}.png`}
                  alt={`Gallery ${num}`}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-2xl shadow-[0_8px_30px_rgba(20,184,166,0.12)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:scale-105 hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="max-w-[1400px] mx-auto my-24 mb-16 px-6 sm:px-8 md:px-12">
        <div className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 relative">
            Conditions We Treat
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded relative after:content-[''] after:absolute after:top-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full"></div>
        </div>

        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={index} className="animate-[fadeInUp_0.6s_ease-out_backwards]">
              <div
                className={`bg-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-[0_4px_12px_rgba(20,184,166,0.08)] cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 border-l-4 ${
                  selectedCondition?.name === condition.name
                    ? "bg-teal-50/30 border-l-teal-500"
                    : "border-l-transparent hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] hover:border-l-teal-500 hover:bg-teal-50/30"
                }`}
                onClick={() => toggleCondition(condition)}
              >
                <strong className="flex-1 text-slate-800 font-medium text-[0.85rem] sm:text-[0.95rem]">
                  {condition.name}
                </strong>
                <span className="w-5 h-5 flex items-center justify-center text-teal-500 text-xl font-light transition-transform duration-300">
                  {selectedCondition?.name === condition.name ? "−" : "+"}
                </span>
              </div>

              {selectedCondition?.name === condition.name && (
                <div className="bg-white py-3 sm:py-4 px-4 sm:px-6 mt-2 rounded-lg border-l-4 border-l-teal-500 animate-[slideDown_0.3s_ease-out]">
                  <p className="text-slate-600 leading-relaxed text-[0.85rem] sm:text-[0.9rem] m-0">
                    {condition.description}
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

        /* Swiper Pagination Customization */
        :global(.gallery-swiper .swiper-pagination-bullet) {
          background: #14b8a6;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }

        :global(.gallery-swiper .swiper-pagination-bullet-active) {
          opacity: 1;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
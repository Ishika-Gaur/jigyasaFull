"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Throat() {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState(null);

  const conditions = [
    {
      name: "Throat Infections",
      description:
        "Pharyngitis and tonsillitis treated with accurate diagnosis and medication."
    },
    {
      name: "Tonsillitis",
      description:
        "Inflammation of tonsils treated medically or with tonsillectomy."
    },
    {
      name: "Voice Disorders",
      description:
        "Hoarseness and vocal cord issues treated with therapy and medication."
    },
    {
      name: "Swallowing Disorders (Dysphagia)",
      description:
        "Difficulty swallowing managed with endoscopy and targeted treatment."
    },
    {
      name: "Laryngitis",
      description:
        "Voice box inflammation treated with medication and voice rest."
    },
    {
      name: "Throat Tumors & Growths",
      description:
        "Benign or malignant throat growths managed surgically or medically."
    }
  ];

  const toggleCondition = (condition) => {
    setSelectedCondition(
      selectedCondition?.name === condition.name ? null : condition
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[550px] bg-[url('https://i.pinimg.com/1200x/79/ca/cd/79cacd36b206e0e26204d7a48e4f8dc1.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        <div className="relative z-[2] text-center max-w-[1000px] px-8 animate-[slideInUp_1s_ease-out]">
          <div className="inline-block bg-white/15 backdrop-blur-xl text-white px-6 py-2.5 rounded-[50px] text-sm font-medium mb-6 border border-white/30 animate-[tagFloat_3s_ease-in-out_infinite]">
            👂 ENT
          </div>
          <h1 className="font-playfair text-[3.5rem] font-bold text-white leading-tight mb-5 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.2s_backwards]">
            Department of ENT (Throat Care)
          </h1>
          <p className="text-xl text-white/95 mb-8 max-w-[800px] mx-auto leading-[1.7] drop-shadow-[1px_1px_4px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out_0.4s_backwards]">
            Complete throat care for infections and voice disorders
          </p>
          <button
            className="bg-white text-teal-500 px-12 py-4 text-base font-semibold border-none rounded-[50px] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-[4px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:bg-teal-50 animate-[fadeIn_1s_ease-out_0.6s_backwards]"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1400px] mx-auto mt-[100px] px-12">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-playfair text-[3rem] font-bold text-slate-800 mb-4 relative after:content-[''] after:absolute after:-top-1 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full">
            About Throat Care Department
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-[2px] relative mt-4">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 rounded-full"></div>
            </div>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <p className="text-lg leading-[1.9] text-slate-600 mb-[1.5rem] text-justify animate-[fadeIn_0.8s_ease-out_0.1s_backwards]">
              The ENT Throat Care Unit at Jigyasa Hospital specializes in the
              diagnosis and treatment of throat-related conditions affecting
              speech, swallowing, and breathing.
            </p>
            <p className="text-lg leading-[1.9] text-slate-600 mb-0 text-justify animate-[fadeIn_0.8s_ease-out_0.2s_backwards]">
              Our experienced ENT specialists manage infections, voice
              disorders, swallowing problems, and throat tumors using advanced
              diagnostic tools and minimally invasive treatment techniques.
            </p>
          </div>

          <div className="relative animate-[slideInRight_1s_ease-out]">
            <img
              src="/ent.jpg"
              alt="ENT Throat Care"
              className="w-full h-auto rounded-[24px] shadow-[0_20px_50px_rgba(20,184,166,0.15)] transition-all duration-400 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(20,184,166,0.2)]"
            />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-[1400px] mx-auto mt-[100px] px-12">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-playfair text-[3rem] font-bold text-slate-800 mb-4 relative">
            Gallery
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-[2px] relative mt-4">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 rounded-full"></div>
            </div>
          </h1>
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
                className="w-full h-[300px] object-cover rounded-2xl shadow-[0_8px_30px_rgba(20,184,166,0.12)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:scale-[1.05] hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Conditions */}
      <div className="max-w-[1400px] mx-auto mt-[100px] mb-[60px] px-12">
        <div className="text-center mb-[60px] animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-playfair text-[3rem] font-bold text-slate-800 mb-4 relative">
            Conditions We Treat
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 mx-auto rounded-[2px] relative mt-4">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 rounded-full"></div>
            </div>
          </h1>
        </div>

        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div 
              key={index} 
              className="animate-[fadeInUp_0.6s_ease-out_backwards]"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div
                className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-300 flex items-center gap-3 border-l-4 border-transparent hover:shadow-md hover:border-teal-500 hover:bg-teal-50 ${selectedCondition?.name === condition.name ? 'bg-teal-50 border-teal-500 shadow-md' : ''}`}
                onClick={() => toggleCondition(condition)}
              >
                <strong className="flex-1 text-slate-800 font-medium text-base">
                  {condition.name}
                </strong>
                <span className={`text-xl font-light text-teal-500 transition-transform duration-300 ${selectedCondition?.name === condition.name ? 'rotate-45' : ''}`}>
                  {selectedCondition?.name === condition.name ? "−" : "+"}
                </span>
              </div>

              {selectedCondition?.name === condition.name && (
                <div className="bg-white p-4 mt-2 rounded-xl border-l-4 border-teal-500 animate-[slideDown_0.3s_ease-out]">
                  <p className="text-slate-600 leading-[1.7] text-sm m-0">
                    {condition.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUserDoctor,
  faStethoscope,
  faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";

// Doctor banner data - All 18 doctors with their complete information
const doctorBanners = [
  {
    id: 1,
    name: "Dr. C.P. Singh",
    title: "Senior Consultant Physician",
    credentials: "M.B.B.S, M.D.(Medicine) KGMC Lucknow",
    quote: "Expert in surgical procedures, ensuring precise treatments, faster recovery, and optimal patient care.",
    image: "/doctors/best-consultant-physician-dr-cp-singh.png",
  },
  {
    id: 2,
    name: "Dr. Amit Kumar Singh",
    title: "Senior Interventional Cardiologist",
    credentials: "MD(BHU), DM Cardiology (KGMU), FSCAI",
    quote: "Committed to Protecting Your Heart with Expertise and Compassion.",
    image: "/doctors/best-cardiologist-dr-amit-kumar-singh.png",
  },
  {
    id: 3,
    name: "Dr. Akansha Singh",
    title: "OBS & Gynecologist",
    credentials: "MBBS MS OBG, Fellowship in ART",
    quote: "Specializing in women's health, maternity care, and reproductive wellness with personalized, compassionate care.",
    image: "/doctors/best-gynecologist-dr-akansha.png",
  },
  {
    id: 4,
    name: "Dr. Sana Ibad Khan",
    title: "Senior Pediatrician",
    credentials: "M.D. (Pediatrics), Fellow Neonatology",
    quote: "Dedicated to child healthcare, offering expert diagnosis, treatment, and preventive care for overall well-being.",
    image: "/doctors/best-pediatrician-dr-sana-ibad-khan.png",
  },
  {
    id: 5,
    name: "Dr. Shariq Ahmad",
    title: "Senior Orthopedician",
    credentials: "MBBS, D. Ortho",
    quote: "Where Precision Medicine Meets Compassionate Healing",
    image: "/doctors/best-orthopediacian-dr-shariq.png",
  },
  {
    id: 6,
    name: "Dr. Vibhor Agarwal",
    title: "General & Laparoscopic Surgeon",
    credentials: "MBBS, MS, FIAGES",
    quote: "Advanced Keyhole Surgery for Faster Healing and Better Outcomes",
    image: "/doctors/best-laparscopic-surgeon-dr-vibhor-agarwal.jpg",
  },
  {
    id: 7,
    name: "Dr. Imran",
    title: "Consultant Neuropsychiatrist",
    credentials: "MBBS KGMU Lucknow DPM (MD) (CIP RANCHI)",
    quote: "Specialized in caring for the brain, spine, and nervous system with comprehensive neuropsychiatric expertise.",
    image: "/doctors/best-neuropsychiatrist-dr-imran.png",
  },
  {
    id: 8,
    name: "Dr. Kriti Kishore",
    title: "Senior Consultant Rheumatology",
    credentials: "MBBS, MD DM (Rheumatologist, KGMU)",
    quote: "Advanced care for joint disorders and autoimmune diseases with comprehensive treatment approaches.",
    image: "/doctors/best-rheumatologist-dr-kriti-kishor.png",
  },
  {
    id: 9,
    name: "Dr. Anil Rajput",
    title: "Plastic Surgeon",
    credentials: "M.B.B.S., M.S., M.Ch. (Plastic Surgery) F.L.C.L.S., F.L.C.S., F.I.H.R.S",
    quote: "Transforming lives through advanced plastic and reconstructive surgery with artistic precision and care.",
    image: "/doctors/best-plastic-surgery-dr-anil-rajput.png",
  },
  {
    id: 10,
    name: "Dr. Abida",
    title: "Senior Consultant Dermatologist",
    credentials: "M.B.B.S., M.D.(JNMCH), PGDD (RIMS) Ex Senior Resident(LNJP, New Delhi)",
    quote: "Expert in treating skin, hair, and nail disorders with advanced dermatological care and precision.",
    image: "/doctors/best-dermatology-dr-abida-ali.png",
  },
  {
    id: 11,
    name: "Dr. Ashish Gupta",
    title: "Consultant Endocrinologist",
    credentials: "MBBS, MD(AIIMS, New Delhi) DM Endo (PGIMER, Chandigarh)",
    quote: "Expert in diabetes, thyroid, hormonal disorders, and reproductive health, providing comprehensive endocrine care.",
    image: "/doctors/best-endocrinologist-dr-ashish-gupta.png",
  },
  {
    id: 12,
    name: "Dr. Deeksha Singh",
    title: "Ophthalmologist",
    credentials: "MBBS, MS Ophthalmology",
    quote: "Providing comprehensive eye care services with modern technology and expert medical care for optimal vision health.",
    image: "/doctors/best-opthalmologist-dr-deeksha-singh.png",
  },
  {
    id: 13,
    name: "Dr. Pabitra Sahu",
    title: "Senior Consultant - Gastroenterology",
    credentials: "Gastroenterology, Hepatology & Endoscopy",
    quote: "Comprehensive care for digestive, liver, and gastrointestinal disorders with advanced diagnostic endoscopy.",
    image: "/doctors/best-gastroenterologist-dr-pavitra-sahu.png",
  },
  {
    id: 14,
    name: "Dr. Pragnesh Desai",
    title: "Principal Consultant - Urology",
    credentials: "Kidney Transplant, Robotic Surgery Specialist",
    quote: "Advanced care for kidney and urinary tract diseases, offering modern urology and minimally invasive robotic surgery.",
    image: "/doctors/best-urologist-dr-parnesh.png",
  },
  {
    id: 15,
    name: "Dr. Faran Naim",
    title: "Senior Consultant - Hematology",
    credentials: "Hematology & Bone Marrow Transplantation",
    quote: "Advanced care for blood disorders and blood cancers, offering comprehensive hematology and bone marrow transplantation.",
    image: "/doctors/best-hematogist-dr-faran.png",
  },
  {
    id: 16,
    name: "Dr. Rahul Kumar",
    title: "Senior GI Surgeon",
    credentials: "MBBS, DNB (General Surgery) DNB (Gastro Surgery)",
    quote: "Advanced surgical care for digestive system disorders with minimally invasive laparoscopic procedures.",
    image: "/doctors/best-gi-surgeon-dr-rahul-singh.png",
  },
  {
    id: 17,
    name: "Dr. Karishma Singh",
    title: "IVF Specialist & Laparoscopic Surgeon",
    credentials: "MBBS, MS (Obst & Gynae) IVF & Gynecologic Surgeon",
    quote: "Comprehensive care for women's health, fertility, and reproductive treatments with advanced laparoscopic techniques.",
    image: "/doctors/best-gynaecologist-dr-karishma.png",
  },
  {
    id: 18,
    name: "Dr. Ankit Singh",
    title: "Family Physician",
    credentials: "MBBS (SRMS, IMS Bareilly)",
    quote: "Comprehensive primary care for all ages, focusing on prevention, diagnosis, and personalized treatment for families.",
    image: "/doctors/best-family-physician-dr-ankit-singh.png",
  },
];

const Heropage = () => {
  const router = useRouter();
  
  const [index, setIndex] = useState(0);

  // Banner slider - cycles through doctors
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % doctorBanners.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(timer);
  }, []);

  const currentDoctor = doctorBanners[index];

  // Individual positioning for each doctor
  const getImagePosition = (doctorId) => {
    const positions = {
      1: 'center 20%',   // Dr. C.P. Singh
      2: 'center 40%',   // Dr. Amit Kumar Singh
      3: 'center 50%',   // Dr. Akansha Singh
      4: 'center 0%',    // Dr. Sana Ibad Khan
      5: 'center 50%',   // Dr. Shariq Ahmad
      6: 'center 15%',   // Dr. Vibhor Agarwal
      7: 'center 80%',   // Dr. Imran
      8: 'center 20%',   // Dr. Kriti Kishore
      9: 'center 20%',   // Dr. Anil Rajput
      10: 'center 100%',  // Dr. Abida
      11: 'center 100%',  // Dr. Ashish Gupta
      12: 'center 100%',  // Dr. Deeksha Singh
      13: 'center 20%',  // Dr. Pabitra Sahu
      14: 'center 20%',  // Dr. Pragnesh Desai
      15: 'center 20%',  // Dr. Faran Naim
      16: 'center 40%',  // Dr. Rahul Kumar
      17: 'center 30%',  // Dr. Karishma Singh
      18: 'center 100%',  // Dr. Ankit Singh
    };
    return positions[doctorId] || 'center 20%';
  };

  return (
    <div className="w-full mx-auto bg-white">
      {/* Doctor Banner Section */}
      <header className="relative w-full h-[400px] sm:h-[450px] md:h-[520px] lg:h-[600px] overflow-hidden bg-gradient-to-r from-teal-600 to-teal-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Doctor Banner Content */}
        <div className="relative h-full flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Left Side - Doctor Image */}
          <div className="flex-shrink-0 w-[160px] sm:w-[220px] md:w-[280px] lg:w-[350px] xl:w-[400px] mt-4 sm:mt-0">
            <div className="relative">
              {/* Decorative Circle Background */}
              <div className="absolute -top-4 sm:-top-6 md:-top-8 -left-4 sm:-left-6 md:-left-8 w-full h-full bg-white/20 rounded-full blur-2xl sm:blur-3xl"></div>
              
              <img
                src={currentDoctor.image}
                alt={currentDoctor.name}
                className="relative w-full h-[180px] sm:h-[280px] md:h-[350px] lg:h-[420px] xl:h-[450px] object-cover rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white transition-all duration-700 bg-white"
                style={{ objectPosition: getImagePosition(currentDoctor.id) }}
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23ffffff" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" font-size="120" text-anchor="middle" dy=".3em" fill="%2314b8a6"%3E${currentDoctor.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>
          </div>

          {/* Right Side - Doctor Info & Quote */}
          <div className="flex-1 w-full sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16 text-white max-w-2xl mt-3 sm:mt-0 px-2 sm:px-0">
            {/* Badge */}
            <div className="inline-block mb-1.5 sm:mb-3 md:mb-4 px-3 sm:px-4 py-1 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold">
              Featured Doctor
            </div>

            {/* Doctor Name */}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 drop-shadow-lg transition-all duration-700 leading-tight">
              {currentDoctor.name}
            </h1>

            {/* Title */}
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1 sm:mb-1.5 md:mb-2 text-teal-50">
              {currentDoctor.title}
            </h2>

            {/* Credentials */}
            <p className="text-xs sm:text-base md:text-lg mb-2 sm:mb-4 md:mb-6 text-teal-100 font-medium">
              {currentDoctor.credentials}
            </p>

            {/* Quote with Quotation Marks */}
            <div className="relative pl-3 sm:pl-6 md:pl-8 border-l-2 sm:border-l-4 border-white/40 mb-2 sm:mb-4 md:mb-0">
              <svg className="absolute -left-1 sm:-left-2 -top-1 sm:-top-2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white/40" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.6-.5 3.6-1.3-.5 2.9-3 5.3-6.1 5.3v4c5.5 0 10-4.5 10-10V8h-7.5zm15 0c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.4 0 2.6-.5 3.6-1.3-.5 2.9-3 5.3-6.1 5.3v4c5.5 0 10-4.5 10-10V8H25z"/>
              </svg>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl italic leading-relaxed text-white/95 line-clamp-2 sm:line-clamp-3">
                "{currentDoctor.quote}"
              </p>
            </div>

            {/* View Profile Button */}
            <button
              onClick={() => router.push(`/doctors/${currentDoctor.id}`)}
              className="hidden sm:inline-block mt-4 md:mt-6 lg:mt-8 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white text-teal-600 font-semibold text-sm sm:text-base rounded-full hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Banner Indicators */}
        <div className="absolute bottom-3 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-2.5 z-[5]">
          {doctorBanners.map((_, idx) => (
            <button
              key={idx}
              className={`h-1.5 sm:h-2.5 md:h-3 border sm:border-2 border-white rounded-full cursor-pointer transition-all duration-300 hover:bg-white/80 hover:scale-110 ${
                idx === index 
                  ? 'w-5 sm:w-7 md:w-8 bg-white rounded-md' 
                  : 'w-1.5 sm:w-2.5 md:w-3 bg-white/50'
              }`}
              onClick={() => setIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </header>

      {/* Quick Action Cards */}
      <div className="px-3 sm:px-4 md:px-5 my-6 sm:my-8 md:my-10 max-w-[1100px] mx-auto">
        <ul className="list-none grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-[30px] p-0 m-0">
          <li 
            className="bg-[#25b1a8] text-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 lg:p-[30px_20px] text-center font-normal text-xs sm:text-sm md:text-base transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center hover:bg-[#16a2a2] hover:-translate-y-1 active:scale-95"
            onClick={() => router.push('/doctors')}
          >
            <FontAwesomeIcon
              className="mt-1 sm:mt-2 md:mt-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-white"
              icon={faCalendarDays}
            />
            <span className="mt-1.5 sm:mt-2 leading-tight">BOOK APPOINTMENT</span>
          </li>

          <li 
            className="bg-[#25b1a8] text-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 lg:p-[30px_20px] text-center font-normal text-xs sm:text-sm md:text-base transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center hover:bg-[#16a2a2] hover:-translate-y-1 active:scale-95"
            onClick={() => router.push('/support')}
          >
            <FontAwesomeIcon
              className="mt-1 sm:mt-2 md:mt-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-white"
              icon={faUserDoctor}
            />
            <span className="mt-1.5 sm:mt-2 leading-tight">BOOK A VIRTUAL CONSULTATION</span>
          </li>

          <li 
            className="bg-[#25b1a8] text-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 lg:p-[30px_20px] text-center font-normal text-xs sm:text-sm md:text-base transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center hover:bg-[#16a2a2] hover:-translate-y-1 active:scale-95"
            onClick={() => router.push('/support')}
          >
            <FontAwesomeIcon
              className="mt-1 sm:mt-2 md:mt-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-white"
              icon={faStethoscope}
            />
            <span className="mt-1.5 sm:mt-2 leading-tight">BOOK A TEST</span>
          </li>

          <li 
            className="bg-[#25b1a8] text-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 lg:p-[30px_20px] text-center font-normal text-xs sm:text-sm md:text-base transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col items-center hover:bg-[#16a2a2] hover:-translate-y-1 active:scale-95"
            onClick={() => router.push('/support')}
          >
            <FontAwesomeIcon
              className="mt-1 sm:mt-2 md:mt-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-white"
              icon={faHeartPulse}
            />
            <span className="mt-1.5 sm:mt-2 leading-tight">HEALTH CHECKUP</span>
          </li>
        </ul>
      </div>

      <style jsx>{`
        /* Line clamp utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Heropage;
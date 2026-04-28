"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useRouter } from "next/navigation";


const Expertsection = () => {
  const router = useRouter();

  const doctorList = [
    {
      name: "Dr. C.P. Singh",
      title:
        "Senior Consultant Physician M.B.B.S, M.D.(Medicine) KGMC Lucknow",
      description:
        "Expert in surgical procedures, ensuring precise treatments, faster recovery, and optimal patient care.",
      image: "/doctors/best-consultant-physician-dr-cp-singh.png",
    },
    {
      name: "Dr. Amit Kumar Singh",
      title:
        "MD(BHU), DM Cardiology (KGMU), FSCAI Senior Interventional Cardiologist",
      description:
        "Committed to Protecting Your Heart with Expertise and Compassion.",
      image: "/doctors/best-cardiologist-dr-amit-kumar-singh.png",
    },
    {
      name: "Dr. Akansha Singh",
      title: "MBBS MS OBG,Fellowship in ART OBS & Gynecologist",
      description:
        "Specializing in women's health, maternity care, and reproductive wellness with personalized, compassionate care.",
      image: "/doctors/dr-akansha-singh2.jpg",
    },
    {
      name: "Dr. Sana Ibad Khan",
      title: "M.D. (Pediatrics), Fellow Neonatology Senior Pediatrician",
      description:
        "Dedicated to child healthcare, offering expert diagnosis, treatment, and preventive care for overall well-being.",
      image: "/doctors/best-pediatrician-dr-sana-ibad-khan.png",
    },
    {
      name: "Dr. Shariq Ahmad",
      title: "MBBS, D. Ortho Senior Orthopedician",
      description: "Where Precision Medicine Meets Compassionate Healing",
      image: "/doctors/best-orthopediacian-dr-shariq.png",
    },
    {
      name: "Dr. Vibhor Agarwal",
      title: "MBBS, MS, FIAGES General & Laparoscopic Surgeon",
      description:
        "Advanced Keyhole Surgery for Faster Healing and Better Outcomes",
      image: "/doctors/best-laparscopic-surgeon-dr-vibhor-agarwal.jpg",
    },
  ];

  return (
    <div className="px-[5%] py-[60px] md:py-10 sm:py-[35px] text-center bg-[#f9fafb]">
      <h2 className="inline-block text-base sm:text-sm text-[#25b1a8] font-semibold mb-2.5 uppercase bg-[#cff0ef] px-2.5 py-1 rounded">
        OUR EXPERTS
      </h2>

      <h1 className="text-4xl md:text-[28px] sm:text-2xl font-bold text-[#111827] mb-4">
        Our Medical Specialists
      </h1>

      <p className="max-w-[800px] mx-auto mb-10 md:mb-[30px] text-base md:text-[15px] sm:text-sm leading-relaxed sm:leading-normal text-black">
        Our team of highly skilled and experienced medical specialists is
        dedicated to providing exceptional care across various fields of
        medicine. With expertise in diagnostics, treatment, and preventive care,
        our specialists work together to ensure you and your family receive
        comprehensive, compassionate, and personalized healthcare.
      </p>

      {/* Swiper Carousel */}
      <div className="px-[5%] md:px-[3%] sm:px-[2%] pt-5 md:pt-4 sm:pt-2.5 pb-[60px] md:pb-[50px] sm:pb-[45px] relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="!pb-12"
        >
          {doctorList.map((doc, index) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div className="ml-10 md:ml-0 w-4/5 md:w-[90%] sm:w-[92%] max-w-none md:max-w-[400px] bg-white rounded-xl text-center p-5 md:p-4 sm:p-3.5 shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-transform duration-200 flex-[0_0_80%] snap-start min-w-[280px] mb-10 flex flex-col h-full mx-auto hover:-translate-y-1.5">
                <div
                  className="w-full h-[280px] md:h-[320px] sm:h-[340px] xs:h-[300px] bg-cover bg-[center_top] bg-no-repeat rounded-lg mb-3 overflow-hidden flex-shrink-0"
                  style={{
                    backgroundImage: `url(${doc.image})`,
                  }}
                />

                <h3 className="my-2 mx-0 text-[1.1rem] md:text-base sm:text-[0.95rem] xs:text-[0.9rem] mt-1.5 mb-1 md:mt-1.5 md:mb-[3px] sm:mt-[5px] sm:mb-0.5">
                  {doc.name}
                </h3>

                <p className="font-bold text-[#00b5ad] mb-2 md:mb-1.5 sm:mb-1 text-[0.9rem] md:text-[0.8rem] sm:text-xs xs:text-[0.72rem] leading-[1.3] md:leading-[1.2]">
                  {doc.title}
                </p>

                <p className="text-[0.85rem] md:text-xs sm:text-[0.7rem] xs:text-[0.68rem] text-[#555] leading-[1.4] md:leading-[1.3] sm:leading-[1.25] flex-grow">
                  {doc.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* View All Doctors Button */}
      <div className="flex justify-center items-center mt-5 pb-5">
        <button
          className="py-3 md:py-[11px] sm:py-2.5 px-8 md:px-7 sm:px-6 bg-[#00b5ad] text-white border-none rounded-lg font-semibold text-base md:text-[15px] sm:text-sm cursor-pointer transition-all duration-300 shadow-[0_4px_6px_rgba(0,181,173,0.2)] hover:bg-[#019c95] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,181,173,0.3)]"
          onClick={() => router.push("/doctors")}
        >
          View All Doctors
        </button>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          text-align: center;
        }

        .swiper-pagination-bullet {
          background: #00b5ad;
          opacity: 0.6;
          width: 10px;
          height: 10px;
          margin: 0 4px !important;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default Expertsection;
"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

export default function HospitalVideoGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalVideo, setModalVideo] = useState(null);

  const videoItems = [
     {
      id: 1,
      category: 'patients',
      videoUrl: 'freeMegaCampVideo.mp4',
      thumbnail: 'freeCamp.png',
      title: 'Free Mega Health Camp at Jigyasa Hospital',
      description: 'A video showcasing the Free Mega Health Camp at Jigyasa Super Speciality Hospital, where patients received free consultations and health check-ups.',
      duration: '1:31'
    },
    {
      id: 2,
      category: 'all',
      videoUrl: 'republicDayVideo.mp4',
      thumbnail: 'republicDay.png',
      title: 'Republic Day Celebration at Jigyasa Hospital',
      description: 'A video capturing the Republic Day celebration at Jigyasa Super Speciality Hospital, honoring the spirit of unity, patriotism, and national pride.',
      duration: '0:42'
    },
    {
      id: 3,
      category: 'patients',
      videoUrl: 'opdCampVideo.mp4',
      thumbnail: 'opdCamp.png',
      title: 'Free OPD Health Camp at Jigyasa Hospital',
      description: 'A free OPD camp organized by Jigyasa Super Speciality Hospital, providing consultations and basic health services to patients.',
      duration: '0:30'
    },
    {
      id: 4,
      category: 'doctors',
      videoUrl: 'pregencyCareAdviceVideo.mp4',
      thumbnail: '/doctors/best-gynecologist-dr-akansha.png',
      title: 'Pregnancy Care Advice by Dr. Akasha Singh',
      description: 'Dr. Akasha Singh shares expert advice on safe pregnancy care, maternal health, and important precautions for expecting mothers.',
      duration: '0:54'
    },
    {
      id: 5,
      category: 'doctors',
      videoUrl: 'heartCareAdvice.mp4',
      thumbnail: '/doctors/best-cardiologist-dr-amit-kumar-singh.png',
      title: 'Heart Care Advice by Dr. Amit Kumar Singh',
      description: 'Learn about our patient-centered approach to healthcare and recovery.',
      duration: '1:24'
    },
    {
      id: 6,
      category: 'doctors',
      videoUrl: 'boneCareAdviceVideo.mp4',
      thumbnail: '/doctors/best-orthopediacian-dr-shariq.png',
      title: 'Bone Care Advice by Dr. Shariq Ahmad',
      description: 'Dr. Shariq Ahmad shares expert advice on bone health, joint care, and prevention of bone-related problems.',
      duration: '1:07'
    },
    {
      id: 7,
      category: 'doctors',
      videoUrl: 'skinCareAdviceVideo.mp4',
      thumbnail: '/doctors/best-dermatology-dr-abida-ali.png',
      title: 'Skin Care Advice by Dr. Abida Ali',
      description: 'Dr. Abida Ali shares expert tips on skin care, common skin concerns, and maintaining healthy skin.',
      duration: '1:32'
    },
    {
      id: 8,
      category: 'doctors',
      videoUrl: 'trainingvd.mp4',
      thumbnail: 'training.png',
      title: 'Infection Control & Hand Hygiene Training',
      description: 'A training session focused on infection control practices and proper hand hygiene to ensure patient safety and prevent the spread of infections.',
      duration: '0:56'
    },
    {
      id: 9,
      category: 'all',
      videoUrl: 'HeartDayVd.mp4',
      thumbnail: 'worldHeartDay.jpeg',
      title: 'World Heart Day Celebration at Jigyasa Hospital',
      description: 'A video capturing the World Heart Day celebration at Jigyasa Super Speciality Hospital, spreading awareness about heart health and healthy living.',
      duration: '0:39'
    },
    {
      id: 10,
      category: 'equipment',
      videoUrl: 'dialysisService.mp4',
      thumbnail: 'opreation.png',
      title: 'Available Dialysis Services at Jigyasa Hospital',
      description: 'Jigyasa Super Speciality Hospital offers reliable dialysis services with modern equipment and expert care for kidney patients.',
      duration: '0:58'
    },
    {
      id: 11,
      category: 'patients',
      videoUrl: 'patientCareVd.mp4',
      thumbnail: 'ph-5.jpeg',
      title: 'Doctors Care & Concern for Patients',
      description: 'A video highlighting the doctors dedication, compassion, and continuous care towards patients health and well-being.',
      duration: '0:29'
    },
  ];

  const filters = [
    { id: "all", label: "All Videos" },
    { id: "equipment", label: "Equipment" },
    { id: "doctors", label: "Doctors" },
    { id: "patients", label: "Patient Care" },
  ];

  const filtered =
    activeFilter === "all"
      ? videoItems
      : videoItems.filter((item) => item.category === activeFilter);

  const openModal = (video) => {
    setModalVideo(video);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalVideo(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#f4f6fb] to-[#e8f0fe] min-h-screen">

      {/* HERO */}
      <section
        className="h-[40vh] md:h-[60vh] flex items-center justify-center text-white text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Hospital Video Gallery
        </h1>
      </section>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-4 py-10">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-teal-500 text-white border-teal-500 shadow-lg"
                : "bg-white text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => openModal(item)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border border-teal-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* THUMBNAIL */}
            <div className="relative h-[250px] overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-400 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                  <div className="w-0 h-0 border-l-[18px] border-l-white border-y-[12px] border-y-transparent ml-1"></div>
                </div>
              </div>

              {/* Duration */}
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {item.duration}
              </span>
            </div>

            {/* INFO */}
            <div className="p-5">
              <h3 className="font-bold text-lg group-hover:text-teal-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalVideo && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-video"
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-4xl font-bold hover:text-teal-400"
            >
              ×
            </button>

            <video
              src={modalVideo.videoUrl}
              controls
              autoPlay
              className="w-full h-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
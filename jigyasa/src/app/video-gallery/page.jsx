"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "@/components/Footer";

const VIDEO_API = "http://localhost:4000/api/videos";

export default function HospitalVideoGallery() {
  const [activeFilter, setActiveFilter] = useState("all_videos");
  const [modalVideo,   setModalVideo]   = useState(null);
  const [videoItems,   setVideoItems]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isAdmin,      setIsAdmin]      = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    axios.get(VIDEO_API)
      .then((res) => setVideoItems(res.data))
      .catch((e) => console.error("Error fetching videos:", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/api/auth/me", { withCredentials: true })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  const deleteVideo = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this video?")) return;
    try {
      await axios.delete(`${VIDEO_API}/${id}`, { withCredentials: true });
      setVideoItems((prev) => prev.filter((v) => (v._id || v.id) !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  // ── FIXED: filters match the real category values stored in DB ──
  const filters = [
    { id: "all_videos",  label: "All Videos",   matchFn: () => true },
    { id: "hospital",    label: "Hospital",      matchFn: (cat) => cat === "hospital" },
    { id: "equipment",   label: "Equipment",     matchFn: (cat) => cat === "equipment" },
    { id: "doctors",     label: "Doctor",        matchFn: (cat) => cat === "doctors" || cat === "doctor" },
    { id: "patients",    label: "Patient Care",  matchFn: (cat) => cat === "patients" || cat === "patientcare" },
  ];

  const activeFilterObj = filters.find((f) => f.id === activeFilter) || filters[0];

  const filtered = videoItems.filter((item) =>
    activeFilterObj.matchFn((item.category || "").toLowerCase().trim())
  );

  const getId = (item) => item._id || item.id;

  const openModal = (video) => {
    setModalVideo(video);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    setModalVideo(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeModal(); };
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
        <div>
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Hospital Video Gallery
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/70">
            Explore our hospital's services, events, and expert care
          </p>
        </div>
      </section>

      {/* ── FILTERS (FIXED) ── */}
      <div className="flex flex-wrap justify-center gap-3 py-10 px-4">
        {filters.map((filter) => {
          return (
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
          );
        })}
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-5xl mb-4">🎬</div>
            <p className="text-gray-500 font-semibold">No videos in this category yet.</p>
          </div>
        )}

        {!loading &&
          filtered.map((item) => {
            const id = getId(item);
            return (
              <div
                key={id}
                onClick={() => openModal(item)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border border-teal-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
              >
                {/* THUMBNAIL */}
                <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100">
                  <img
                    src={`${VIDEO_API}/${id}/thumbnail`}
                    alt={item.title}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: item.thumbnailPosition || "50% 50%" }}
                    onError={(e) => {
                      // fallback: hide broken img, show placeholder
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-400 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  {item.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      ▶ {item.duration}
                    </span>
                  )}

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-teal-500/90 text-white capitalize backdrop-blur-sm">
                    {item.category}
                  </span>

                  {/* Admin delete */}
                  {isAdmin && (
                    <button
                      onClick={(e) => deleteVideo(id, e)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>

                {/* INFO */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* ── VIDEO MODAL ── */}
      {modalVideo && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative", width: "100%", maxWidth: "860px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
            }}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              style={{
                alignSelf: "flex-end",
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                color: "white", width: 36, height: 36, borderRadius: "50%",
                fontSize: 20, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>

            <video
              ref={videoRef}
              key={getId(modalVideo)}
              src={`${VIDEO_API}/${getId(modalVideo)}/video`}
              controls
              autoPlay
              crossOrigin="anonymous"
              style={{
                width: "100%", maxHeight: "75vh", borderRadius: "16px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)", background: "#000", display: "block",
              }}
              onError={(e) => {
                console.error("Video load error:", e.currentTarget.src, e.currentTarget.error);
              }}
            />

            {/* Title */}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 700, margin: 0 }}>
                {modalVideo.title}
              </p>
              {modalVideo.category && (
                <span style={{
                  display: "inline-block", marginTop: 6,
                  fontSize: 11, fontWeight: 600,
                  background: "rgba(20,184,166,0.25)", color: "#5eead4",
                  border: "1px solid rgba(20,184,166,0.4)",
                  padding: "2px 12px", borderRadius: 100, textTransform: "capitalize",
                }}>
                  {modalVideo.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Footer from "@/components/Footer";

const HospitalGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Admin state

  // ✅ Fetch Gallery Data
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/gallery");
        setGalleryItems(res.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // ✅ Check if admin is logged in
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await axios.get("http://localhost:4000/api/auth/me", {
          withCredentials: true,
        });
        setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // ✅ Delete gallery item (admin only)
  const deleteGalleryItem = async (id, e) => {
    e.stopPropagation(); // prevent opening modal
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/gallery/${id}`, {
        withCredentials: true,
      });
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "equipment", label: "Equipment" },
    { id: "doctors", label: "Doctors" },
    { id: "patients", label: "Patient Care" },
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const openModal = useCallback((item) => {
    setSelectedItem(item);
    setCurrentSlideIndex(0);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setCurrentSlideIndex(0);
    document.body.style.overflow = "auto";
  }, []);

  // ✅ Use imageCount (from backend) with fallback
  const getTotalImages = (item) => item?.imageCount ?? item?.images?.length ?? 0;

  const goToNextSlide = () => {
    if (!selectedItem) return;
    const total = getTotalImages(selectedItem);
    setCurrentSlideIndex((prev) => (prev + 1) % total);
  };

  const goToPrevSlide = () => {
    if (!selectedItem) return;
    const total = getTotalImages(selectedItem);
    setCurrentSlideIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

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
        <h1 className="text-4xl md:text-6xl font-bold">
          Hospital Photo Gallery
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
      <div className="max-w-7xl mx-auto px-6 pb-20 grid gap-8 grid-cols-2 md:grid-cols-3">

        {loading && (
          <p className="col-span-full text-center text-gray-500">Loading...</p>
        )}

        {!loading && filteredItems.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No photos available</p>
        )}

        {!loading &&
          filteredItems.map((item) => {
            const totalImages = getTotalImages(item);

            return (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border border-teal-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
              >
                {/* Featured Image */}
                <div className="relative h-[250px] overflow-hidden">
                  <img
                    src={`http://localhost:4000/api/gallery/${item.id}/featured`}
                    alt={item.title}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Image count badge */}
                  {totalImages > 1 && (
                    <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                      +{totalImages - 1} more
                    </div>
                  )}

                  {/* ✅ Delete Button — only visible to admin, shown on hover */}
                  {isAdmin && (
                    <button
                      onClick={(e) => deleteGalleryItem(item.id, e)}
                      className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-1"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg group-hover:text-teal-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                  <span className="inline-block mt-3 text-xs bg-teal-50 text-teal-600 border border-teal-200 px-3 py-1 rounded-full capitalize">
{item.category
  ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
  : "Unknown"}
</span>
                </div>
              </div>
            );
          })}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-full flex items-center justify-center text-xl font-bold transition"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row">

              {/* LEFT — Main Image with arrows */}
              <div className="relative flex-1 bg-gray-50 flex items-center justify-center min-h-[350px] md:min-h-[500px]">

                {/* Prev Arrow */}
                <button
                  onClick={goToPrevSlide}
                  className="absolute left-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-2xl text-teal-500 hover:bg-teal-500 hover:text-white transition"
                >
                  ‹
                </button>

                <img
                  src={`http://localhost:4000/api/gallery/${selectedItem.id}/image/${currentSlideIndex}`}
                  alt={selectedItem.title}
                  crossOrigin="anonymous"
                  className="w-full max-h-[500px] object-contain p-4"
                />

                {/* Next Arrow */}
                <button
                  onClick={goToNextSlide}
                  className="absolute right-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-2xl text-teal-500 hover:bg-teal-500 hover:text-white transition"
                >
                  ›
                </button>

                {/* Slide Counter */}
                <div className="absolute bottom-4 right-4 bg-teal-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  {currentSlideIndex + 1} / {getTotalImages(selectedItem)}
                </div>
              </div>

              {/* RIGHT — Info Panel */}
              <div className="w-full md:w-[300px] border-t md:border-t-0 md:border-l border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto max-h-[500px]">

                {/* Title & Category */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedItem.title}
                  </h2>
                  <span className="inline-block mt-2 text-xs bg-teal-50 text-teal-600 border border-teal-200 px-3 py-1 rounded-full capitalize">
                    {selectedItem.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-3">
                    {selectedItem.description}
                  </p>
                </div>

                {/* ✅ Admin Delete Button in Modal */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      deleteGalleryItem(selectedItem.id, e);
                      closeModal();
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    🗑 Delete This Gallery Item
                  </button>
                )}

                {/* Thumbnail Strip */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">
                    All Images ({getTotalImages(selectedItem)})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: getTotalImages(selectedItem) }).map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition ${
                          currentSlideIndex === idx
                            ? "border-teal-500 shadow-md"
                            : "border-transparent hover:border-teal-300"
                        }`}
                      >
                        <img
                          src={`http://localhost:4000/api/gallery/${selectedItem.id}/image/${idx}`}
                          alt={`slide ${idx + 1}`}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white text-xs rounded-full flex items-center justify-center">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HospitalGallery;
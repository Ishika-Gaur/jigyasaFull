"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

// ✅ Fallback data (used if API fails or while loading)
const fallbackDepartments = [
  {
    title: "General Medicine",
    route: "bodyparts/genernalmedicine",
    image: "https://i.pinimg.com/1200x/dc/d6/b1/dcd6b156b180593af3ee59e074247432.jpg",
    desc: "Our General Medicine department offers comprehensive care for the diagnosis, treatment, and prevention of a wide range of acute and chronic health conditions.",
  },
  {
    title: "Cardiology",
    route: "bodyparts/hearts",
    image: "https://i.pinimg.com/1200x/a6/2e/10/a62e1080d05299200f201e023e657747.jpg",
    desc: "Cardiology focuses on the heart and blood vessels, ensuring every beat keeps you strong and healthy.",
  },
  {
    title: "Gynecology",
    route: "bodyparts/reproductive",
    image: "https://i.pinimg.com/1200x/36/26/89/36268912b7ce777e1826a248129c4442.jpg",
    desc: "Gynecology is a medical specialty dedicated to women's health, focusing on the reproductive system and overall well-being at every stage of life.",
  },
  {
    title: "Pediatrics",
    route: "bodyparts/throat",
    image: "https://i.pinimg.com/736x/01/68/c5/0168c569dd21951b97bf6e7b11cca6ab.jpg",
    desc: "Pediatrics specializes in the health and development of infants, children, and adolescents.",
  },
  {
    title: "Orthopedics",
    route: "bodyparts/knee",
    image: "https://i.pinimg.com/1200x/f0/7d/6c/f07d6c3299d53f64b121d4370d70a470.jpg",
    desc: "Orthopedics focuses on diagnosis, treatment, and prevention of conditions affecting bones, joints, muscles, ligaments, and the spine.",
  },
  {
    title: "Laparoscopic Surgery",
    route: "bodyparts/liver",
    image: "https://i.pinimg.com/1200x/40/b2/76/40b276d348755ea850bd57b28091d07a.jpg",
    desc: "Laparoscopic surgery uses small incisions and advanced technology for precision procedures with minimal discomfort.",
  },
  {
    title: "GI & General Surgery",
    route: "bodyparts/varicose",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400",
    desc: "GI and General Surgery covers surgical treatment of digestive system disorders and other abdominal conditions.",
  },
  {
    title: "Oral & Maxillofacial Surgery",
    route: "bodyparts/teeth",
    image: "https://i.pinimg.com/736x/d1/09/14/d10914cd89cf455e6229427211868094.jpg",
    desc: "This specialty treats conditions affecting the mouth, jaw, face, and neck.",
  },
  {
    title: "Dermatology",
    route: "bodyparts/skin",
    image: "https://i.pinimg.com/736x/86/dc/85/86dc8516af7720bc2a4b16c1d664ef70.jpg",
    desc: "Dermatology focuses on skin, hair, and nail health, providing medical and cosmetic treatments.",
  },
  {
    title: "Family Medicine",
    route: "bodyparts/body",
    image: "https://i.pinimg.com/1200x/66/5b/53/665b53c70b3c0655b8d503598bcb42b7.jpg",
    desc: "Family Medicine offers comprehensive healthcare for individuals and families across all age groups.",
  },
  {
    title: "Neurosurgery",
    route: "bodyparts/brain",
    image: "https://i.pinimg.com/1200x/e4/be/35/e4be35a1f9fa2848acbd7c465dcf80cb.jpg",
    desc: "Neurosurgery focuses on surgical treatment of brain, spine, and nervous system disorders.",
  },
  {
    title: "Psychiatry",
    route: "bodyparts/mind",
    image: "https://i.pinimg.com/1200x/77/07/33/770733699f05aec6985da6bb637ce4c8.jpg",
    desc: "Psychiatry addresses mental health and emotional well-being through therapy, medication, and holistic approaches.",
  },
  {
    title: "Plastic Surgery",
    route: "bodyparts/face",
    image: "https://i.pinimg.com/736x/3c/69/e6/3c69e6fa3ccd106989554a8ad1ccbff1.jpg",
    desc: "Plastic Surgery combines science and artistry to restore, reconstruct, and enhance appearance.",
  },
  {
    title: "Endocrinology",
    route: "bodyparts/endocrinology",
    image: "https://i.pinimg.com/736x/32/f0/89/32f0890b0016f09b19e3c8575a5ce163.jpg",
    desc: "Endocrinology treats hormone-related disorders including diabetes, thyroid conditions, and metabolic issues.",
  },
  {
    title: "Gastroenterology",
    route: "bodyparts/stomach",
    image: "https://i.pinimg.com/736x/97/7b/8d/977b8d027da926d86dfaf045952a63da.jpg",
    desc: "Gastroenterology focuses on digestive system disorders including liver, pancreas, intestines, and stomach.",
  },
  {
    title: "Rheumatology",
    route: "bodyparts/knee",
    image: "https://i.pinimg.com/1200x/ae/97/25/ae972599b45a19d4fcc369fac9e6f67a.jpg",
    desc: "Rheumatology treats autoimmune and inflammatory joint and muscle disorders.",
  },
  {
    title: "Ophthalmology",
    route: "bodyparts/eye",
    image: "https://i.pinimg.com/736x/74/7a/85/747a8574c9132132d907418d7eba5d01.jpg",
    desc: "Ophthalmology provides complete eye care including diagnosis, treatment, and advanced eye surgeries.",
  },
  {
    title: "Radiology",
    route: "bodyparts/chest",
    image: "https://i.pinimg.com/736x/1f/c2/33/1fc233f62827a5ebb37fa077b1caa6da.jpg",
    desc: "Radiology uses advanced imaging techniques like X-rays, CT scans, and MRI for accurate diagnosis.",
  },
];

export default function Department() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const res = await axios.get("http://localhost:4000/api/departments");
      
      // ✅ Handle both array response and { data: [...] } response shapes
      const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.departments || [];
      
      if (data.length === 0) {
        // API returned empty — fall back to static data
        setDepartments(fallbackDepartments);
        setUsingFallback(true);
      } else {
        setDepartments(data);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      // ✅ API unavailable — silently use fallback data
      setDepartments(fallbackDepartments);
      setUsingFallback(true);
      setError(err?.response?.data?.message || err?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Helper: get image src — handles API url string OR base64 buffer OR fallback url
  const getImageSrc = (dept) => {
    if (dept.image && typeof dept.image === "string") return dept.image;
    if (dept.imageUrl) return dept.imageUrl;
    if (dept._id) return `http://localhost:4000/api/departments/${dept._id}/image`;
    return "/hospital.png"; // final fallback
  };

  // ✅ Helper: get route — API may return `route` or `slug` or `_id`
  const getRoute = (dept) => {
    if (dept.route) return dept.route;
    if (dept.slug) return `bodyparts/${dept.slug}`;
    return "#";
  };

  return (
    <div className="bg-gradient-to-br from-[#f4f6fb] to-[#e8f0fe]">
      {/* Hero Section */}
      <section
        className="h-[40vh] md:h-[60vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
        }}
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">
            Departments
          </h1>
          {usingFallback && !loading && (
            <p className="mt-3 text-sm text-blue-200 opacity-80">
              Showing default departments
            </p>
          )}
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-teal-500" size={48} />
          <p className="text-gray-500 text-lg font-medium">Loading departments...</p>
        </div>
      )}

      {/* Error Banner (only if API failed AND no fallback loaded) */}
      {error && !usingFallback && !loading && (
        <div className="max-w-2xl mx-auto mt-8 px-4">
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
            <button
              onClick={fetchDepartments}
              className="flex items-center gap-1 text-xs font-semibold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-full transition"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Cards Section */}
      {!loading && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, index) => (
            <div
              key={dept._id || index}
              onClick={() => router.push(getRoute(dept))}
              className="cursor-pointer bg-gradient-to-br from-white to-[#f8fbff] rounded-2xl p-4 md:p-8 shadow-lg border border-teal-100
              transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
            >
              {/* Circular Image */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 rounded-full overflow-hidden shadow-md ring-4 ring-teal-100">
                <Image
                  src={getImageSrc(dept)}
                  alt={dept.title || dept.name || "Department"}
                  fill
                  className="object-cover"
                  // ✅ Fallback if image fails to load
                  onError={(e) => { e.target.src = "/hospital.png"; }}
                  unoptimized // needed for external URLs from API
                />
              </div>

              {/* Title */}
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-gray-900 hover:text-teal-500 transition-colors text-left">
                {dept.title || dept.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-4 md:line-clamp-5 text-left">
                {dept.desc || dept.description}
              </p>
            </div>
          ))}
        </section>
      )}

      <Footer />
    </div>
  );
}
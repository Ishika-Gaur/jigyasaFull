// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { Clock, Calendar, Stethoscope, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
// import { doctorsData } from '../data/doctorsData';
// import Footer from "@/components/Footer";

// const API_DOCTORS = "http://localhost:4000/api/doctors";

// // ── Resolve the correct image src (mirrors logic from the listing page) ──
// function getImageSrc(doc) {
//   const id = doc._id || doc.id;

//   if (doc.image && typeof doc.image === "object" && doc.image.contentType) {
//     return `${API_DOCTORS}/${id}/image`;
//   }
//   if (doc.image && typeof doc.image === "object" && doc.image.data) {
//     if (typeof doc.image.data === "string") {
//       const prefix = doc.image.contentType
//         ? `data:${doc.image.contentType};base64,`
//         : "data:image/jpeg;base64,";
//       return `${prefix}${doc.image.data}`;
//     }
//     return `${API_DOCTORS}/${id}/image`;
//   }
//   if (doc.imageUrl && typeof doc.imageUrl === "string" && doc.imageUrl.length > 4) {
//     return doc.imageUrl;
//   }
//   if (doc.image && typeof doc.image === "string" && doc.image.startsWith("http")) {
//     return doc.image;
//   }
//   if (doc.image && typeof doc.image === "string" && doc.image.length > 0) {
//     return doc.image;
//   }
//   if (doc.has_image || doc.hasImage) {
//     return `${API_DOCTORS}/${id}/image`;
//   }
//   if (id) {
//     return `${API_DOCTORS}/${id}/image`;
//   }
//   return null;
// }

// export default function DoctorProfile() {
//   const params = useParams();
//   const rawId = params.id;

//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);
//   const [showAllDiseases, setShowAllDiseases] = useState(false);

//   useEffect(() => {
//     if (!rawId) return;

//     // 1️⃣  Try static data first (works for numeric ids like 1, 2, 3…)
//     const staticDoctor = doctorsData.find(
//       (d) => String(d.id) === String(rawId) || d._id === rawId
//     );

//     if (staticDoctor) {
//       setDoctor(staticDoctor);
//       setLoading(false);
//       return;
//     }

//     // 2️⃣  Fall back to API (works for PostgreSQL/MongoDB _id from the listing page)
//     const fetchDoctor = async () => {
//       try {
//         const res = await fetch(`${API_DOCTORS}/${rawId}`);
//         if (!res.ok) throw new Error("Not found");
//         const data = await res.json();
//         setDoctor(data);
//       } catch (err) {
//         console.error("Failed to fetch doctor:", err);
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctor();
//   }, [rawId]);

//   // ── Loading state ──
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-teal-50 to-white">
//         <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
//         <p className="text-gray-500 font-medium">Loading doctor profile…</p>
//       </div>
//     );
//   }

//   // ── Not found state ──
//   if (notFound || !doctor) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-teal-50 to-white">
//         <div className="text-5xl">🩺</div>
//         <h2 className="text-2xl font-bold text-gray-700">Doctor Not Found</h2>
//         <p className="text-gray-400 text-sm">The requested doctor profile could not be loaded.</p>
//       </div>
//     );
//   }

//   // ── Normalise fields — API may use slightly different key names ──
//   const specialization = doctor.specialization || doctor.specialty || "";
//   const imageSrc = getImageSrc(doctor);
//   const diseases = doctor.diseases || [];
//   const displayedDiseases = showAllDiseases ? diseases : diseases.slice(0, 6);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">

//       {/* HERO SECTION */}
//       <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
//         <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">

//           {/* Doctor Image */}
//           <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
//             {imageSrc ? (
//               <img
//                 src={imageSrc}
//                 alt={doctor.name}
//                 className="w-full h-full object-cover"
//                 style={{ objectPosition: "center 15%" }}
//                 onError={(e) => {
//                   // Final fallback: letter avatar
//                   e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23ffffff' width='256' height='256'/%3E%3Ctext x='50%25' y='50%25' font-size='96' text-anchor='middle' dy='.3em' fill='%2314b8a6'%3E${encodeURIComponent((doctor.name || "D").charAt(0))}%3C/text%3E%3C/svg%3E`;
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full bg-teal-100 flex items-center justify-center text-6xl font-bold text-teal-500">
//                 {(doctor.name || "D").charAt(0)}
//               </div>
//             )}
//           </div>

//           {/* Doctor Info */}
//           <div>
//             <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
//             <p className="text-xl text-teal-100 mb-2">{doctor.title}</p>
//             {doctor.designation && (
//               <p className="text-sm text-teal-200 italic mb-3">{doctor.designation}</p>
//             )}
//             <p className="mt-3 text-lg font-semibold">{specialization}</p>
//           </div>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">

//         {/* LEFT SIDE */}
//         <div className="lg:col-span-2 space-y-8">

//           {/* About */}
//           <div className="bg-white p-8 rounded-2xl shadow">
//             <h2 className="text-2xl font-bold mb-4 text-gray-900">About Doctor</h2>
//             <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
//           </div>

//           {/* Timing Section */}
//           {doctor.timing && (
//             <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-2xl shadow border border-teal-100">
//               <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
//                 <Clock className="w-6 h-6 text-teal-600" />
//                 Consultation Timings
//               </h2>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="flex items-start gap-3">
//                   <Calendar className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Days</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {/* Handle both { days, hours } object and flat string */}
//                       {typeof doctor.timing === "object" ? doctor.timing.days : doctor.timing}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Clock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Hours</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {typeof doctor.timing === "object" ? doctor.timing.hours : ""}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Specialization */}
//           <div className="bg-white p-8 rounded-2xl shadow">
//             <h2 className="text-2xl font-bold mb-4 text-gray-900">Specialization</h2>
//             <div className="inline-block bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold">
//               {specialization}
//             </div>
//           </div>

//           {/* Diseases / Conditions */}
//           {diseases.length > 0 && (
//             <div className="bg-white p-8 rounded-2xl shadow">
//               <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
//                 <Stethoscope className="w-6 h-6 text-teal-600" />
//                 Conditions &amp; Treatments
//               </h2>

//               <div className="grid md:grid-cols-2 gap-4">
//                 {displayedDiseases.map((disease, index) => (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-100 hover:shadow-md transition-shadow"
//                   >
//                     <h3 className="font-semibold text-gray-900 mb-2 text-sm">
//                       {/* Handle both { name, description } object and plain string */}
//                       {typeof disease === "object" ? disease.name : disease}
//                     </h3>
//                     {typeof disease === "object" && disease.description && (
//                       <p className="text-xs text-gray-600 leading-relaxed">{disease.description}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {diseases.length > 6 && (
//                 <button
//                   onClick={() => setShowAllDiseases(!showAllDiseases)}
//                   className="mt-6 w-full flex items-center justify-center gap-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold py-3 rounded-lg transition-colors"
//                 >
//                   {showAllDiseases ? (
//                     <>Show Less <ChevronUp className="w-5 h-5" /></>
//                   ) : (
//                     <>Show All {diseases.length} Conditions <ChevronDown className="w-5 h-5" /></>
//                   )}
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* RIGHT SIDE - BOOK APPOINTMENT */}
//         <div className="bg-white p-8 rounded-2xl shadow sticky top-6 h-fit">
//           <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Appointment</h2>

//           <form
//             action="https://formsubmit.co/ishikalalitgaur521@gmail.com"
//             method="POST"
//             className="space-y-4"
//           >
//             {/* FormSubmit hidden config fields */}
//             <input
//               type="hidden"
//               name="_subject"
//               value={`New Appointment Request — Dr. ${doctor.name} (${specialization})`}
//             />
//             <input type="hidden" name="_captcha" value="false" />
//             <input type="hidden" name="_template" value="table" />
//             <input type="hidden" name="_next" value={`${typeof window !== "undefined" ? window.location.origin : ""}/thanku`} />
//             <input type="hidden" name="Doctor Name" value={doctor.name} />
//             <input type="hidden" name="Specialization" value={specialization} />
//             {doctor.timing && (
//               <input
//                 type="hidden"
//                 name="Doctor Timing"
//                 value={
//                   typeof doctor.timing === "object"
//                     ? `${doctor.timing.days} | ${doctor.timing.hours}`
//                     : doctor.timing
//                 }
//               />
//             )}
//             <input type="text" name="_honey" style={{ display: "none" }} />

//             {/* Visible form fields */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
//               <input
//                 type="text"
//                 name="Full Name"
//                 required
//                 placeholder="Enter your full name"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//               <input
//                 type="email"
//                 name="Email"
//                 required
//                 placeholder="your.email@example.com"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
//               <input
//                 type="tel"
//                 name="Phone"
//                 required
//                 placeholder="+91 XXXXXXXXXX"
//                 pattern="[0-9]{10}"
//                 title="Please enter a valid 10-digit phone number"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
//               <textarea
//                 name="Reason for Visit"
//                 placeholder="Brief description of your health concern..."
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 rows="4"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
//             >
//               Book Appointment
//             </button>

//             {doctor.timing && (
//               <div className="mt-4 p-3 bg-teal-50 rounded-lg text-center">
//                 <p className="text-xs text-teal-700">
//                   <strong>Available:</strong>{" "}
//                   {typeof doctor.timing === "object" ? doctor.timing.days : doctor.timing}
//                 </p>
//                 {typeof doctor.timing === "object" && doctor.timing.hours && (
//                   <p className="text-xs text-teal-600 mt-1">{doctor.timing.hours}</p>
//                 )}
//               </div>
//             )}
//           </form>
//         </div>

//       </div>
//       <Footer />
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Calendar, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// FIX THIS IMPORT PATH to match your folder layout.
//
// Most common setup:
//   app/
//     doctors/
//       data/
//         doctorsData.js    ← data file
//       [id]/
//         page.jsx          ← THIS file
//
// → correct import is:  '../data/doctorsData'
// ─────────────────────────────────────────────────────────────────────────────
import { doctorsData } from '@/app/doctors/data/doctorsData';
import Footer from "@/components/Footer";

export default function DoctorProfile() {
  const params = useParams();
  const rawId = params.id;

  // Match by numeric id (e.g. /doctors/1) OR by string _id
  const doctor = doctorsData.find(
  (d) => String(d.id) === String(rawId) || d.slug === rawId
);
  const [showAllDiseases, setShowAllDiseases] = useState(false);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-teal-50 to-white">
        <div className="text-6xl">🩺</div>
        <h2 className="text-2xl font-bold text-gray-700">Doctor Not Found</h2>
        <p className="text-gray-400 text-sm">
          No doctor with id <code className="bg-gray-100 px-2 py-0.5 rounded">{rawId}</code> exists.
        </p>
        <a href="/doctors" className="mt-2 text-teal-600 font-semibold underline text-sm">
          Back to Doctors
        </a>
      </div>
    );
  }

  const diseases = doctor.diseases || [];
  const displayedDiseases = showAllDiseases ? diseases : diseases.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">

      {/* HERO */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">

          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 15%' }}
              onError={(e) => {
                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e0f2fe' width='256' height='256'/%3E%3Ctext x='50%25' y='50%25' font-size='96' text-anchor='middle' dy='.3em' fill='%2314b8a6'%3E${encodeURIComponent((doctor.name || 'D').charAt(0))}%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
            <p className="text-xl text-teal-100 mb-2">{doctor.title}</p>
            {doctor.designation && (
              <p className="text-sm text-teal-200 italic mb-3">{doctor.designation}</p>
            )}
            <p className="mt-3 text-lg font-semibold">{doctor.specialization}</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">About Doctor</h2>
            <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
          </div>

          {doctor.timing && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-2xl shadow border border-teal-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-teal-600" />
                Consultation Timings
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Days</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.timing.days}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.timing.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Specialization</h2>
            <div className="inline-block bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold">
              {doctor.specialization}
            </div>
          </div>

          {diseases.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-teal-600" />
                Conditions &amp; Treatments
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {displayedDiseases.map((disease, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-100 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{disease.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{disease.description}</p>
                  </div>
                ))}
              </div>

              {diseases.length > 6 && (
                <button
                  onClick={() => setShowAllDiseases(!showAllDiseases)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  {showAllDiseases
                    ? <><span>Show Less</span> <ChevronUp className="w-5 h-5" /></>
                    : <><span>Show All {diseases.length} Conditions</span> <ChevronDown className="w-5 h-5" /></>
                  }
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — BOOK APPOINTMENT */}
        <div className="bg-white p-8 rounded-2xl shadow sticky top-6 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Appointment</h2>

          <form
            action="https://formsubmit.co/ishikalalitgaur521@gmail.com"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="_subject"       value={`New Appointment — ${doctor.name} (${doctor.specialization})`} />
            <input type="hidden" name="_captcha"       value="false" />
            <input type="hidden" name="_template"      value="table" />
            <input type="hidden" name="_next"          value="/thanku" />
            <input type="hidden" name="Doctor Name"    value={doctor.name} />
            <input type="hidden" name="Specialization" value={doctor.specialization} />
            {doctor.timing && (
              <input type="hidden" name="Doctor Timing" value={`${doctor.timing.days} | ${doctor.timing.hours}`} />
            )}
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input type="text" name="Full Name" required placeholder="Enter your full name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" name="Email" required placeholder="your.email@example.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input type="tel" name="Phone" required placeholder="+91 XXXXXXXXXX"
                pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <textarea name="Reason for Visit" placeholder="Brief description of your health concern..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows="4" />
            </div>

            <button type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl">
              Book Appointment
            </button>

            {doctor.timing && (
              <div className="mt-4 p-3 bg-teal-50 rounded-lg text-center">
                <p className="text-xs text-teal-700"><strong>Available:</strong> {doctor.timing.days}</p>
                <p className="text-xs text-teal-600 mt-1">{doctor.timing.hours}</p>
              </div>
            )}
          </form>
        </div>

      </div>
      <Footer />
    </div>
  );
}
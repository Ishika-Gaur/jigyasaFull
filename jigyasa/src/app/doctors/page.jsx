'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";

const API_DOCTORS = "http://localhost:4000/api/doctors";

export default function Doctors() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_DOCTORS);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError('Unable to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const filtered = doctors.filter(
    (doc) =>
      (doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.specialty || doc.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">

      {/* HERO */}
      <section
        className="relative h-[40vh] md:h-[65vh] flex flex-col items-center justify-center text-white text-center px-4 bg-cover bg-center gap-6"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">Our Doctors</h1>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full max-w-md px-5 py-3 rounded-full text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </section>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading doctors...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchDoctors}
            className="mt-1 text-xs font-semibold text-teal-600 border border-teal-300 px-4 py-2 rounded-full hover:bg-teal-50 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-32 text-gray-400">
          <p className="text-lg font-semibold">
            {search ? `No doctors found for "${search}"` : "No doctors available yet."}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-teal-500 underline">
              Clear search
            </button>
          )}
        </div>
      )}

      {/* GRID */}
      {!loading && !error && filtered.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const specialty = doc.specialty || doc.specialization || '';
            const imageSrc = doc.images?.[0]
              ? `${API_DOCTORS}/${doc.id}/image`
              : null;

            return (
              <div
                key={doc.id}
                onClick={() => router.push(`/doctors/${doc.slug}`)}
                className="group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                {/* IMAGE */}
                <div className="relative w-full h-[320px] bg-teal-50 overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={doc.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: "center 15%" }}
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320'%3E%3Crect fill='%23f0fdfa' width='400' height='320'/%3E%3Ctext x='50%25' y='50%25' font-size='96' text-anchor='middle' dy='.3em' fill='%2314b8a6'%3E${encodeURIComponent((doc.name || 'D').charAt(0))}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                      <span className="text-7xl font-bold text-teal-300">
                        {(doc.name || 'D').charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="px-6 py-6 text-center bg-white">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-500 transition-colors">
                    {doc.name}
                  </h3>
                  {doc.title && (
                    <p className="mt-3 text-sm font-semibold text-teal-600 bg-teal-50 inline-block px-4 py-2 rounded-lg">
                      {doc.title}
                    </p>
                  )}
                  {specialty && (
                    <span className="block mt-2 text-xs font-medium text-teal-500 uppercase tracking-widest">
                      {specialty}
                    </span>
                  )}
                  {doc.description && (
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {doc.description}
                    </p>
                  )}
                  <div className="mt-5">
                    <span className="inline-block bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-5 py-2 rounded-full transition-colors">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <Footer />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { doctorsData } from '../data/doctorsData';
import { Clock, Calendar, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';

export default function DoctorProfile() {
  const params = useParams();
  const doctorId = Number(params.id);

  const doctor = doctorsData.find((doc) => doc.id === doctorId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });

  const [showAllDiseases, setShowAllDiseases] = useState(false);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Doctor Not Found
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...formData,
      doctor: doctor.name
    });

    alert('Appointment request submitted successfully!');
  };

  // Display first 6 diseases or all based on state
  const displayedDiseases = showAllDiseases 
    ? doctor.diseases 
    : doctor.diseases?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">

          {/* Doctor Image */}
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Crect fill="%23ffffff" width="256" height="256"/%3E%3Ctext x="50%25" y="50%25" font-size="96" text-anchor="middle" dy=".3em" fill="%2314b8a6"%3E${doctor.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>

          {/* Doctor Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
            <p className="text-xl text-teal-100 mb-2">{doctor.title}</p>
            {doctor.designation && (
              <p className="text-sm text-teal-200 italic mb-3">{doctor.designation}</p>
            )}
            <p className="mt-3 text-lg font-semibold">{doctor.specialization}</p>

            <div className="mt-6 flex gap-6">
              <div>
                {/* <p className="text-sm text-teal-200">Experience</p> */}
                {/* <p className="text-xl font-bold">{doctor.experience}</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">About Doctor</h2>
            <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
          </div>

          {/* Timing Section */}
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

          {/* Specialization */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Specialization</h2>
            <div className="inline-block bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold">
              {doctor.specialization}
            </div>
          </div>

          {/* Diseases/Conditions Treated Section */}
          {doctor.diseases && doctor.diseases.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-teal-600" />
                Conditions & Treatments
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {displayedDiseases.map((disease, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-100 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {disease.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {disease.description}
                    </p>
                  </div>
                ))}
              </div>

              {doctor.diseases.length > 6 && (
                <button
                  onClick={() => setShowAllDiseases(!showAllDiseases)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  {showAllDiseases ? (
                    <>
                      Show Less
                      <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Show All {doctor.diseases.length} Conditions
                      <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>

        {/* RIGHT SIDE - BOOK APPOINTMENT */}
        <div className="bg-white p-8 rounded-2xl shadow sticky top-6 h-fit">

          <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Appointment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 XXXXXXXXXX"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                placeholder="Brief description of your health concern..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows="4"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Book Appointment
            </button>

            {doctor.timing && (
              <div className="mt-4 p-3 bg-teal-50 rounded-lg text-center">
                <p className="text-xs text-teal-700">
                  <strong>Available:</strong> {doctor.timing.days}
                </p>
                <p className="text-xs text-teal-600 mt-1">
                  {doctor.timing.hours}
                </p>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
}
import Image from "next/image";
import Footer from "@/components/Footer";

const facilities = [
  {
    title: "Generic Medicine",
    desc: "Affordable and high-quality medicines to ensure effective treatment. Trusted generic alternatives that are safe and reliable.",
    icon: "https://cdn-icons-png.flaticon.com/128/883/883407.png",
  },
  {
    title: "Health Checks & Screening",
    desc: "Early detection saves lives. Advanced health check-ups and screenings for timely medical intervention.",
    icon: "https://cdn-icons-png.flaticon.com/128/4981/4981979.png",
  },
  {
    title: "Vaccination",
    desc: "Safe and effective vaccines for all age groups to protect against infectious diseases.",
    icon: "https://cdn-icons-png.flaticon.com/128/808/808999.png",
  },
  {
    title: "Medicine Consultation",
    desc: "Personalized consultations to diagnose and manage health conditions with expert guidance.",
    icon: "https://cdn-icons-png.flaticon.com/128/13704/13704587.png",
  },
  {
    title: "Doctor Receipt",
    desc: "Transparent medical documentation including consultation fees and prescribed treatments.",
    icon: "https://cdn-icons-png.flaticon.com/128/6512/6512379.png",
  },
  {
    title: "Pharmacy Store",
    desc: "Wide range of prescription medicines, supplements, and medical supplies at competitive prices.",
    icon: "https://cdn-icons-png.flaticon.com/128/4968/4968662.png",
  },
];

export default function Facility() {
  return (
    <div className="bg-gray-50">

      {/* 🔹 HERO SECTION */}
      <section
        className="h-[40vh] md:h-[60vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Facility
        </h1>
      </section>

      {/* 🔹 OFFER SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-teal-500 font-semibold uppercase tracking-wide text-lg mb-3">
          What We Offer
        </h2>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Live happily, Live healthily
        </h1>

        <p className="max-w-3xl mx-auto text-gray-700 text-base leading-relaxed mb-12">
          At <strong>Jigyasa Hospital</strong>, we provide a comprehensive range
          of medical services designed to meet diverse healthcare needs with
          quality treatment, personalized care, and advanced medical solutions.
        </p>

        {/* 🔹 CARDS */}
        <div className="grid gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((item, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-2 hover:border-teal-400 hover:bg-teal-50 text-left"
            >
              <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-teal-100">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={30}
                  height={30}
                />
              </div>

              <h3 className="text-lg font-semibold text-teal-600 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
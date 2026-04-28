"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";

const departments = [
  {
    title: "General Medicine",
    route: "bodyparts/genernalmedicine",
    image: "https://i.pinimg.com/1200x/dc/d6/b1/dcd6b156b180593af3ee59e074247432.jpg",
    desc: "Our General Medicine department offers comprehensive care for the diagnosis, treatment, and prevention of a wide range of acute and chronic health conditions. Supported by experienced physicians and skilled medical staff, we provide personalized treatment plans focused on accurate diagnosis, effective management, and long-term well-being. We are committed to delivering timely, reliable, and patient-centered care while maintaining the highest standards of safety, quality, and affordability. Your overall health is our priority.",
  },
  {
    title: "Cardiology",
    route: "bodyparts/hearts",
    image: "https://i.pinimg.com/1200x/a6/2e/10/a62e1080d05299200f201e023e657747.jpg",
    desc: "Cardiology is the branch of medicine that focuses on the heart and blood vessels, ensuring every beat keeps you strong and healthy. Cardiologists specialize in diagnosing, treating, and preventing conditions such as heart disease, hypertension, and rhythm disorders. With advanced technology and compassionate care, cardiology plays a vital role in saving lives, improving quality of life, and guiding patients towards healthier hearts and longer futures.",
  },
  {
    title: "Gynecology",
    route: "bodyparts/reproductive",
    image: "https://i.pinimg.com/1200x/36/26/89/36268912b7ce777e1826a248129c4442.jpg",
    desc: "Gynecology is a medical specialty dedicated to women's health, focusing on the reproductive system and overall well-being at every stage of life. From adolescence to pregnancy, and through menopause, gynecologists provide expert care, guidance, and support to ensure a healthier and more confident future.",
  },
  {
    title: "Pediatrics",
    route: "bodyparts/throat",
    image: "https://i.pinimg.com/736x/01/68/c5/0168c569dd21951b97bf6e7b11cca6ab.jpg",
    desc: "Pediatrics is the branch of medicine that specializes in the health and development of infants, children, and adolescents. Pediatricians provide comprehensive care — from routine checkups and vaccinations to managing illnesses and guiding healthy growth.",
  },
  {
    title: "Orthopedics",
    route: "bodyparts/knee",
    image: "https://i.pinimg.com/1200x/f0/7d/6c/f07d6c3299d53f64b121d4370d70a470.jpg",
    desc: "Orthopedics focuses on the diagnosis, treatment, and prevention of conditions affecting bones, joints, muscles, ligaments, and the spine. Specialists help restore mobility, relieve pain, and improve quality of life.",
  },
  {
    title: "Laparoscopic Surgery",
    route: "bodyparts/liver",
    image: "https://i.pinimg.com/1200x/40/b2/76/40b276d348755ea850bd57b28091d07a.jpg",
    desc: "Laparoscopic surgery uses small incisions and advanced technology to perform procedures with precision and minimal discomfort, leading to faster recovery and reduced pain.",
  },
  {
    title: "GI & General Surgery",
    route: "bodyparts/varicose",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400",
    desc: "GI and General Surgery covers surgical treatment of digestive system disorders and other abdominal conditions using advanced techniques for faster recovery.",
  },
  {
    title: "Oral & Maxillofacial Surgery",
    route: "bodyparts/teeth",
    image: "https://i.pinimg.com/736x/d1/09/14/d10914cd89cf455e6229427211868094.jpg",
    desc: "This specialty treats conditions affecting the mouth, jaw, face, and neck, including dental implants, jaw surgery, and facial reconstruction.",
  },
  {
    title: "Dermatology",
    route: "bodyparts/skin",
    image: "https://i.pinimg.com/736x/86/dc/85/86dc8516af7720bc2a4b16c1d664ef70.jpg",
    desc: "Dermatology focuses on skin, hair, and nail health, providing medical and cosmetic treatments for various skin conditions.",
  },
  {
    title: "Family Medicine",
    route: "bodyparts/body",
    image: "https://i.pinimg.com/1200x/66/5b/53/665b53c70b3c0655b8d503598bcb42b7.jpg",
    desc: "Family Medicine offers comprehensive healthcare for individuals and families across all age groups with long-term personalized care.",
  },
  {
    title: "Neurosurgery",
    route: "bodyparts/brain",
    image: "https://i.pinimg.com/1200x/e4/be/35/e4be35a1f9fa2848acbd7c465dcf80cb.jpg",
    desc: "Neurosurgery focuses on surgical treatment of brain, spine, and nervous system disorders using advanced technology and precision.",
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
    desc: "Plastic Surgery combines science and artistry to restore, reconstruct, and enhance appearance with patient safety as priority.",
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
    desc: "Rheumatology treats autoimmune and inflammatory joint and muscle disorders to improve mobility and quality of life.",
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
    desc: "Radiology uses advanced imaging techniques like X-rays, CT scans, and MRI for accurate diagnosis and treatment planning.",
  },
];

export default function Department() {
  const router = useRouter();

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
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">
          Departments
        </h1>
      </section>

      {/* Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept, index) => (
          <div
            key={index}
            onClick={() => router.push(dept.route)}
            className="cursor-pointer bg-gradient-to-br from-white to-[#f8fbff] rounded-2xl p-4 md:p-8 shadow-lg border border-teal-100
            transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
          >
            {/* Circular Image */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 rounded-full overflow-hidden shadow-md ring-4 ring-teal-100">
              <Image
                src={dept.image}
                alt={dept.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-gray-900 hover:text-teal-500 transition-colors text-left">
              {dept.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-4 md:line-clamp-5 text-left">
              {dept.desc}
            </p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
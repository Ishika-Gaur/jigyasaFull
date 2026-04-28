import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

const doctorList = [
  {
    id : 1,
    name: "Dr. C.P. Singh",
    title: "Senior Consultant Physician M.B.B.S, M.D.(Medicine) KGMC Lucknow",
    description:
      "Expert in surgical procedures, ensuring precise treatments, faster recovery, and optimal patient care.",
    image: "/doctors/best-consultant-physician-dr-cp-singh.png",
  },
 {
  id : 2,
  name: "Dr. Amit Kumar Singh",
  title: "MD(BHU), DM Cardiology (KGMU), FSCAI Senior Interventional Cardiologist",
  description: "Committed to Protecting Your Heart with Expertise and Compassion.",
  image: "/doctors/best-cardiologist-dr-amit-kumar-singh.png",
},
{
  id : 3,
  name: "Dr. Akansha Singh",
  title: "MBBS MS OBG,Fellowship in ART OBS & Gynecologist",
  description: "Specializing in women's health, maternity care, and reproductive wellness with personalized, compassionate care.",
  image: "/doctors/best-gynecologist-dr-akansha.png",
},
{
  id: 4,
  name: "Dr. Sana Ibad Khan",
  title: "M.D. (Pediatrics), Fellow Neonatology Senior Pediatrician",
  description: "Dedicated to child healthcare, offering expert diagnosis, treatment, and preventive care for overall well-being.",
  image: "/doctors/best-pediatrician-dr-sana-ibad-khan.png",
},
{
 id: 5,
  name: "Dr. Shariq Ahmad",
  title: "MBBS, D. Ortho Senior Orthopedician",
  description: "Where Precision Medicine Meets Compassionate Healing",
  image: "/doctors/best-orthopediacian-dr-shariq.png",
},
{
  id: 6,
  name: "Dr. Vibhor Agarwal",
  title: "MBBS, MS, FIAGES General & Laparoscopic Surgeon",
  description: "Advanced Keyhole Surgery for Faster Healing and Better Outcomes",
  image: "/doctors/best-laparscopic-surgeon-dr-vibhor-agarwal.jpg",
},
{
 id : 7,
  name: "Dr. Imran",
  title: "MBBS KGMU Lucknow DPM (MD) (cip RANCHI) Consultant Neuropsychiatrist",
  description: "Specialized in caring for the brain, spine, and nervous system.",
  image: "/doctors/best-neuropsychiatrist-dr-imran.png",
},
{
 id :8,
  name: "Dr. Kriti Kishore",
  title: "MBBS, MD DM (Rheumatologist, KGMU) Senior Consultant Rheumatology",
  description: "Advanced Keyhole Surgery for Faster Healing and Better Outcomes",
  image: "/doctors/best-rheumatologist-dr-kriti-kishor.png",
},
{
  id:9,
  name: "Dr. Anil Rajput",
  title: "M.B.B.S., M.S., (M.Ch. (Plastic Surgery) F.L.C.L.S., F.L.C.S., F.I.H.R.S)",
  description: "Advanced Keyhole Surgery for Faster Healing and Better Outcomes",
  image: "/doctors/best-plastic-surgery-dr-anil-rajput.png",
},
{
  id: 10,
  name: "Dr. Abida",
  title: "M.B.B.S., M.D.(JNMCH), PGDD (RIMS) Ex Senior Resident(LNJP, New Delhi)",
  description: "Expert in treating skin, hair, and nail disorders with advanced dermatological care and precision.",
  image: "/doctors/best-dermatology-dr-abida-ali.png",
},
{
  id : 11,
  name: "Dr. Ashish Gupta",
  title: "MBBS, MD(AIIMS,New Delhi) DM Endo (PGIMER,Chandigarh) Consultant Endocrinologist",
  description: "Expert in diabetes, thyroid, hormonal disorders, and reproductive health, providing comprehensive endocrine care.",
  image: "/doctors/best-endocrinologist-dr-ashish-gupta.png",
},
{
  id : 12,
  name: "Dr. Deeksha Singh",
  title: "MBBS, MS Ophthalmologist",
  description: "Provides comprehensive eye care services, including diagnosis and treatment of various eye conditions, using modern technology and expert medical care.",
  image: "/doctors/best-opthalmologist-dr-deeksha-singh.png",
},
{
  id: 13,
  name: "Dr. Pabitra Sahu",
  title: "Senior Consultant - Gastroenterology, Gastroenterology, Hepatology & Endoscopy",
  description: "Offers comprehensive care for digestive, liver, and gastrointestinal disorders, including advanced diagnostic endoscopy and personalized treatment using modern medical technology.",
  image: "/doctors/best-gastroenterologist-dr-pavitra-sahu.png",
},
{
 id :14,
  name: "Dr. Pragnesh Desai",
  title: "Principal Consultant - Urology, Kidney Transplant, Robotic Surgery",
  description: "Advanced care for kidney and urinary tract diseases, offering modern urology, kidney transplant services, and minimally invasive robotic surgery with a patient-focused approach.",
  image: "/doctors/best-urologist-dr-parnesh.png",
},
{
  id : 15,
  name: "Dr. Faran Naim",
  title: "Senior Consultant - Hematology & Bone Marrow Transplantation",
  description: "Advanced care for blood disorders and blood cancers, offering comprehensive hematology services and bone marrow transplantation with a patient-centered approach.",
  image: "/doctors/best-hematogist-dr-faran.png",
},
{
  id :16,
  name: "Dr. Rahul Kumar",
  title: "MBBS, DNB (General Surgery) DNB (Gastro Surgery) Senior GI Surgeon",
  description: "Advanced surgical care for digestive system disorders, offering minimally invasive laparoscopic procedures with a focus on safety, precision, and faster recovery.",
  image: "/doctors/best-gi-surgeon-dr-rahul-singh.png",
},
{
  id : 17,
  name: "Dr. Karishma Singh",
  title: "MBBS, MS (Obst & Gynae) IVF Specialist and Laparoscopic Gynaecologic Surgeon",
  description: "Comprehensive care for women's health, fertility, and reproductive treatments.",
  image: "/doctors/best-gynaecologist-dr-karishma.png",
},
{
 id : 18,
  name: "Dr. Ankit Singh",
  title: "MBBS (SRMS, IMS Bareilly) Family Physician",
  description: "Comprehensive primary care for all ages, focusing on prevention, diagnosis, and personalized treatment.",
  image: "/doctors/best-family-physician-dr-ankit-singh.png",
},

];

export default function Doctors() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">

      {/* HERO SECTION */}
      <section
        className="relative h-[40vh] md:h-[65vh] flex items-center justify-center text-white text-center px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,33,83,0.9), rgba(9,33,83,0.6)), url('/hospital.png')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          Doctors
        </h1>
      </section>

      {/* DOCTORS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {doctorList.map((doc, index) => {
          // Custom positioning for specific doctors
          let imagePosition = "object-[center_20%]";
          if (doc.id === 2) imagePosition = "object-[center_40%]";
           if (doc.id === 3) imagePosition = "object-[center_50%]";
          if (doc.id === 4) imagePosition = "object-[center_0%]"; // Dr. Sana Ibad Khan
          if (doc.id === 5) imagePosition = "object-[center_35%]"; // Dr. Shariq Ahmad
          if (doc.id === 6) imagePosition = "object-[center_15%]";
            if (doc.id === 7) imagePosition = "object-[center_40%]"; 
            if (doc.id === 10) imagePosition = "object-[center_40%]"; 
            if (doc.id === 11) imagePosition = "object-[center_80%]"; 
             if (doc.id === 12) imagePosition = "object-[center_50%]"; 
             if (doc.id === 16) imagePosition = "object-[center_40%]";
             if (doc.id === 17) imagePosition = "object-[center_30%]"; 
             if (doc.id === 18) imagePosition = "object-[center_90%]"; 
          
          return (
            <Link href={`/doctors/${doc.id}`} key={index}>
              <div
                className="group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden 
                transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                {/* IMAGE with white background and consistent positioning */}
                <div className="relative w-full h-[320px] bg-white overflow-hidden">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className={`object-cover ${imagePosition} transition-transform duration-500 group-hover:scale-105`}
                  />
                </div>

              {/* CONTENT */}
              <div className="px-6 py-6 text-center bg-white">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-500 transition-colors">
                  {doc.name}
                </h3>

                <p className="mt-3 text-sm font-semibold text-teal-600 bg-teal-50 inline-block px-4 py-2 rounded-lg">
                  {doc.title}
                </p>

                <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                  {doc.description}
                </p>
              </div>
            </div>
          </Link>
        );
        })}
      </section>

      <Footer />
    </div>
  );
}
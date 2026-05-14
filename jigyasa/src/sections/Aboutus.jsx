"use client";

import { useRouter } from "next/navigation";
import { FaUserMd } from "react-icons/fa";

const Aboutus = () => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-center items-start px-[5%] py-[60px] bg-white box-border">
      {/* Left Section */}
      <div className="flex-1 basis-[500px] p-5">
        <h3 className="inline-block text-base text-[#25b1a8] font-semibold mb-2.5 uppercase bg-[#cff0ef] px-2.5 py-1 rounded">
          WHO WE ARE
        </h3>

        <h1 className="text-2xl sm:text-4xl font-bold mb-5 leading-[1.3]">
          We Are Best Among Others?
        </h1>

        <p className="text-base text-black mb-6 leading-relaxed">
          Our commitment to excellence sets us apart. With a team of skilled
          professionals, state-of-the-art technology, and a patient-centered
          approach, we deliver unmatched healthcare services, ensuring your
          well-being is our top priority.
        </p>

        {/* Features */}
        <div className="flex gap-10 mb-[30px] flex-wrap">
          <ul className="list-none p-0 m-0 text-left">
            <li className="mb-2.5 text-[#1f2937] font-medium">
              ✔ Experienced Medical Team
            </li>
            <li className="mb-2.5 text-[#1f2937] font-medium">
              ✔ Quick & Efficient Service
            </li>
          </ul>

          <ul className="list-none p-0 m-0 text-left">
            <li className="mb-2.5 text-[#1f2937] font-medium">
              ✔ Affordable & Transparent Pricing
            </li>
            <li className="mb-2.5 text-[#1f2937] font-medium">
              ✔ Patient-Centered Care
            </li>
          </ul>
        </div>

        <button
          className="px-[30px] py-3 bg-[#25b1a8] text-white font-semibold border-none rounded-md cursor-pointer transition-all duration-300 hover:bg-[#1b9088] mt-5 lg:mt-0"
          onClick={() => router.push("/about")}
        >
          MORE ABOUT US
        </button>
      </div>

      {/* Right Section */}
      <div className="flex-1 basis-[400px] p-5 flex flex-col items-center relative mt-10 lg:mt-0">
        <img
          src="/WhatsApp-Image-2025-02-18-at-15.57.37_a8e9449b-e1740197839432-992x1024.jpg"
          alt="doctor"
          className="w-full max-w-[400px] sm:max-w-full rounded-[10px] object-cover mb-5"
        />

        {/* Experience Badge */}
        <div className="absolute bottom-0 left-0 translate-x-5 -translate-y-[10%] flex flex-col sm:flex-row items-start gap-3 sm:gap-3 bg-white p-2 sm:p-[30px_35px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] max-w-[400px] text-sm z-[2] text-left">
          <div className="w-[70px] h-[70px] sm:w-[100px] sm:h-[70px] mb-0 sm:mb-6 bg-gradient-to-br from-[#0dbd9d] to-[#25b1a8] rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_25px_rgba(13,189,157,0.3)] animate-pulse">
            <FaUserMd className="text-white text-3xl sm:text-4xl" />
          </div>

          <div className="flex-1">
            <h4 className="text-base font-bold m-0 text-[#111827]">
              25+ Years Experience
            </h4>
            <p className="text-sm text-[#374151] mt-1 mb-0 leading-[1.4]">
              Jigyasa Hospital – Healing with Care, Treating with Trust!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
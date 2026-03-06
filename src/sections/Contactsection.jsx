"use client";

import Link from "next/link";
import { useState } from "react";

const Contactsection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department: "",
    message: "",
  });

  const departments = [
    "Pharmacy",
    "Cardiology",
    "Gynecology",
    "Pediatrics",
    "Orthopedics",
    "Laparoscopic Surgery",
    "GI and General Surgery",
    "Oral and Maxillofacial Surgery",
    "Dermatology",
    "Family Medicine",
    "Neurosurgery",
    "Psychiatry",
    "Plastic Surgery",
    "Endocrinology",
    "Gastroenterology",
    "Rheumatology",
    "Ophthalmology",
    "Radiology",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create mailto link with form data
    const subject = `Appointment Request - ${formData.department}`;
    const body = `Name: ${formData.name}%0D%0APhone: ${formData.phone}%0D%0ADepartment: ${formData.department}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;

    window.location.href = `mailto:info@jigyasahospital.in?subject=${subject}&body=${body}`;
  };

  return (
    <section className="max-w-[1200px] mx-auto my-[60px] px-5 flex flex-wrap gap-10 font-sans">
      {/* Left Side Container */}
      <div className="flex-1 min-w-[320px] max-w-full lg:max-w-[55%] flex flex-col gap-[30px]">
        {/* Contact Info */}
        <div className="animate-fadeInUp">
          <span className="inline-block text-base text-[#25b1a8] font-semibold mb-2.5 uppercase bg-[#cff0ef] px-2.5 py-1 rounded">
            CONTACT US
          </span>
          <h1 className="text-[2.2rem] md:text-[1.8rem] text-[#111] mb-2.5 animate-fadeInUp-delay-1">
            Book An Appointment!
          </h1>
          <p className="text-[#444] leading-relaxed mb-6 text-base animate-fadeInUp-delay-2">
            Booking an appointment is quick and easy! Select your preferred
            doctor, choose a convenient date and time, and we'll ensure
            everything is set for your visit. Our team is here to provide you
            with the best care, tailored to your needs.
          </p>

          {/* Contact Cards */}
          <div className="mb-5 animate-fadeInUp-delay-3">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span>
                <i className="fas fa-map-marker-alt text-[#0dbd9d] text-[0.8rem]"></i>
              </span>
              <span>
                <h3 className="my-2.5 mx-0 text-[1.2rem]">Address:</h3>
              </span>
            </div>
            <p className="text-[0.95rem] text-[#333] ml-[26px] mb-3">
              Near Miglani Cinema, Rampur Road, Moradabad, 244001
            </p>
          </div>

          <div className="mb-5 animate-fadeInUp-delay-3">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span>
                <i className="fas fa-headset text-[#0dbd9d] text-[0.8rem]"></i>
              </span>
              <span>
                <h3 className="my-2.5 mx-0 text-[1.2rem]">Phone:</h3>
              </span>
            </div>
            <p className="text-[0.95rem] text-[#333] ml-[26px] mb-3">
              7900903333
            </p>
          </div>

          <div className="mb-5 animate-fadeInUp-delay-3">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span>
                <i className="fas fa-envelope text-[#0dbd9d] text-[0.8rem]"></i>
              </span>
              <span>
                <h3 className="my-2.5 mx-0 text-[1.2rem]">E-mail:</h3>
              </span>
            </div>
            <p className="text-[0.95rem] text-[#333] ml-[26px] mb-3">
              info@jigyasahospital.in
            </p>
          </div>
        </div>

        {/* Google Map Embed */}
        <div className="rounded-lg overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.05)]">
          <iframe
            title="Jigyasa Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3522.183154775038!2d78.761983175177!3d28.828992475505224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390abfd1e3a64e15%3A0xcdb1f17039ec7b9f!2sJigyasa%20Hospital!5e0!3m2!1sen!2sin!4v1720228572664!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="bg-gradient-to-br from-[#f0f4f4] to-[#e8ebeb] flex-1 min-w-[320px] max-w-full lg:max-w-[40%] rounded-[20px] shadow-[20px_20px_60px_#d1d9d9,-20px_-20px_60px_#ffffff] transition-all duration-300 overflow-hidden relative group hover:-translate-y-1.5 hover:shadow-[25px_25px_80px_#d1d9d9,-25px_-25px_80px_#ffffff]">
        {/* Hover Effect Overlay */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-[rgba(13,189,157,0.1)] to-transparent transition-all duration-500 group-hover:left-full pointer-events-none" />

        <form
          className="p-[30px] md:p-5 flex flex-col gap-6 relative z-[2]"
          onSubmit={handleSubmit}
        >
          {/* Name Input */}
          <div className="relative mb-2.5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-[15px_20px] md:p-[12px_16px] border-2 border-transparent bg-white/90 text-base rounded-xl transition-all duration-[0.4s] outline-none shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff] focus:border-[#0dbd9d] focus:bg-white focus:-translate-y-0.5 focus:shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff,0_8px_25px_rgba(13,189,157,0.15)] placeholder:text-[#999] placeholder:transition-all placeholder:duration-300 focus:placeholder:-translate-y-5 focus:placeholder:opacity-0"
            />
            <span className="absolute -bottom-0.5 left-1/2 w-0 h-[3px] bg-gradient-to-r from-[#0dbd9d] to-[#25b1a8] transition-all duration-[0.4s] rounded-sm peer-focus:w-full peer-focus:left-0" />
          </div>

          {/* Phone Input */}
          <div className="relative mb-2.5">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              required
              className="w-full p-[15px_20px] md:p-[12px_16px] border-2 border-transparent bg-white/90 text-base rounded-xl transition-all duration-[0.4s] outline-none shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff] focus:border-[#0dbd9d] focus:bg-white focus:-translate-y-0.5 focus:shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff,0_8px_25px_rgba(13,189,157,0.15)] placeholder:text-[#999] placeholder:transition-all placeholder:duration-300 focus:placeholder:-translate-y-5 focus:placeholder:opacity-0"
            />
          </div>

          {/* Department Select */}
          <div className="relative mb-2.5">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-[15px_20px] md:p-[12px_16px] border-2 border-transparent bg-white/90 text-base rounded-xl transition-all duration-[0.4s] outline-none shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff] focus:border-[#0dbd9d] focus:bg-white focus:-translate-y-0.5 focus:shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff,0_8px_25px_rgba(13,189,157,0.15)]"
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea */}
          <div className="relative mb-2.5">
            <textarea
              name="message"
              placeholder="Your Message (Optional)"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-[15px_20px] md:p-[12px_16px] border-2 border-transparent bg-white/90 text-base rounded-xl transition-all duration-[0.4s] outline-none shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff] focus:border-[#0dbd9d] focus:bg-white focus:-translate-y-0.5 focus:shadow-[inset_2px_2px_5px_#d1d9d9,inset_-2px_-2px_5px_#ffffff,0_8px_25px_rgba(13,189,157,0.15)] placeholder:text-[#999] placeholder:transition-all placeholder:duration-300 focus:placeholder:-translate-y-5 focus:placeholder:opacity-0 resize-y min-h-[120px] font-sans"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="bg-gradient-to-br from-[#0dbd9d] to-[#25b1a8] text-white py-[14px] md:py-3 px-6 font-semibold text-[1.1rem] md:text-base border-none rounded-[40px] cursor-pointer relative overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(13,189,157,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(13,189,157,0.4)] active:translate-y-0 group/btn"
          >
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover/btn:left-full" />
            <span className="flex items-center justify-center gap-2.5">
              <span className="text-[1.2rem] animate-bounce-slow">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2989/2989993.png"
                  alt="Msg icon"
                  className="w-[30px] h-[30px] object-contain inline-block"
                />
              </span>
              Send Message
            </span>
          </button>
        </form>

        {/* Appointment Section */}
        <div className="px-[30px] md:px-5 pb-5 pt-5 border-t border-[rgba(13,189,157,0.1)] animate-fadeInUp-delay-3 flex justify-center">
          <Link href="/contact" className="no-underline w-auto">
            <button className="bg-gradient-to-br from-[#0dbd9d] to-[#25b1a8] text-white py-3 md:py-2.5 px-6 md:px-5 text-base md:text-[0.95rem] font-semibold border-none rounded-[25px] cursor-pointer w-auto inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(13,189,157,0.3)] min-w-[180px] md:min-w-[160px] whitespace-nowrap hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_25px_rgba(13,189,157,0.4)] no-underline">
              <span className="text-[1.1rem] md:text-base animate-pulse-slow">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17097/17097146.png"
                  alt="Appointment Icon"
                  className="w-5 h-5 object-contain inline-block"
                />
              </span>
              Book Appointment
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contactsection;
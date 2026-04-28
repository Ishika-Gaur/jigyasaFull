"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";
import {
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaHeadset,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const Contact = () => {
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
    <div className="w-full min-h-screen bg-[#f8f9fa]">
      {/* Hero Section */}
      <section 
        className="text-white py-[120px] px-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative bg-cover bg-center max-lg:py-20 max-md:py-[60px] max-sm:py-[60px] max-sm:px-[15px]"
        style={{
          backgroundImage: "linear-gradient(rgba(26, 54, 93, 0.85), rgba(26, 54, 93, 0.85)), url('https://i.pinimg.com/1200x/8e/e5/30/8ee5309347aef92d6f7b578f635bd889.jpg')"
        }}
      >
        <h1 className="text-[4rem] font-bold m-0 text-white [text-shadow:2px_2px_8px_rgba(0,0,0,0.3)] tracking-[2px] max-lg:text-[3rem] max-md:text-[2.5rem] max-sm:text-[2rem] max-[400px]:text-[1.75rem]">
          Contact Us
        </h1>
      </section>

      {/* Contact Content */}
      <div className="max-w-[1400px] mx-auto py-[60px] px-5 max-sm:py-10 max-sm:px-[15px] max-[1600px]:max-w-[1600px]">
        <div className="grid grid-cols-2 gap-[50px] items-start max-lg:gap-10 max-md:grid-cols-1 max-md:gap-[50px] max-sm:gap-[35px]">
          {/* Left Side */}
          <div className="flex flex-col gap-5 max-md:order-2">
            <span className="inline-block bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white py-2 px-5 rounded-[25px] text-[0.85rem] font-semibold tracking-wider w-fit uppercase max-[400px]:text-xs max-[400px]:py-1.5 max-[400px]:px-4">
              CONTACT US
            </span>
            <h1 className="text-[2.5rem] text-[#2d3748] m-0 font-bold max-lg:text-[2.2rem] max-sm:text-[1.8rem] max-[400px]:text-[1.6rem]">
              Book An Appointment!
            </h1>
            <p className="text-[#4a5568] leading-[1.8] text-[1.05rem] my-2.5 max-sm:text-base">
              Booking an appointment is quick and easy! Select your preferred
              doctor, choose a convenient date and time, and we'll ensure
              everything is set for your visit. Our team is here to provide you
              with the best care, tailored to your needs.
            </p>
            <button className="bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white border-none py-[15px] px-[35px] text-[1.1rem] font-semibold rounded-[30px] cursor-pointer transition-all duration-300 w-fit uppercase tracking-[0.5px] shadow-[0_4px_15px_rgba(32,178,170,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(32,178,170,0.4)] max-sm:py-3 max-sm:px-[30px] max-sm:text-base max-[400px]:py-2.5 max-[400px]:px-[25px] max-[400px]:text-[0.95rem]">
              Free ambulance
            </button>
            <p className="font-semibold text-[#2d3748] mt-5 mb-2.5">
              Follow us on social media :
            </p>
            <div className="flex gap-[15px]">
              <FaTwitter className="text-[2rem] text-[#20B2AA] cursor-pointer transition-all duration-300 hover:text-[#1a8f8a] hover:scale-110 max-sm:text-[1.8rem]" />
              <FaInstagram className="text-[2rem] text-[#20B2AA] cursor-pointer transition-all duration-300 hover:text-[#1a8f8a] hover:scale-110 max-sm:text-[1.8rem]" />
              <FaWhatsapp className="text-[2rem] text-[#20B2AA] cursor-pointer transition-all duration-300 hover:text-[#1a8f8a] hover:scale-110 max-sm:text-[1.8rem]" />
            </div>

            {/* Google Map Embed */}
            <div className="mt-[30px] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <iframe
                title="Jigyasa Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3522.183154775038!2d78.761983175177!3d28.828992475505224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390abfd1e3a64e15%3A0xcdb1f17039ec7b9f!2sJigyasa%20Hospital!5e0!3m2!1sen!2sin!4v1720228572664!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-md:order-1 max-md:p-[35px] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
            <form className="flex flex-col gap-5 max-[400px]:gap-[15px]" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full py-[15px] px-5 border-2 border-[#e2e8f0] rounded-[10px] text-base font-[inherit] transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[#20B2AA] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] max-sm:py-3 max-sm:px-4 max-sm:text-[0.95rem] max-[400px]:py-2.5 max-[400px]:px-3.5 max-[400px]:text-[0.9rem]"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
                className="w-full py-[15px] px-5 border-2 border-[#e2e8f0] rounded-[10px] text-base font-[inherit] transition-all duration-300 bg-[#f8f9fa] focus:outline-none focus:border-[#20B2AA] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] max-sm:py-3 max-sm:px-4 max-sm:text-[0.95rem] max-[400px]:py-2.5 max-[400px]:px-3.5 max-[400px]:text-[0.9rem]"
              />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full py-[15px] px-5 pr-[45px] border-2 border-[#e2e8f0] rounded-[10px] text-base font-[inherit] transition-all duration-300 bg-[#f8f9fa] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2320B2AA%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_15px_center] bg-[length:20px] focus:outline-none focus:border-[#20B2AA] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] max-sm:py-3 max-sm:px-4 max-sm:text-[0.95rem] max-[400px]:py-2.5 max-[400px]:px-3.5 max-[400px]:text-[0.9rem]"
              >
                <option value="" disabled className="p-3 bg-white text-[#2d3748]">
                  Select Department
                </option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept} className="p-3 bg-white text-[#2d3748]">
                    {dept}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder="Your Message (Optional)"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full py-[15px] px-5 border-2 border-[#e2e8f0] rounded-[10px] text-base font-[inherit] transition-all duration-300 bg-[#f8f9fa] resize-y min-h-[150px] focus:outline-none focus:border-[#20B2AA] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] max-sm:py-3 max-sm:px-4 max-sm:text-[0.95rem] max-[400px]:py-2.5 max-[400px]:px-3.5 max-[400px]:text-[0.9rem]"
              ></textarea>
              <button 
                type="submit"
                className="bg-gradient-to-br from-[#20B2AA] to-[#17a89d] text-white border-none py-4 px-10 text-[1.1rem] font-semibold rounded-[10px] cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] shadow-[0_4px_15px_rgba(32,178,170,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(32,178,170,0.4)] max-sm:py-3.5 max-sm:px-[35px] max-sm:text-base max-[400px]:py-3 max-[400px]:px-[30px] max-[400px]:text-[0.95rem]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="max-w-[1400px] mx-auto mt-10 pt-0 pb-[60px] px-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[25px] max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-5 max-sm:pb-10 max-[1600px]:max-w-[1600px] max-[1600px]:grid-cols-4">
        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaMapMarkerAlt className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Location
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <p className="font-semibold text-[#2d3748] mb-[5px]">Visit us at:</p>
            Jigyasa Hospital
            <br />
            Near Miglani Cinema,
            <br />
            Rampur Road, Moradabad 244001
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaHeadset className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              24/7 Service
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <p className="font-semibold text-[#2d3748] mb-[5px]">Call us on:</p>
            Mob: 7900903333
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaEnvelope className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Drop a Line
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <p className="font-semibold text-[#2d3748] mb-[5px]">Email us at:</p>
            info@jigyasahospital.in
          </p>
        </div>

        <div className="bg-white p-[30px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 text-center hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(32,178,170,0.15)] max-sm:py-[25px] max-sm:px-5 max-[400px]:py-5 max-[400px]:px-[15px]">
          <div className="flex items-center justify-center gap-[15px] mb-[15px]">
            <FaClock className="text-[2.5rem] text-[#20B2AA] max-sm:text-[2rem]" />
            <h3 className="text-[1.3rem] text-[#2d3748] m-0 font-semibold max-sm:text-[1.2rem]">
              Office Hours
            </h3>
          </div>
          <p className="text-[#4a5568] leading-[1.8] text-base m-0">
            <p className="font-semibold text-[#2d3748] mb-[5px]">Hours of Operation:</p>
            24/7 Medical Care & Support
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
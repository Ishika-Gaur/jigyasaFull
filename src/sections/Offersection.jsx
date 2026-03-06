'use client';

import React, { useEffect } from 'react';

const servicesData = [
  {
    icon: "https://cdn-icons-png.flaticon.com/128/883/883407.png",
    title: "Generic Medicine",
    description: "Affordable and high-quality medicines to ensure effective treatment for all. Our pharmacy provides trusted generic alternatives that are just as safe and reliable as branded medicines."
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/4981/4981979.png",
    title: "Health Checks & Screening",
    description: "Early detection saves lives! Our advanced health check-ups and screenings help diagnose potential health issues at an early stage, ensuring timely and effective medical intervention."
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/808/808999.png",
    title: "Vaccination",
    description: "Vaccination helps protect against infectious diseases by building immunity. It's safe, effective, and essential for both individual and public health. Jigyasa Hospital offers a wide range of vaccines for all ages."
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/3077/3077715.png",
    title: "Medicine Consultation",
    description: "Expert doctors provide personalized consultations to diagnose, treat, and manage various health conditions. Whether addressing chronic illnesses, acute concerns, or general health guidance, the consultation ensures you receive the best care for your well-being."
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/5237/5237758.png",
    title: "Doctor Receipt",
    description: "A doctor receipt includes essential details like the doctor's name, consultation fees, treatment provided, and prescribed medications. It serves as an important record for your medical history, ensuring transparency and clarity in your healthcare journey."
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/4968/4968662.png",
    title: "Pharmacy Store",
    description: "Our pharmacy offers a wide range of prescription and over-the-counter medications, health supplements, and medical supplies. With knowledgeable staff available to assist, we ensure you receive the right products for your health needs, all at competitive prices."
  }
];

const OfferSection = () => {
  useEffect(() => {
    // Preload font - NO TIMMER!
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Force font load immediately
    document.documentElement.style.fontFamily = "'Inter', sans-serif";
  }, []);

  return (
    <>
      <div className="__offer_section">
        <div className="__content_wrapper">
          <div className="__header_section">
            <h2 className="__section_subtitle">WHAT WE OFFER</h2>
            <h1 className="font-inter __section_title">Live happily, Live healthily</h1>
            <p className="font-inter __section_description">
              At <strong>Jigyasa Hospital</strong>, we provide a{" "}
              <strong>comprehensive range of medical services</strong> designed to
              meet the diverse healthcare needs of our patients. Our expert team
              ensures{" "}
              <strong>
                quality treatment, personalized care, and advanced medical solutions
              </strong>{" "}
              across various specialties.
            </p>
          </div>

          <div className="__card_section">
            {servicesData.map((service, index) => (
              <div key={service.title} className="__offer_card">
                <div className="__card_icon">
                  <div className="__icon_wrapper">
                    <img src={service.icon} alt={`${service.title} Icon`} />
                  </div>
                </div>
                <h3 className="font-inter">{service.title}</h3>
                <p className="font-inter">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap') !important;
        
        :root {
          --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        * {
          font-family: var(--font-inter) !important;
          font-feature-settings: 'kern' 1 !important;
        }
        
        /* Remove all font loading animations/timers */
        * {
          font-display: block !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* Your exact original CSS - NO CHANGES */
        .__offer_section {
          padding: 80px 5%;
          text-align: center;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          position: relative;
          overflow: hidden;
        }

        .__offer_section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(37, 177, 168, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(37, 177, 168, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .__content_wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .__header_section {
          margin-bottom: 60px;
          animation: slideInFromTop 1s ease-out 0s !important;
        }

        .__section_subtitle {
          display: inline-block;
          font-size: 14px;
          color: #25b1a8;
          font-weight: 600;
          margin-bottom: 15px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #cff0ef 0%, #b8e8e5 100%);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(37, 177, 168, 0.2);
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .__section_subtitle:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 177, 168, 0.2);
        }

        .__section_subtitle::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .__section_subtitle:hover::after {
          left: 100%;
        }

        .__section_title {
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #111827 0%, #374151 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          line-height: 1.1 !important;
        }

        .__section_description {
          max-width: 800px;
          margin: 0 auto 40px;
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          opacity: 0.9;
        }

        .__section_description strong {
          color: #25b1a8;
          font-weight: 600;
        }

        .__card_section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
          margin-top: 50px;
        }

        .__offer_card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 35px 25px;
          border-radius: 20px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-align: left;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          animation: cardSlideIn 0.8s ease-out forwards;
          opacity: 1 !important; /* Force instant render */
          transform: translateY(0) !important; /* No initial offset */
        }

        .__offer_card:nth-child(1) { animation-delay: 0.1s; }
        .__offer_card:nth-child(2) { animation-delay: 0.2s; }
        .__offer_card:nth-child(3) { animation-delay: 0.3s; }
        .__offer_card:nth-child(4) { animation-delay: 0.4s; }
        .__offer_card:nth-child(5) { animation-delay: 0.5s; }
        .__offer_card:nth-child(6) { animation-delay: 0.6s; }

        /* Rest of your exact CSS remains the same... */
        .__offer_card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(37, 177, 168, 0.1) 0%, rgba(173, 225, 221, 0.1) 100%);
          transition: left 0.5s ease;
          z-index: -1;
        }

        .__offer_card:hover::before { left: 0; }
        .__offer_card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 40px rgba(37, 177, 168, 0.15);
          border-color: rgba(37, 177, 168, 0.3);
        }

        .__card_icon { margin-bottom: 20px; position: relative; }
        .__icon_wrapper {
          width: 70px; height: 70px; border-radius: 50%;
          background: linear-gradient(135deg, #25b1a8 0%, #20a39e 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(37, 177, 168, 0.2);
        }

        .__icon_wrapper::after {
          content: ''; position: absolute;
          top: -5px; left: -5px; right: -5px; bottom: -5px;
          border-radius: 50%; border: 2px solid rgba(37, 177, 168, 0.3);
          animation: pulse 2s infinite;
        }

        .__offer_card:hover .__icon_wrapper {
          transform: rotate(10deg) scale(1.1);
          box-shadow: 0 12px 30px rgba(37, 177, 168, 0.3);
        }

        .__icon_wrapper img {
          width: 35px; height: 35px;
          filter: brightness(0) invert(1);
          transition: transform 0.3s ease;
        }

        .__offer_card:hover .__icon_wrapper img { transform: scale(1.1); }

        .__offer_card h3 {
          font-size: 20px; font-weight: 600; color: #1f2937;
          margin-bottom: 15px; transition: color 0.3s ease;
        }

        .__offer_card:hover h3 { color: #25b1a8; }

        .__offer_card p {
          font-size: 14px; color: #6b7280;
          line-height: 1.6; transition: color 0.3s ease;
        }

        .__offer_card:hover p { color: #4b5563; }

        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        /* Responsive - Exact match */
        @media (max-width: 1024px) {
          .__card_section { grid-template-columns: repeat(2, 1fr); gap: 25px; }
          .__offer_section { padding: 60px 4%; }
        }

        @media (max-width: 768px) {
          .__section_title { font-size: 32px; }
          .__offer_card { padding: 25px 20px; }
          .__icon_wrapper { width: 60px; height: 60px; }
          .__icon_wrapper img { width: 30px; height: 30px; }
        }

        @media (max-width: 640px) {
          .__card_section { grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .__offer_section { padding: 40px 3%; }
          .__section_subtitle { font-size: 13px; padding: 6px 12px; }
          .__section_title { font-size: 28px; }
          .__section_description { font-size: 15px; }
          .__offer_card { padding: 20px 15px; }
          .__offer_card h3 { font-size: 16px; margin-bottom: 10px; }
          .__offer_card p { font-size: 13px; }
        }
      `}</style>
    </>
  );
};

export default OfferSection;
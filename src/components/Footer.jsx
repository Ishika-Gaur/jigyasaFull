import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] pt-[60px] pb-[30px] px-[5%] font-sans text-[#374151]">
      <div className="grid grid-cols-4 gap-10 mb-10 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {/* Logo and quote */}
        <div>
          <img src="/logo.png" alt="Jigyasa Hospital" className="w-[150px] mb-[15px]" />
          <p className="text-sm mb-2.5 leading-[1.6]">
            "Dedicated to providing exceptional care with expertise and
            compassion. Your health and well-being are our top priority."
          </p>
        </div>

        {/* Our Company */}
        <div>
          <h4 className="text-xl font-semibold mb-5 text-[#11534f]">Links</h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5">
              <Link href="/about" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                About Us
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/departments" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Departments
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/doctors" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Doctors
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/facility" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Facilities
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/contact" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-semibold mb-5 text-[#11534f]">Contact Info</h4>
          <p className="text-sm mb-2.5 leading-[1.6]">Feel free to contact & reach us!</p>
          <p className="text-sm mb-2.5 leading-[1.6]">Near Miglani Cinema, Rampur road moradabad, 244001</p>
          <p className="text-sm mb-2.5 leading-[1.6]">Email: info@jigyasahospital.in</p>
          <p className="text-sm mb-2.5 leading-[1.6]">Phone: 7900903333</p>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-xl font-semibold mb-5 text-[#11534f]">Useful Links</h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5">
              <Link href="/doctors" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Get Appointment
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/doctors" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                About Doctors
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/blog" className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]">
                Blog
              </Link>
            </li>
            <li className="mb-2.5">
              <a
                href="https://www.instagram.com/jigyasa_hospital/?utm_source=qr&igsh=MXc3bjY5dWN4aDduMQ%3D%3D#"
                className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="https://www.facebook.com/profile.php?id=61572698922701"
                className="text-[#374151] no-underline transition-colors duration-300 hover:text-[#25B1A8]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="border-t border-[#e5e7eb] pt-5 flex flex-wrap justify-between items-center gap-[15px] text-sm max-sm:flex-col max-sm:text-center">
        <div>
          <Link href="/tandc" className="mr-[15px] text-[#6b7280] no-underline hover:text-[#25B1A8]">
            Terms & Condition
          </Link>
          <Link href="/support" className="mr-[15px] text-[#6b7280] no-underline hover:text-[#25B1A8]">
            Support
          </Link>
          <Link href="/privacy" className="mr-[15px] text-[#6b7280] no-underline hover:text-[#25B1A8]">
            Privacy Policy
          </Link>
        </div>
        
        <div>
          <a
            href="https://www.facebook.com/profile.php?id=61572698922701"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2.5 text-lg text-[#6b7280] transition-colors duration-300 hover:text-[#25B1A8]"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://x.com/jigyasahospital?t=zr7yEeDv2E-kloF8np3Sng&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2.5 text-lg text-[#6b7280] transition-colors duration-300 hover:text-[#25B1A8]"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://www.instagram.com/jigyasa_hospital/?utm_source=qr&igsh=MXc3bjY5dWN4aDduMQ%3D%3D#"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2.5 text-lg text-[#6b7280] transition-colors duration-300 hover:text-[#25B1A8]"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
        
        <p className="text-sm">
          © 2025 Jigyasa Hospital. Powered by{" "}
          <a
            href="https://www.zentrixinfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#374151] font-semibold no-underline hover:text-[#25B1A8]"
          >
            Zentrix Infotech
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faCalendarCheck,
  faSearch,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { doctorsData } from "@/app/doctors/data/doctorsData";

// Complete departments list matching bodyparts folder structure
const departmentsList = [
  { name: "General Medicine", route: "/bodyparts/generalmedicine" },
  { name: "Cardiology", route: "/bodyparts/heart" },
  { name: "Heart", route: "/bodyparts/heart" },
  { name: "Gynecology", route: "/bodyparts/reproductive" },
  { name: "Reproductive Health", route: "/bodyparts/reproductive" },
  { name: "Pediatrics", route: "/bodyparts/throat" },
  { name: "Orthopedics", route: "/bodyparts/knee" },
  { name: "Knee Care", route: "/bodyparts/knee" },
  { name: "Laparoscopic Surgery", route: "/bodyparts/liver" },
  { name: "Liver", route: "/bodyparts/liver" },
  { name: "GI & General Surgery", route: "/bodyparts/stomach" },
  { name: "Gastroenterology", route: "/bodyparts/stomach" },
  { name: "Stomach", route: "/bodyparts/stomach" },
  { name: "Oral & Maxillofacial Surgery", route: "/bodyparts/teeth" },
  { name: "Dental", route: "/bodyparts/teeth" },
  { name: "Teeth", route: "/bodyparts/teeth" },
  { name: "Dermatology", route: "/bodyparts/skin" },
  { name: "Skin", route: "/bodyparts/skin" },
  { name: "Family Medicine", route: "/bodyparts/body" },
  { name: "Body", route: "/bodyparts/body" },
  { name: "Neurosurgery", route: "/bodyparts/brain" },
  { name: "Brain", route: "/bodyparts/brain" },
  { name: "Psychiatry", route: "/bodyparts/mind" },
  { name: "Mental Health", route: "/bodyparts/mind" },
  { name: "Mind", route: "/bodyparts/mind" },
  { name: "Plastic Surgery", route: "/bodyparts/face" },
  { name: "Face", route: "/bodyparts/face" },
  { name: "Endocrinology", route: "/bodyparts/endocrinology" },
  { name: "Rheumatology", route: "/bodyparts/knee" },
  { name: "Ophthalmology", route: "/bodyparts/eye" },
  { name: "Eye", route: "/bodyparts/eye" },
  { name: "Radiology", route: "/bodyparts/chest" },
  { name: "Chest", route: "/bodyparts/chest" },
  { name: "Ankle", route: "/bodyparts/ankle" },
  { name: "Arm", route: "/bodyparts/arm" },
  { name: "Ear", route: "/bodyparts/ear" },
  { name: "ENT", route: "/bodyparts/ear" },
  { name: "Elbow", route: "/bodyparts/elbow" },
  { name: "Foot", route: "/bodyparts/foot" },
  { name: "Hip", route: "/bodyparts/hip" },
  { name: "Kidney", route: "/bodyparts/kidney" },
  { name: "Urology", route: "/bodyparts/kidney" },
  { name: "Lower Back", route: "/bodyparts/lowerback" },
  { name: "Spine", route: "/bodyparts/lowerback" },
  { name: "Nose", route: "/bodyparts/nose" },
  { name: "Sinus", route: "/bodyparts/nose" },
  { name: "Thigh", route: "/bodyparts/thigh" },
  { name: "Leg", route: "/bodyparts/thigh" },
  { name: "Throat", route: "/bodyparts/throat" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Prevent flash on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setPagesOpen(false);
    setGalleryOpen(false);
    setSearchQuery("");
    setShowResults(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (pathname === "/") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  // Universal Search - Supports ALL characters: Unicode, symbols, numbers, any language
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Normalize query - supports all Unicode characters, symbols, numbers
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    const addedRoutes = new Set();

    // Helper function for flexible matching - works with any characters
    const matchesQuery = (text) => {
      if (!text) return false;
      const normalizedText = text.toLowerCase();
      
      // Direct substring match (supports all Unicode)
      if (normalizedText.includes(normalizedQuery)) return true;
      
      // Word-by-word match for multi-word queries
      const queryWords = normalizedQuery.split(/\s+/);
      const textWords = normalizedText.split(/\s+/);
      
      return queryWords.every(qWord => 
        textWords.some(tWord => tWord.includes(qWord))
      );
    };

    // Search in doctors - all searchable fields
    doctorsData.forEach(doctor => {
      const searchableFields = [
        doctor.name,
        doctor.specialization,
        doctor.title,
        doctor.credentials || '',
        doctor.department || '',
        doctor.education || '',
        doctor.experience || ''
      ];

      if (searchableFields.some(field => matchesQuery(field))) {
        results.push({
          type: "doctor",
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          image: doctor.image
        });
      }
    });

    // Search in bodyparts/departments
    departmentsList.forEach(dept => {
      if (matchesQuery(dept.name) && !addedRoutes.has(dept.route)) {
        results.push({
          type: "department",
          name: dept.name,
          route: dept.route
        });
        addedRoutes.add(dept.route);
      }
    });

    setSearchResults(results);
    setShowResults(true);
  };

  const handleResultClick = (result) => {
    if (result.type === "doctor") {
      router.push(`/doctors/${result.id}`);
    } else if (result.type === "department") {
      router.push(result.route);
    }
    setSearchQuery("");
    setShowResults(false);
    setMobileSearchOpen(false);
  };

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? "fixed top-0 left-0 bg-white shadow-md z-[9999]"
          : "relative z-[9999]"
      } ${!isLoaded ? "opacity-0" : "opacity-100"}`}
      style={{ transition: "opacity 0.3s ease-in-out" }}
    >
      {/* Top Header - Always visible with forced consistent styling */}
      <div className="flex md:flex justify-between items-center bg-gray-100 px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm !font-sans">
        <div className="flex gap-3 md:gap-6 items-center flex-wrap w-full">
          <a
            href="tel:7900903333"
            className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-teal-500 transition-colors !font-sans !no-underline"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <FontAwesomeIcon icon={faPhone} className="text-teal-600 text-xs md:text-sm" />
            <span className="font-medium !font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>7900903333</span>
          </a>
          <span className="flex items-center gap-1.5 md:gap-2 text-gray-700 flex-1 min-w-0 !font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <FontAwesomeIcon icon={faLocationDot} className="text-teal-600 text-xs md:text-sm flex-shrink-0" />
            <span className="font-medium truncate !font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Near Milgani Cinema, Rampur Road, Moradabad</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center gap-3">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="flex-shrink-0">
            <img src="/logo.png" alt="logo" className="h-10 sm:h-11" />
          </Link>

          {/* Desktop Search Bar - Between Logo and Menu */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="search-container relative w-full">
              <div className="relative flex items-center bg-gray-50 rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-100 border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200">
                <FontAwesomeIcon 
                  className="absolute left-4 text-teal-500 text-sm pointer-events-none" 
                  icon={faSearch} 
                />
                <input
                  type="text"
                  className="w-full py-2.5 pl-11 pr-4 border-none outline-none text-sm text-gray-800 bg-transparent placeholder:text-gray-400"
                  placeholder="Search Doctors & Specialities"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-h-[400px] overflow-y-auto z-[1000] animate-slideDown">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.type === "doctor" ? (
                        <div className="flex items-center gap-3">
                          <img 
                            src={result.image} 
                            alt={result.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%2314b8a6" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" font-size="20" text-anchor="middle" dy=".3em" fill="white"%3E${result.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{result.name}</div>
                            <div className="text-xs text-gray-600 truncate">{result.specialization}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex-shrink-0">
                            <FontAwesomeIcon icon={faStethoscope} className="text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{result.name}</div>
                            <div className="text-xs text-gray-600">Department</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showResults && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-[1000]">
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No doctors or departments found
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Icon & Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <FontAwesomeIcon icon={faSearch} className="text-teal-500 text-sm" />
            </button>

            {/* Hamburger */}
            <button
              className="flex flex-col gap-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`w-6 h-0.5 bg-gray-800 transition ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-800 transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-800 transition ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 lg:gap-8 font-semibold text-gray-700 items-center text-sm lg:text-base">
            <li><Link href="/" className="hover:text-teal-500 transition-colors">HOME</Link></li>
            <li><Link href="/about" className="hover:text-teal-500 transition-colors">ABOUT</Link></li>
            <li><Link href="/department" className="hover:text-teal-500 transition-colors">DEPARTMENTS</Link></li>
            <li><Link href="/doctors" className="hover:text-teal-500 transition-colors">DOCTORS</Link></li>

            {/* Pages Dropdown */}
            <li className="relative">
              <button
                onClick={() => setPagesOpen(!pagesOpen)}
                className="flex items-center gap-1 hover:text-teal-500 transition-colors"
              >
                PAGES
                <span
                  className={`transition text-xs ${
                    pagesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {pagesOpen && (
                <ul className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-40 mt-2">
                  <li><Link href="/facility" className="block px-4 py-2 hover:bg-teal-50 text-sm">Facility</Link></li>
                  <li><Link href="/testimonial" className="block px-4 py-2 hover:bg-teal-50 text-sm">Testimonial</Link></li>
                  <li><Link href="/blog" className="block px-4 py-2 hover:bg-teal-50 text-sm">Blog</Link></li>
                </ul>
              )}
            </li>

            {/* Gallery Dropdown */}
            <li className="relative">
              <button
                onClick={() => setGalleryOpen(!galleryOpen)}
                className="flex items-center gap-1 hover:text-teal-500 transition-colors"
              >
                GALLERY
                <span
                  className={`transition text-xs ${
                    galleryOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {galleryOpen && (
                <ul className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-40 mt-2">
                  <li><Link href="/photo-gallery" className="block px-4 py-2 hover:bg-teal-50 text-sm">Photo Gallery</Link></li>
                  <li><Link href="/video-gallery" className="block px-4 py-2 hover:bg-teal-50 text-sm">Video Gallery</Link></li>
                </ul>
              )}
            </li>

            <li><Link href="/contact" className="hover:text-teal-500 transition-colors">CONTACT US</Link></li>
          </ul>

          {/* Appointment Button */}
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 lg:px-5 py-2 rounded-full shadow-md hover:scale-105 transition text-sm lg:text-base whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span className="hidden lg:inline">Book Appointment</span>
            <span className="lg:hidden">Book</span>
          </Link>
        </div>

        {/* Mobile Search Bar (Separate from menu) */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-4">
            <div className="search-container relative w-full">
              <div className="relative flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200 focus-within:border-teal-500">
                <FontAwesomeIcon 
                  className="absolute left-3 text-teal-500 text-sm pointer-events-none" 
                  icon={faSearch} 
                />
                <input
                  type="text"
                  className="w-full py-2.5 pl-10 pr-3 border-none outline-none text-sm text-gray-800 bg-transparent placeholder:text-gray-400"
                  placeholder="Search Doctors & Specialities"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  autoFocus
                />
              </div>

              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-h-[280px] overflow-y-auto z-[1000] animate-slideDown">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      onClick={() => handleResultClick(result)}
                    >
                      {result.type === "doctor" ? (
                        <div className="flex items-center gap-3">
                          <img 
                            src={result.image} 
                            alt={result.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%2314b8a6" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" font-size="20" text-anchor="middle" dy=".3em" fill="white"%3E${result.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{result.name}</div>
                            <div className="text-xs text-gray-600 truncate">{result.specialization}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex-shrink-0">
                            <FontAwesomeIcon icon={faStethoscope} className="text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{result.name}</div>
                            <div className="text-xs text-gray-600">Department</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile No Results */}
              {showResults && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-[1000]">
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No doctors or departments found
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4">
            <ul className="flex flex-col gap-4 font-semibold text-gray-700">
              <li><Link href="/" className="hover:text-teal-500 transition-colors">HOME</Link></li>
              <li><Link href="/about" className="hover:text-teal-500 transition-colors">ABOUT</Link></li>
              <li><Link href="/department" className="hover:text-teal-500 transition-colors">DEPARTMENTS</Link></li>
              <li><Link href="/doctors" className="hover:text-teal-500 transition-colors">DOCTORS</Link></li>
              <li><Link href="/facility" className="hover:text-teal-500 transition-colors">Facility</Link></li>
              <li><Link href="/testimonial" className="hover:text-teal-500 transition-colors">Testimonial</Link></li>
              <li><Link href="/blog" className="hover:text-teal-500 transition-colors">Blog</Link></li>
              <li><Link href="/photo-gallery" className="hover:text-teal-500 transition-colors">Photo Gallery</Link></li>
              <li><Link href="/video-gallery" className="hover:text-teal-500 transition-colors">Video Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-teal-500 transition-colors">CONTACT US</Link></li>
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease;
        }

        /* Custom Scrollbar */
        .search-container div::-webkit-scrollbar {
          width: 4px;
        }

        @media (min-width: 640px) {
          .search-container div::-webkit-scrollbar {
            width: 6px;
          }
        }

        .search-container div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .search-container div::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }

        .search-container div::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
}
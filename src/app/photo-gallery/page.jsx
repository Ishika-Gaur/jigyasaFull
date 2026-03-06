// app/hospital-gallery/page.js (or components/HospitalGallery.js)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Footer from '@/components/Footer'; // Adjust path as needed

const HospitalGallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const galleryItems = [
    {
      id: 1,
      category: 'equipment',
      image: 'ultraSound.png',
      title: 'Ultra Sound',
      description: 'The hospital Ultrasound facility offers comfortable, radiation-free imaging for quick and precise diagnostic evaluation.',
      moreImages: [
        'ultraSound.png',
         'ultraSound-2.png'
       
      ]
    },
    {
      id: 2,
      category: 'all',
      image: 'opd.png',
      title: 'OPD',
      description: 'A well-organized OPD delivering quality outpatient care with minimal waiting time and expert medical support.',
      moreImages: [
        'opd.png',
        'opd-2.png',
        'opd-3.png'
      ]
    },
    {
      id: 3,
      category: 'equipment',
      image: 'icu.png',
      title: 'ICU',
      description: '24/7 intensive care with advanced monitoring and expert support.',
      moreImages: [
        'icu.png',
        'icu-2.png',
        // 'icu-3.png'
      ]
    },
    
    {
      id: 4,
      category: 'all',
      image: 'jhMembers.jpeg',
      title: 'Jigyasa Hospital Community Gathering',
      description: 'A group of staff, doctors, and community members gathered in front of Jigyasa Hospital, reflecting unity, trust, and commitment to quality healthcare',
      moreImages: [
        'jhMembers.jpeg',
        'groupPhoto.jpeg'
      ]
    },
    {
      id: 5,
      category: 'patients',
      image: 'ph-5.jpeg',
      title: 'Patient-Centered OPD',
      description: 'Comfortable and modern patient accommodations designed for healing and recovery.',
      moreImages: [
        'ph-5.jpeg',
        'ph-5-a.jpeg'
      ]
    },
    {
      id: 6,
      category: 'patients',
      image: 'freeCamp.jpeg',
      title: 'Free Health Check-up Camp at Jigyasa Super Speciality Hospital',
      description: 'Jigyasa Super Speciality Hospital conducted a free health check-up camp, offering medical consultations and tests to many patients.',
      moreImages: [
        'freeCamp.jpeg',
        'ph-6.jpeg',
        'ph-7.jpeg',
        'ph-5-a.jpeg'
      ]
    },
    {
      id: 7,
      category: 'patients',
      image: 'worldHeartDay.jpeg',
      title: 'World Heart Day Celebration at Jigyasa Hospital',
      description: 'Doctors and staff celebrated World Heart Day at Jigyasa Super Speciality Hospital to promote heart health awareness.',
      moreImages: [
        'worldHeartDay.jpeg',
        'worldHeartDay-2.jpeg',
        'worldHeartDay-3.jpeg'
      ]
    },
    {
      id: 8,
      category: 'equipment',
      image: 'x-ray.png',
      title: 'X-Ray',
      description: 'The hospital X-Ray facility offers safe, fast, and reliable imaging for accurate evaluation of medical conditions.',
      moreImages: [
        'x-ray.png',
        'x-ray-2.png'
      ]
    },
    {
      id: 9,
      category: 'equipment',
      image: 'ct.png',
      title: 'CT',
      description: 'Equipped with advanced CT technology, our imaging unit delivers high-resolution scans for accurate and reliable diagnosis',
      moreImages: [
        'ct.png',
        'ct-1.png'
      ]
    },
    {
      id: 10,
      category: 'doctors',
      image: 'training.png',
      title: 'Patient Training & Awareness Program at Jigyasa Hospital',
      description: 'A patient training and awareness session was conducted at Jigyasa Super Speciality Hospital to educate patients on heart health and healthy lifestyle practices.',
      moreImages: [
        'training.png',
        'training-2.png',
        'training-3.png'
      ]
    },
    {
      id: 11,
      category: 'patients',
      image: 'pharmacy.png',
      title: 'Pharmacy Center',
      description: 'Comprehensive rehabilitation services to support patient recovery and mobility.',
      moreImages: [
        'pharmacy.png',
        'pharmacy-2.png'
      ]
    },
    {
      id: 12,
      category: 'equipment',
      image: 'opreation.png',
      title: 'Operation Theater',
      description: 'A fully equipped, sterile Operation Theater designed for safe and efficient surgical care.',
      moreImages: [
        'opreation.png',
        'operation-2.png',
        'operation-1.png'
      ]
    },
    {
      id: 13,
      category: 'doctors',
      image: 'staffMeeting.jpeg',
      title: 'Hospital Leadership & Team Meeting',
      description: 'Doctors, management, and staff gathered for a discussion inside the hospital, reflecting collaboration, planning, and commitment to quality patient care.',
      moreImages: [
        'staffMeeting.jpeg',
        // 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80'
      ]
    },
    {
      id: 14,
      category: 'doctors',
      image: 'flagHosting.jpeg',
      title: 'Flag Hoisting Ceremony at Hospital',
      description: 'Hospital leaders, staff, and families gathered for a patriotic flag hoisting ceremony, celebrating unity, pride, and commitment to serving the community.',
      moreImages: [
        'flagHosting.jpeg',
        'flagHosting-2.jpeg'
      ]
    },
     {
      id: 15,
      category: 'equipment',
      image: 'nicu.png',
      title: 'NICU',
      description: 'Specialized care for newborns requiring advanced medical support and continuous monitoring.',
      moreImages: [
        'nicu.png',
        'nicu-2.png'
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'patients', label: 'Patient Care' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const openModal = useCallback((item) => {
    setSelectedItem(item);
    setCurrentSlideIndex(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setCurrentSlideIndex(0);
    document.body.style.overflow = 'auto';
  }, []);

  const goToNextSlide = useCallback(() => {
    if (!selectedItem) return;
    setCurrentSlideIndex((currentSlideIndex + 1) % selectedItem.moreImages.length);
  }, [selectedItem, currentSlideIndex]);

  const goToPrevSlide = useCallback(() => {
    if (!selectedItem) return;
    setCurrentSlideIndex(
      currentSlideIndex === 0 ? selectedItem.moreImages.length - 1 : currentSlideIndex - 1
    );
  }, [selectedItem, currentSlideIndex]);

  const goToSlide = useCallback((idx) => {
    setCurrentSlideIndex(idx);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && selectedItem) {
      closeModal();
    }
    if (e.key === 'ArrowRight' && selectedItem) {
      goToNextSlide();
    }
    if (e.key === 'ArrowLeft' && selectedItem) {
      goToPrevSlide();
    }
  }, [selectedItem, closeModal, goToNextSlide, goToPrevSlide]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Inline Styles (same as original)
  const styles = {
    app: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #f4f6fb 0%, #e8f0fe 100%)',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    },
    hero: {
      background: 'linear-gradient(to right, rgba(9, 33, 83, 0.9), rgba(9, 33, 83, 0.6)), url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&h=800&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '0 1rem'
    },
    heroTitle: {
      fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      margin: 0
    },
    filterTabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      padding: '40px 20px',
      flexWrap: 'wrap',
      background: 'rgba(255, 255, 255, 0.5)'
    },
    filterBtn: {
      padding: '12px 28px',
      background: 'white',
      border: '2px solid #0dbd9d',
      color: '#0dbd9d',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(13, 189, 157, 0.1)',
      outline: 'none'
    },
    filterBtnActive: {
      background: 'linear-gradient(135deg, #0dbd9d, #25b1a8)',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(13, 189, 157, 0.3)'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 5%'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
      gap: '30px'
    },
    card: {
      background: 'linear-gradient(145deg, #ffffff, #f8fbff)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(13, 189, 157, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      border: '1px solid rgba(13, 189, 157, 0.08)'
    },
    imageWrapper: {
      position: 'relative',
      width: '100%',
      height: '300px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #e8f0fe, #f4f6fb)'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(13, 189, 157, 0.8), transparent)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '20px'
    },
    category: {
      background: 'white',
      color: '#0dbd9d',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      textTransform: 'capitalize'
    },
    imageCount: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'linear-gradient(135deg, #0dbd9d, #25b1a8)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    },
    info: {
      padding: '25px'
    },
    title: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      color: '#111',
      marginBottom: '10px',
      fontWeight: '700',
      transition: 'color 0.3s ease'
    },
    description: {
      fontSize: 'clamp(0.87rem, 2vw, 0.95rem)',
      color: '#666',
      lineHeight: '1.6',
      margin: 0
    },
    modal: {
      display: selectedItem ? 'flex' : 'none',
      position: 'fixed',
      zIndex: 1000,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    modalInner: {
      background: 'white',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '1400px',
      maxHeight: '95vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #0dbd9d, #25b1a8)',
      color: 'white',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    modalBody: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      minHeight: 0
    },
    modalImageSection: {
      flex: 1,
      background: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '40px'
    },
    modalMainImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      borderRadius: '10px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      zIndex: 10,
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0dbd9d'
    },
    navButtonLeft: {
      left: '20px'
    },
    navButtonRight: {
      right: '20px'
    },
    imageCounter: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #0dbd9d, #25b1a8)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },
    modalSidebar: {
      width: '350px',
      background: 'white',
      borderLeft: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    sidebarDetails: {
      padding: '24px',
      borderBottom: '1px solid #e0e0e0'
    },
    sidebarTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#111',
      marginBottom: '16px'
    },
    descriptionText: {
      fontSize: '0.95rem',
      color: '#555',
      lineHeight: '1.7',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '10px'
    },
    thumbnailSection: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px'
    },
    thumbnailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px'
    },
    thumbnail: {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.3s ease'
    },
    thumbnailActive: {
      border: '2px solid #0dbd9d',
      boxShadow: '0 4px 12px rgba(13, 189, 157, 0.3)',
      transform: 'scale(1.05)'
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    thumbnailNumber: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s ease',
      fontSize: '32px',
      width: '40px',
      height: '40px',
      lineHeight: '1'
    }
  };

  return (
    <div style={styles.app}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }

        .gallery-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 16px 48px rgba(13, 189, 157, 0.15), 0 8px 32px rgba(0, 0, 0, 0.08);
          border-color: rgba(13, 189, 157, 0.2);
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.1);
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-card:hover .gallery-title {
          color: #0dbd9d;
        }

        .filter-btn:hover {
          background: linear-gradient(135deg, #0dbd9d, #25b1a8);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 189, 157, 0.3);
        }

        .nav-button:hover {
          background: #0dbd9d;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .thumbnail:hover {
          transform: scale(1.05);
          border-color: #0dbd9d;
        }

        @media (min-width: 768px) {
          .hero-section {
            height: 60vh !important;
          }
        }

        @media (max-width: 968px) {
          .modal-sidebar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }

          .gallery-image-wrapper {
            height: 200px !important;
          }

          .gallery-card .gallery-title {
            font-size: 0.95rem !important;
            margin-bottom: 0 !important;
          }

          .gallery-card .gallery-description {
            display: none !important;
          }

          .gallery-card .info {
            padding: 16px !important;
          }
        }

        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }

          .gallery-image-wrapper {
            height: 180px !important;
          }

          .gallery-card .gallery-title {
            font-size: 0.9rem !important;
            margin-bottom: 0 !important;
          }

          .gallery-card .gallery-description {
            display: none !important;
          }

          .gallery-card {
            padding: 0 !important;
          }

          .info {
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div style={styles.hero} className="hero-section">
        <h1 style={styles.heroTitle}>Hospital Photo Gallery</h1>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {filters.map(filter => (
          <button
            key={filter.id}
            className="filter-btn"
            style={{
              ...styles.filterBtn,
              ...(activeFilter === filter.id ? styles.filterBtnActive : {})
            }}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div style={styles.container}>
        <div className="gallery-grid" style={styles.grid}>
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-card"
              style={styles.card}
              onClick={() => openModal(item)}
            >
              <div 
                className="gallery-image-wrapper"
                style={styles.imageWrapper}
              >
                <img 
                  className="gallery-image"
                  src={item.image} 
                  alt={item.title} 
                  style={styles.image}
                />
                <div className="gallery-overlay" style={styles.overlay}>
                  <span style={styles.category}>
                    {filters.find(f => f.id === item.category)?.label || item.category}
                  </span>
                </div>
                {item.moreImages.length > 1 && (
                  <div style={styles.imageCount}>
                    +{item.moreImages.length - 1} more
                  </div>
                )}
              </div>
              <div className="info" style={styles.info}>
                <h3 className="gallery-title" style={styles.title}>{item.title}</h3>
                <p className="gallery-description" style={styles.description}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedItem && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalInner} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  {selectedItem.title}
                </h2>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {selectedItem.description}
                </p>
              </div>
              <button 
                className="close-button"
                style={styles.closeButton} 
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Main Image Section */}
              <div style={styles.modalImageSection}>
                <img 
                  src={selectedItem.moreImages[currentSlideIndex]} 
                  alt={selectedItem.title}
                  style={styles.modalMainImage}
                />

                {/* Navigation Arrows */}
                {selectedItem.moreImages.length > 1 && (
                  <>
                    <button
                      className="nav-button"
                      style={{ ...styles.navButton, ...styles.navButtonLeft }}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevSlide();
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="nav-button"
                      style={{ ...styles.navButton, ...styles.navButtonRight }}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextSlide();
                      }}
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div style={styles.imageCounter}>
                  {currentSlideIndex + 1} / {selectedItem.moreImages.length}
                </div>
              </div>

              {/* Sidebar */}
              <div style={styles.modalSidebar} className="modal-sidebar">
                {/* Description */}
                <div style={styles.sidebarDetails}>
                  <h3 style={styles.sidebarTitle}>Description</h3>
                  <p style={styles.descriptionText}>
                    {selectedItem.description}
                  </p>
                </div>

                {/* Thumbnails */}
                <div style={styles.thumbnailSection}>
                  <h3 style={{ ...styles.sidebarTitle, marginBottom: '16px' }}>
                    All Images ({selectedItem.moreImages.length})
                  </h3>
                  <div style={styles.thumbnailGrid}>
                    {selectedItem.moreImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="thumbnail"
                        style={{
                          ...styles.thumbnail,
                          ...(currentSlideIndex === idx ? styles.thumbnailActive : {})
                        }}
                        onClick={() => goToSlide(idx)}
                      >
                        <img 
                          src={img} 
                          alt={`View ${idx + 1}`}
                          style={styles.thumbnailImage}
                        />
                        <div style={styles.thumbnailNumber}>
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default HospitalGallery;
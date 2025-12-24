// Banner.js
import React, { useState, useEffect } from 'react';
import './styles/css/Banner.css';

// Import local images
import banner1 from '../images/banner1.avif';
import banner2 from '../images/banner2.avif';
import banner3 from '../images/banner3.avif';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [banner1, banner2, banner3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="banner">
      <div className="banner-slider">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image})`
            }}
          >
            <div className="banner-content">
              <h1 className="banner-title">Special Offer</h1>
              <h2 className="banner-subtitle">Limited Time Only</h2>
              <p className="banner-description">Discover amazing deals and discounts</p>
              {/* <button className="banner-button">
                Shop Now
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="banner-arrow banner-arrow-left" onClick={prevSlide}>
        ‹
      </button>
      <button className="banner-arrow banner-arrow-right" onClick={nextSlide}>
        ›
      </button>

      {/* Dots Indicator */}
      <div className="banner-dots">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
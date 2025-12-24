import React, { useState } from 'react';
import './styles/css/Slider.css';

// Import local product images
import product1 from '../assets/images/products/product1.jpg';
import product2 from '../assets/images/products/product2.jpg';
import product3 from '../assets/images/products/products3.jpg';
import product4 from '../assets/images/products/product4.jpg';
import product5 from '../assets/images/products/product5.jpg';

const Slider = () => {
  // Array of product images only
  const productImages = [product1, product2, product3, product4, product5];
  
  // Product URLs (you can modify these as needed)
  const productUrls = [
    "/products/product1",
    "/products/product2", 
    "/products/product3",
    "/products/product4",
    "/products/product5"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle image click - redirect to product page
  const handleImageClick = () => {
    // Redirect to product page
    window.open(productUrls[currentImageIndex], '_blank');
    // Or use React Router: navigate(productUrls[currentImageIndex]);
  };

  return (
    <div className="product-slider">
      <div className="slider-container">
        {/* Previous button */}
        <button className="nav-btn prev-btn" onClick={prevImage}>
          ‹
        </button>

        {/* Main image */}
        <div className="main-image-container" onClick={handleImageClick}>
          <img 
            src={productImages[currentImageIndex]} 
            alt={`Product ${currentImageIndex + 1}`}
            className="main-image"
          />
          <div className="image-overlay">
            <span>Click to View Product</span>
          </div>
        </div>

        {/* Next button */}
        <button className="nav-btn next-btn" onClick={nextImage}>
          ›
        </button>
      </div>

      {/* Image indicators */}
      <div className="image-indicators">
        {productImages.map((image, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => goToImage(index)}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail"
            />
          </button>
        ))}
      </div>

      {/* Product counter */}
      <div className="product-counter">
        {currentImageIndex + 1} / {productImages.length}
      </div>
    </div>
  );
};

export default Slider;
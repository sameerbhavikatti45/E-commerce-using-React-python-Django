import React, { useEffect, useState } from "react";
import "./styles/css/productGrid.css";
import { useCart } from "./CartContext";

export default function Product({showtitle=true}) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Products data:", data); // Debug log
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="books-container">
      {showtitle && (
      <h2 className="books-title">📚 Available Books</h2>
      )}

      <div className="books-grid">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="book-card">
              <img 
                src={product.image_url || "/placeholder-image.jpg"} 
                alt={product.name} 
                className="book-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
                <h4 className="book-category">Category: {product.category_name || "Uncategorized"}</h4>
              <h3 className="book-name">{product.name}</h3>
              {product.description && (
                <p className="book-description">{product.description.substring(0, 60)}...</p>
              )}
              <p className="book-price">₹{product.price}</p>

              <div className="book-buttons">
                <button 
                  onClick={() => addToCart(product)} 
                  className="btn add-btn"
                >
                  Add to Cart
                </button>
                <button className="btn buy-btn">
                  Buy Now
                </button>
              </div>
            </div> 
          ))
        )}
      </div>
    </div>
  );
}
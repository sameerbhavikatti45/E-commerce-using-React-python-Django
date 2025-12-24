import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/css/CategoryProducts.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCart } from "./CartContext";
function CategoryProducts() {
  const { addToCart } = useCart();
  const { id } = useParams(); // Get category ID from URL
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://127.0.0.1:8000/api/categories/${id}/products/`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Category not found");
          }
          throw new Error(`Failed to load: ${response.status}`);
        }

        const data = await response.json();
        setCategory(data.category);
        setProducts(data.products);
        console.log(
          `Loaded ${data.count} products for category ${data.category.name}`
        );
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="category-products-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-products-page">
        <Navbar />
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/shop")} className="back-to-shop">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="category-products-page">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="category-header">
          <h1>{category?.name || "Category Products"}</h1>
          <p className="products-count">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button onClick={() => navigate("/shop")} className="browse-all">
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/path/to/placeholder-image.jpg";
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <h4 className="book-category">Category: {product.category_name || "Uncategorized"}</h4>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, 100)}...
                  </p>
                  <div className="price-section">
                    <span className="product-price">₹{product.price}</span>
                    {product.discounted_price &&
                      product.discounted_price < product.price && (
                        <span className="original-price">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)} 
                    >
                    Add to Cart
                  </button>
                  <button className="buy-btn">
                  Buy Now
                </button>
                  {/* <button
                    className="view-details-btn"
                    onClick={() => navigate(`/products/${product.id}`)}
                    >
                    View Details
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CategoryProducts;

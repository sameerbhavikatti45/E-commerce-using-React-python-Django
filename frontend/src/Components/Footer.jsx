import "./styles/css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* COLUMN 1 — BRAND */}
        <div className="footer-col">
          <h2 className="footer-logo">Shoppy</h2>
          <p className="footer-desc">
            Your trusted marketplace for books and lifestyle essentials. Quality
            products at honest prices.
          </p>
        </div>

        {/* COLUMN 2 — QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/shop">Shop</a>
            </li>
            <li>
              <a href="/categories">Categories</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3 — CONTACT INFO */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>Email: support@shoppy.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Mumbai, Maharashtra, India</p>

          <div className="socials">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <p className="footer-bottom">© 2025 Shoppy. All rights reserved.</p>
    </footer>
  );
}

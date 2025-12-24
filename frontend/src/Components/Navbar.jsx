import { useState, useEffect } from "react";
import logo from "../images/logos.png";
import "./styles/css/Navbar.css";
import { useCart } from "../Components/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  
  const [Categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();
  
   // Fetch categories
  useEffect(() => {
  async function loadCategories() {
    try {
      setLoadingCategories(true);
      let res = await fetch("http://127.0.0.1:8000/api/categories/");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Categories API Response:", {
        data,
        type: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        firstItem: data?.[0]
      });
      
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      console.error("Error details:", err.message);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }
  loadCategories();
}, []);
  // Check if user is logged in on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const userString = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userString && token) {
        try {
          const userData = JSON.parse(userString);
           console.log("User data from localStorage:", userData)
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (for when login/logout happens in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom login/logout events
    const handleAuthEvent = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthEvent);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authChange"));

    // Close mobile menu if open
    setOpen(false);

    // Redirect to home
    navigate("/");
  };

  // Close dropdowns when clicking outside (optional enhancement)
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (dropdown && !e.target.closest(".dropdown")) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, [dropdown]);


  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">Shoppy</span>
      </div>

      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <ul className={`nav-links ${open ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/Shop" onClick={() => setOpen(false)}>
            Shop
          </Link>
        </li>

         {/* Categories Dropdown */}
        <li className="dropdown">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="drop-btn"
            aria-expanded={dropdown}
            disabled={loadingCategories}
          >
            {loadingCategories ? "Loading..." : "Categories ▾"}
          </button>
          {Categories.length > 0 && (
            <ul className={`drop-menu ${dropdown ? "show" : ""}`}>
              {Categories
                .filter(cat => cat.is_active) // Only show active categories
                .map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/categories/${cat.id}`}
                      onClick={() => {
                        setOpen(false);
                        setDropdown(false);
                      }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
          {!loadingCategories && Categories.length === 0 && (
            <ul className={`drop-menu ${dropdown ? "show" : ""}`}>
              <li className="no-categories">No categories available</li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/cart" className="cart" onClick={() => setOpen(false)}>
            <button className="cart-btn">
              Cart
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </button>
          </Link>
        </li>
        {/* Conditional rendering for auth */}
        {user ? (
          <>
            <li className="user-info">
              <span className="username">
                Welcome, {user.first_name || user.username}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" onClick={() => setOpen(false)}>
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

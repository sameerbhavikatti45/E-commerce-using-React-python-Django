import { useCart } from "../Components/CartContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Components/styles/css/Cart.css";
import { useState } from "react";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem, clearCart } = useCart();

  // Calculate totals
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = totalPrice <= 1000 || totalPrice === 0 ? 0 : 50;
  const grandTotal = totalPrice + shipping;

  // Billing form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "India",
    state: "",
    district: "",
    pincode: "",
    address: "",
  });

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckout, setIsCheckout] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Please enter a coupon code");
      setTimeout(() => setCouponMessage(""), 3000);
      return;
    }

    if (coupon.toUpperCase() === "SHOPPY10" && totalPrice > 0) {
      const discountAmount = totalPrice * 0.1;
      setDiscount(discountAmount);
      setCouponMessage(`✅ 10% discount applied! Saved ₹${discountAmount.toFixed(2)}`);
      setTimeout(() => setCouponMessage(""), 5000);
    } else if (coupon.toUpperCase() === "SAVE50" && totalPrice > 500) {
      const discountAmount = 50;
      setDiscount(discountAmount);
      setCouponMessage(`✅ ₹50 discount applied!`);
      setTimeout(() => setCouponMessage(""), 5000);
    } else {
      setCouponMessage("❌ Invalid coupon code");
      setTimeout(() => setCouponMessage(""), 3000);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCoupon("");
    setCouponMessage("Coupon removed");
    setTimeout(() => setCouponMessage(""), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Your cart is empty! Add items to proceed.");
      return;
    }

    setIsCheckout(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert(`Order placed successfully!\nTotal: ₹${(grandTotal - discount).toFixed(2)}\nShipping to: ${form.address}, ${form.district}, ${form.state} ${form.pincode}`);
      clearCart();
      setIsCheckout(false);
      // Reset form
      setForm({
        name: "",
        phone: "",
        country: "India",
        state: "",
        district: "",
        pincode: "",
        address: "",
      });
      setCoupon("");
      setDiscount(0);
      setCouponMessage("");
    }, 1500);
  };

  return (
    <>
      <Navbar />

      {cart.length === 0 ? (
        <div className="empty-cart-container">
          <div className="cart-icon">🛒</div>
          <h2 className="empty-cart">Your cart is empty</h2>
          <p className="empty-cart-text">Looks like you haven't added any items to your cart yet.</p>
          <a href="/shop" className="continue-shopping-btn">Continue Shopping</a>
        </div>
      ) : (
        <div className="cart-wrapper">

          {/* LEFT SIDE — CART LIST */}
          <div className="cart-container">
            <div className="cart-header">
              <h1>Shopping Cart ({cart.reduce((sum, item) => sum + item.qty, 0)} items)</h1>
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>

            <div className="cart-inner">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.image_url || item.image || '/placeholder-image.jpg'} 
                    alt={item.name}
                    className="item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />

                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="cart-price">₹{item.price} × {item.qty} = ₹{(item.price * item.qty).toFixed(2)}</p>

                    <div className="cart-actions">
                      <div className="qty-buttons">
                        <button 
                          onClick={() => decreaseQty(item.id)} 
                          disabled={item.qty <= 1}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button 
                          onClick={() => increaseQty(item.id)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* COUPON SECTION - Always visible on mobile */}
            <div className="coupon-section-mobile">
              <h3>Apply Coupon</h3>
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="coupon-input"
                  disabled={discount > 0}
                />
                {discount > 0 ? (
                  <button onClick={removeCoupon} className="remove-coupon-btn">
                    Remove
                  </button>
                ) : (
                  <button onClick={applyCoupon} className="apply-coupon-btn">
                    Apply
                  </button>
                )}
              </div>
              {couponMessage && (
                <div className={`coupon-message ${couponMessage.includes('✅') ? 'success' : 'error'}`}>
                  {couponMessage}
                </div>
              )}
              <div className="available-coupons">
                <p>Available coupons:</p>
                <div className="coupon-tags">
                  <span className="coupon-tag">SHOPPY10 - 10% off</span>
                  <span className="coupon-tag">SAVE50 - ₹50 off on orders above ₹500</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — BILLING FORM */}
          <div className="billing-section">
            <div className="billing-header">
              <h2>Billing Details</h2>
              <div className="secure-checkout">
                <span>🔒 Secure Checkout</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="billing-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    id="name"
                    name="name" 
                    placeholder="Enter your full name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input 
                    id="phone"
                    name="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input 
                    id="country"
                    name="country" 
                    placeholder="Country" 
                    value={form.country} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input 
                    id="state"
                    name="state" 
                    placeholder="Enter your state" 
                    value={form.state} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="district">District *</label>
                  <input 
                    id="district"
                    name="district" 
                    placeholder="Enter your district" 
                    value={form.district} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input 
                    id="pincode"
                    name="pincode" 
                    placeholder="Enter pincode" 
                    value={form.pincode} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Full Address *</label>
                <textarea 
                  id="address"
                  name="address" 
                  placeholder="Enter your complete address with landmarks" 
                  value={form.address} 
                  onChange={handleChange} 
                  rows="4"
                  required 
                />
              </div>

              {/* Payment Summary with Coupon */}
              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                
                {/* Coupon Section for Desktop */}
                <div className="coupon-section-desktop">
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="coupon-input"
                      disabled={discount > 0}
                    />
                    {discount > 0 ? (
                      <button onClick={removeCoupon} className="remove-coupon-btn" type="button">
                        Remove
                      </button>
                    ) : (
                      <button onClick={applyCoupon} className="apply-coupon-btn" type="button">
                        Apply
                      </button>
                    )}
                  </div>
                  {couponMessage && (
                    <div className={`coupon-message ${couponMessage.includes('✅') ? 'success' : 'error'}`}>
                      {couponMessage}
                    </div>
                  )}
                </div>

                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{(grandTotal - discount).toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isCheckout}
              >
                {isCheckout ? "Processing Order..." : `Pay ₹${(grandTotal - discount).toFixed(2)}`}
              </button>

              <div className="payment-methods">
                <p>Accepted Payment Methods:</p>
                <div className="payment-icons">
                  <span title="Credit/Debit Cards">💳</span>
                  <span title="Net Banking">🏦</span>
                  <span title="UPI">📱</span>
                  <span title="Cash on Delivery">💰</span>
                </div>
              </div>
            </form>
          </div>

        </div>
      )}
      <Footer/>
    </>
  );
}
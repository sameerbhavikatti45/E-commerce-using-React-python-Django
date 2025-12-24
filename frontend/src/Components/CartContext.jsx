import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppyCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('shoppyCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppyCart', JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);

      if (found) {
        // Item already exists → increase qty
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      // New item → add qty:1 with image_url
      return [...prev, { 
        ...product, 
        qty: 1,
        // Ensure we have the correct image field
        image: product.image_url || product.image || '/placeholder-image.jpg'
      }];
    });
  };

  // Increase qty
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease qty
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shoppyCart');
  };

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Calculate shipping (free over ₹1000)
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50;

  // Calculate total
  const total = subtotal + shipping;

  // Navbar count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
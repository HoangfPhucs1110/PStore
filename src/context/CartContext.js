import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load LocalStorage khi khởi chạy
  useEffect(() => {
    const saved = localStorage.getItem("pstore_cart_local");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Sync Server (Debounce)
  useEffect(() => {
    localStorage.setItem("pstore_cart_local", JSON.stringify(cart));
    const timer = setTimeout(() => {
      cartService.syncCart(cart).catch(console.error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.productId === product._id);
      if (idx === -1) {
        return [...prev, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.thumbnail || product.images?.[0],
          qty,
          slug: product.slug
        }];
      }
      const clone = [...prev];
      clone[idx].qty += qty;
      return clone;
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((x) => (x.productId === id ? { ...x, qty } : x)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.productId !== id));
  const clearCart = () => setCart([]);

  const stats = useMemo(() => {
    const itemsPrice = cart.reduce((s, x) => s + (x.price || 0) * x.qty, 0);
    const shippingPrice = itemsPrice >= 1000000 ? 0 : 30000;
    return { itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice, totalItem: cart.reduce((s,x)=>s+x.qty, 0) };
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, ...stats }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
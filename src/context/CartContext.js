import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("pstore_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("pstore_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (p, qty = 1, options = {}) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x._id === p._id);
      const base = {
        _id: p._id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.thumbnail || p.images?.[0],
        qty
      };
      if (idx === -1) return [...prev, base];
      const clone = [...prev];
      clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
      return clone;
    });

    if (options.goCheckout) {
      window.location.href = "/checkout";
    }
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return;
    setCart((prev) => prev.map((x) => (x._id === id ? { ...x, qty } : x)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => x._id !== id));
  };

  const clearCart = () => setCart([]);

  const itemsPrice = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shippingPrice = cart.length ? 30000 : 0;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        addToCart: addItem,
        updateQty,
        removeFromCart,
        clearCart,
        itemsPrice,
        shippingPrice,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

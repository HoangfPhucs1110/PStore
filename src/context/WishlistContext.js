import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/api";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);

  // 1. Load wishlist khi khởi động
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const res = await api.get("/wishlists");
          setWishlistIds(res.data.productIds || []);
        } catch (err) {}
      } else {
        const local = JSON.parse(localStorage.getItem("pstore_wishlist_local") || "[]");
        setWishlistIds(local);
      }
    };
    loadWishlist();
  }, [user]);

  // 2. Hàm Toggle
  const toggleWishlist = async (productId) => {
    const isExist = wishlistIds.includes(productId);
    let newList = [];

    if (isExist) {
        newList = wishlistIds.filter(id => id !== productId);
    } else {
        newList = [...wishlistIds, productId];
    }

    // Cập nhật State ngay
    setWishlistIds(newList);

    if (user) {
        try { await api.post("/wishlists/toggle", { productId }); } catch (err) {}
    } else {
        localStorage.setItem("pstore_wishlist_local", JSON.stringify(newList));
    }
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
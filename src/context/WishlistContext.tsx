import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

interface WishlistContextProps {
  wishlistItems: string[];
  refetchWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextProps>({
  wishlistItems: [],
  refetchWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const token = localStorage.getItem("token");
  const validToken = token && token.trim() !== "" && token !== "undefined";

  const refetchWishlist = async () => {
    if (!validToken) {
      setWishlistItems([]);
      return;
    }
    try {
      const res = await api.get<{ products: { _id: string }[] }>("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data.products.map((p) => p._id));
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
      } else {
        console.error("Error fetching wishlist:", err.message);
        toast.error("Error fetching wishlist: " + err.message);
      }
    }
  };

  useEffect(() => {
    refetchWishlist();
  }, [token, validToken]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, refetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

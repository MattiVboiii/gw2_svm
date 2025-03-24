import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api";

interface GlobalCountsContextProps {
  cartCount: number;
  wishlistCount: number;
  refreshCounts: () => Promise<void>;
}

const GlobalCountsContext = createContext<GlobalCountsContextProps>({
  cartCount: 0,
  wishlistCount: 0,
  refreshCounts: async () => {},
});

export const useGlobalCounts = () => useContext(GlobalCountsContext);

export const GlobalCountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          api.get("/cart", {
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
          api.get("/wishlist", {
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
        ]);
        const totalCart = (
          cartRes.data as { items: { quantity: number }[] }
        ).items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(totalCart);
        setWishlistCount(
          (wishlistRes.data as { products: any[] }).products.length
        );
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    } else {
      // Read guest data directly from localStorage every time
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const guestWishlist = JSON.parse(
        localStorage.getItem("guestWishlist") || "[]"
      );
      setCartCount(
        guestCart.reduce((acc: number, item: any) => acc + item.quantity, 0)
      );
      setWishlistCount(guestWishlist.length);
    }
  }, []);

  useEffect(() => {
    refreshCounts();

    const updateCounts = () => {
      refreshCounts();
    };

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, [refreshCounts]);

  return (
    <GlobalCountsContext.Provider
      value={{
        cartCount,
        wishlistCount,
        refreshCounts,
      }}
    >
      {children}
    </GlobalCountsContext.Provider>
  );
};

export default GlobalCountsContext;

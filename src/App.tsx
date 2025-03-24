import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "/src/styles/global/toastOverride.module.css";
import Footer from "./components/global/Footer";
import Navbar from "./components/global/Navbar";
import Homepage from "./pages/Homepage";
import AllProducts from "./pages/AllProducts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Routes, Route } from "react-router";
import "/src/styles/main.css";
import { WishlistProvider } from "./context/WishlistContext";

const App = () => {
  return (
    <WishlistProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/allproducts" element={<AllProducts />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </WishlistProvider>
  );
};
export default App;

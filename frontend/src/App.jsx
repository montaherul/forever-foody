import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "./context/ShopContext";

const App = () => {
  const { theme } = useContext(ShopContext);
  return (
    /* Mobile-first responsive container: 4% padding on mobile, scaling up to 9vw on desktop */
    <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

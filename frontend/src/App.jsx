import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "./context/ShopContext";

const App = () => {
  const { theme } = useContext(ShopContext);
  return (
    /* Mobile-first responsive container: 4% padding on mobile, scaling up to 9vw on desktop */
    <div className="min-h-screen w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors overflow-x-hidden">
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;

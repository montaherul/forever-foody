import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { AdminContext } from "./config/adminConfig";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // 🔒 Auth layout (no sidebar/navbar)
  if (!token) {
    return (
      <AdminContext.Provider value={{ token, setToken }}>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ToastContainer position="top-right" autoClose={3000} theme="light" />
          <Login setToken={setToken} />
        </div>
      </AdminContext.Provider>
    );
  }

  // 🧠 Admin layout
  return (
    <AdminContext.Provider value={{ token, setToken }}>
      <div className="h-screen flex bg-gray-100 overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 shrink-0 border-b bg-white">
            <NavBar setToken={setToken} />
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
};

export default App;

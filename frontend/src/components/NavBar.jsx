import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import MiniCartDrawer from "./MiniCartDrawer";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const {
    search,
    setSearch,
    setShowSearch,
    getCartCount,
    navigate,
    token,
    user,
    logout,
    toggleCartDrawer,
    theme,
    toggleTheme,
  } = useContext(ShopContext);
  const openCartDrawer = () => {
    setVisible(false);
    toggleCartDrawer(true);
  };
  return (
    <>
      <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-6 lg:px-8 font-medium sticky top-0 bg-white dark:bg-slate-900 dark:text-slate-100 z-40 shadow-md dark:shadow-slate-900/60 border-b border-green-100 dark:border-slate-800 transition-colors">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <img
            src={assets.logo}
            className="w-20 xs:w-24 sm:w-28 md:w-32 lg:w-36"
            alt="Forever Foody Logo"
          />
          <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-poppins font-bold text-green-600 hidden xs:block">
            Foody
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden lg:flex gap-4 xl:gap-8 text-sm font-semibold text-gray-700 dark:text-slate-200">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-green-600 transition-colors pb-1 ${
                  isActive ? "text-green-600" : ""
                }`
              }
            >
              <p>HOME</p>
              <hr className="w-2/4 border-none h-1.5 bg-green-600 rounded-full" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-green-600 transition-colors pb-1 ${
                  isActive ? "text-green-600" : ""
                }`
              }
            >
              <p>PRODUCTS</p>
              <hr className="w-2/4 border-none h-1.5 bg-green-600 rounded-full" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-green-600 transition-colors pb-1 ${
                  isActive ? "text-green-600" : ""
                }`
              }
            >
              <p>ABOUT</p>
              <hr className="w-2/4 border-none h-1.5 bg-green-600 rounded-full" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-green-600 transition-colors pb-1 ${
                  isActive ? "text-green-600" : ""
                }`
              }
            >
              <p>CONTACT</p>
              <hr className="w-2/4 border-none h-1.5 bg-green-600 rounded-full" />
            </NavLink>
          </li>
          {token && (
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 hover:text-green-600 transition-colors pb-1 ${
                    isActive ? "text-green-600" : ""
                  }`
                }
              >
                <p>DASHBOARD</p>
                <hr className="w-2/4 border-none h-1.5 bg-green-600 rounded-full" />
              </NavLink>
            </li>
          )}
        </ul>

        {/* Search bar (desktop) */}
        <div className="hidden lg:block flex-1 max-w-xl px-4 xl:px-6">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-3 xl:px-4 py-1.5 xl:py-2 hover:border-green-300 dark:hover:border-green-400 transition-colors">
            <img
              src={assets.search_icon}
              className="w-4 xl:w-5 flex-shrink-0"
              alt="Search"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                setShowSearch(true);
                navigate("/collection");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  setShowSearch(true);
                  navigate("/collection");
                }
              }}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Search products, categories..."
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                title="Clear search"
              >
                ×
              </button>
            )}
            <button
              onClick={() => {
                if (search.trim()) {
                  setShowSearch(true);
                  navigate("/collection");
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-xs xl:text-sm font-semibold px-3 xl:px-4 py-1.5 xl:py-2 rounded-full transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Side: Search (mobile), Profile, Cart, Login/Logout */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
          {/* Search Icon */}
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-4 xs:w-5 cursor-pointer hover:scale-110 transition-transform lg:hidden"
            alt="Search"
            title="Search Products"
          />

          {/* Profile Dropdown or Login Button */}
          {token ? (
            <div className="group relative">
              <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer hover:scale-110 transition-transform border-2 border-green-600 overflow-hidden flex items-center justify-center bg-green-100">
                {user?.profileImage ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.profileImage}
                    alt="Profile"
                    title="My Account"
                  />
                ) : (
                  <span className="text-green-600 font-bold text-xs xs:text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="hidden group-hover:block absolute right-0 pt-4 z-50">
                <div className="flex flex-col gap-2 w-44 sm:w-48 py-3 px-4 sm:px-5 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-green-100 dark:border-slate-700 transition-colors">
                  <Link
                    to="/profile"
                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400 font-medium text-sm text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-700 px-2 py-1.5 rounded transition-colors flex items-center gap-2"
                  >
                    My Profile
                  </Link>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400 font-medium text-sm text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-700 px-2 py-1.5 rounded transition-colors flex items-center gap-2"
                  >
                    My Orders
                  </p>
                  <hr className="border-gray-200" />
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-red-600 font-medium text-sm text-gray-700 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-slate-700 px-2 py-1.5 rounded transition-colors flex items-center gap-2"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-button font-semibold text-xs sm:text-sm transition-colors shadow-md"
            >
              Login
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xl hover:scale-110 transition-all"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={openCartDrawer}
            className="relative hover:scale-110 transition-transform"
            title="Shopping Cart"
          >
            <img
              src={assets.cart_icon}
              className="w-4 xs:w-5 min-w-[16px] xs:min-w-5"
              alt="Cart"
            />
            {getCartCount() > 0 && (
              <p className="absolute right-[-6px] xs:right-[-8px] bottom-[-6px] xs:bottom-[-8px] w-4 h-4 xs:w-5 xs:h-5 text-center leading-4 xs:leading-5 bg-orange-500 text-white rounded-full text-[8px] xs:text-[10px] font-bold">
                {getCartCount()}
              </p>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-4 xs:w-5 cursor-pointer lg:hidden hover:scale-110 transition-transform"
            alt="Menu"
          />
        </div>

        {/* End main bar */}
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white dark:bg-slate-900 dark:text-slate-100 transition-all duration-300 z-50 shadow-2xl ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="Back"
            />
            <p className="font-semibold text-lg">Menu</p>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex flex-col flex-1 overflow-y-auto">
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-6 border-b border-gray-100 dark:border-slate-800 font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-slate-800 text-green-600 border-l-4 border-l-green-600"
                    : "text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-800"
                }`
              }
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-6 border-b border-gray-100 dark:border-slate-800 font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-slate-800 text-green-600 border-l-4 border-l-green-600"
                    : "text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-800"
                }`
              }
              to="/collection"
            >
              PRODUCTS
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-6 border-b border-gray-100 dark:border-slate-800 font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-slate-800 text-green-600 border-l-4 border-l-green-600"
                    : "text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-800"
                }`
              }
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-6 border-b border-gray-100 dark:border-slate-800 font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-slate-800 text-green-600 border-l-4 border-l-green-600"
                    : "text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-800"
                }`
              }
              to="/contact"
            >
              CONTACT
            </NavLink>
            {token && (
              <NavLink
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-4 pl-6 border-b border-gray-100 dark:border-slate-800 font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 dark:bg-slate-800 text-green-600 border-l-4 border-l-green-600"
                      : "text-gray-700 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-800"
                  }`
                }
                to="/orders"
              >
                DASHBOARD
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Footer - Login/Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-800">
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setVisible(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-button font-semibold transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setVisible(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-button font-semibold transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
      <MiniCartDrawer />
    </>
  );
};

export default NavBar;

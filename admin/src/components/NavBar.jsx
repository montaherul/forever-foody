import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import { FiSearch, FiBell, FiLogOut, FiUser } from "react-icons/fi";

const NavBar = ({ setToken }) => {
  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-6 bg-white border-b shadow-sm">
      {/* Left: Brand + Search */}
      <div className="flex items-center justify-center gap-6">
        <p className="font-bold text-center">
          Admin Panel
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Admin profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition">
          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => setToken("")}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
        >
          <FiLogOut />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default NavBar;

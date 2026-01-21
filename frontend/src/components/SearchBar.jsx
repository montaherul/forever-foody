import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onCollection = location.pathname.includes("collection");
    setVisible(onCollection && showSearch);
  }, [location.pathname, showSearch]);

  return showSearch && visible ? (
    <div className="border-t border-b dark:border-slate-800 bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 text-center py-6 shadow-sm">
      <div className="inline-flex items-center justify-center border-2 border-green-400 dark:border-green-600 px-6 py-3 my-2 mx-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md">
        <img
          className="w-5 h-5 mr-3 opacity-60"
          src={assets.search_icon}
          alt="Search"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm placeholder-gray-400 dark:placeholder-slate-500 text-gray-700 dark:text-slate-100"
          type="text"
          placeholder="Search for fresh groceries..."
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="ml-2 text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={() => setShowSearch(false)}
        className="inline-flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
      >
        <img className="w-3 h-3" src={assets.cross_icon} alt="Close" />
        Close Search
      </button>
    </div>
  ) : null;
};

export default SearchBar;

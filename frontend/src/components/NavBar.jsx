import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import MiniCartDrawer from "./MiniCartDrawer";

/**
 * Keeps the same design as your demo HTML:
 * - fixed top navbar
 * - fixed sub-navbar under it
 * - dropdowns
 * - fontawesome <i> icons
 */

const NavBar = () => {
  const nav = useNavigate();
  const navigate = useNavigate();
  const {
    products,
    search,
    setSearch,
    setShowSearch,
    getCartCount,
    toggleCartDrawer,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    language,
    setLanguage,
    token,
  } = useContext(ShopContext);

  // --- UI toggles
  const [langCurOpen, setLangCurOpen] = useState(false);
  const [allCatOpen, setAllCatOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  // subnav hide on scroll down
  const [subHidden, setSubHidden] = useState(false);

  // refs for outside click
  const langCurRef = useRef(null);
  const allCatRef = useRef(null);
  const featuredRef = useRef(null);
  const moreRef = useRef(null);
  const searchRef = useRef(null);

  // --- Minimal EN/BN labels for navbar/subnavbar only
  const t = useMemo(() => {
    const dict = {
      EN: {
        searchPlaceholder: "Search ForEver",
        allCategories: "All categories",
        featuredSelections: "Featured selections",
        topRanking: "Top ranking",
        newArrivals: "New arrivals",
        topDeals: "Top deals",
        signInUp: "Sign in / Sign up",
        becomeSupplier: "Become a supplier",
        orderTrack: "Order track",
        helpCenter: "Help center",
        language: "Language",
        currency: "Currency",
        suggestions: "Suggestions",
      },
      BN: {
        searchPlaceholder: "ForEver সার্চ করুন",
        allCategories: "সব ক্যাটাগরি",
        featuredSelections: "ফিচার্ড সিলেকশন",
        topRanking: "টপ র‍্যাঙ্কিং",
        newArrivals: "নতুন এসেছে",
        topDeals: "টপ ডিল",
        signInUp: "সাইন ইন / সাইন আপ",
        becomeSupplier: "সাপ্লায়ার হন",
        orderTrack: "অর্ডার ট্র্যাক",
        helpCenter: "হেল্প সেন্টার",
        language: "ভাষা",
        currency: "কারেন্সি",
        suggestions: "সাজেশন",
      },
    };
    return dict[language] || dict.EN;
  }, [language]);

  // --- Suggestions from real products list
  const suggestions = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return [];
    return (products || [])
      .filter((p) => (p?.name || "").toLowerCase().includes(q))
      .slice(0, 7);
  }, [products, search]);

  // --- Categories from products (category + subCategory)
  const categoryTree = useMemo(() => {
    const tree = new Map(); // category => Set(subCategory)
    (products || []).forEach((p) => {
      const c = (p?.category || "").trim();
      const s = (p?.subCategory || "").trim();
      if (!c) return;
      if (!tree.has(c)) tree.set(c, new Set());
      if (s) tree.get(c).add(s);
    });

    // convert to array for rendering
    const out = Array.from(tree.entries()).map(([cat, subs]) => ({
      cat,
      subs: Array.from(subs.values()),
    }));

    // sort for nicer UX
    out.sort((a, b) => a.cat.localeCompare(b.cat));
    out.forEach((x) => x.subs.sort((a, b) => a.localeCompare(b)));

    return out;
  }, [products]);

  // --- Close dropdowns on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      const tnode = e.target;

      const inside = (ref) => ref.current && ref.current.contains(tnode);

      if (!inside(langCurRef)) setLangCurOpen(false);
      if (!inside(allCatRef)) setAllCatOpen(false);
      if (!inside(featuredRef)) setFeaturedOpen(false);
      if (!inside(moreRef)) setMoreOpen(false);
      if (!inside(searchRef)) setSuggestOpen(false);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // --- Subnav hide on scroll down (same feel as demo)
  useEffect(() => {
    let lastY = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;

      if (goingDown && y > 120) setSubHidden(true);
      if (goingUp) setSubHidden(false);

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- helpers
  const goHome = () => nav("/");
  const goCollection = () => {
    setShowSearch(true);
    nav("/collection");
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSuggestOpen(false);
    goCollection();
  };

  // selecting category/feature will navigate to collection and set search as a filter hint
  // (No backend changes; uses existing search filtering logic.)
  const selectFilter = (text) => {
    // Handle featured selections as sort types
    if (["Top ranking", "New arrivals", "Top deals"].includes(text)) {
      setSearch("");
      setShowSearch(false);
      // Will be handled as sortType in Collection
    } else {
      setSearch(text);
      setShowSearch(true);
    }
    setAllCatOpen(false);
    setFeaturedOpen(false);
    nav("/collection", { state: { selectedSort: text } });
  };

  // currency mapping (your app usually uses symbols; we keep it safe)
  const setCur = (code) => {
    // If your app expects symbols, map here:
    const mapped =
      code === "USD" ? "$" : code === "BDT" ? "৳" : code === "CNY" ? "¥" : code;
    setCurrency(mapped);
    setLangCurOpen(false);
  };

  const setLang = (code) => {
    // your previous pattern: "EN" / "BN"
    setLanguage(code);
    setLangCurOpen(false);
  };

  const openCart = () => toggleCartDrawer(true);

  return (
    <>
      {/* MAIN NAVBAR (fixed) — improved UI/UX */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-md dark:bg-gray-950/95 shadow-sm">
        <nav className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4 h-16">
            {/* Logo + brand (ForEver) */}
            <button
              onClick={goHome}
              className="flex items-center gap-2 group text-left transition-transform hover:scale-105 active:scale-95"
              type="button"
              title="Back to home"
            >
              <img
                src={assets.logo}
                alt="ForEver"
                className="
                  h-16 sm:h-20 md:h-24 lg:h-28
                  w-auto object-contain
                  dark:brightness-125 dark:contrast-125
                "
              />
            </button>

            {/* Search Option */}
            <div
              className="hidden sm:flex flex-1 max-w-2xl mx-3"
              ref={searchRef}
            >
              <form
                id="globalSearchForm"
                className="relative w-full"
                onSubmit={onSubmitSearch}
              >
                <input
                  id="globalSearchInput"
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => setSuggestOpen(true)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-700 pl-5 pr-14 py-2.5 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-sm hover:shadow-md dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-sm"
                  title="Search"
                >
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </button>

                {/* Suggestions dropdown (enhanced) */}
                {suggestOpen && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-3 rounded-2xl shadow-2xl ring-1 ring-black/10 bg-white dark:bg-gray-900 backdrop-blur-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                      <i className="fa-solid fa-wand-magic-sparkles text-emerald-500"></i>
                      {t.suggestions}
                    </div>

                    <div className="max-h-64 overflow-auto">
                      {suggestions.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            setSuggestOpen(false);
                            nav(`/product/${p._id}`);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                            {p.category} {p.subCategory && `• ${p.subCategory}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right controls */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/* Theme toggle (enhanced) */}
              <button
                id="themeToggle"
                aria-label="Toggle Theme"
                className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95"
                onClick={toggleTheme}
                type="button"
                title="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>

              {/* Language & Currency */}
              <div className="relative" ref={langCurRef}>
                <button
                  id="langCurBtn"
                  className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95"
                  title="Language & Currency"
                  type="button"
                  onClick={() => setLangCurOpen((v) => !v)}
                >
                  <i className="fa-solid fa-language text-blue-600"></i>
                </button>

                <div
                  id="langCurMenu"
                  className={[
                    "absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl ring-1 ring-black/10",
                    "bg-white dark:bg-gray-900 backdrop-blur-xl p-4 space-y-3 z-50",
                    langCurOpen
                      ? "animate-in fade-in slide-in-from-top-2 duration-200"
                      : "hidden",
                  ].join(" ")}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      <i className="fa-solid fa-language text-blue-600"></i>
                      {t.language}
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                      ForEver
                    </span>
                  </div>

                  {/* Languages */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLang("EN")}
                      className={`px-4 py-2.5 rounded-lg border transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                        language === "EN"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <i className="fa-regular fa-circle-check"></i>
                      English
                    </button>

                    <button
                      type="button"
                      onClick={() => setLang("BN")}
                      className={`px-4 py-2.5 rounded-lg border transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                        language === "BN"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <i className="fa-regular fa-circle-check"></i>
                      বাংলা
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

                  {/* Currency header */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <i className="fa-solid fa-coins text-amber-500"></i>
                    {t.currency}
                    <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">
                      ({currency})
                    </span>
                  </div>

                  {/* Currencies */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCur("USD")}
                      className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center justify-center gap-1.5 ${
                        currency === "$"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <i className="fa-solid fa-dollar-sign text-xs"></i> USD
                    </button>

                    <button
                      type="button"
                      onClick={() => setCur("CNY")}
                      className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center justify-center gap-1.5 ${
                        currency === "¥"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <i className="fa-solid fa-yen-sign text-xs"></i> CNY
                    </button>

                    <button
                      type="button"
                      onClick={() => setCur("BDT")}
                      className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center justify-center gap-1.5 ${
                        currency === "৳"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <i className="fa-solid fa-bangladeshi-taka-sign text-xs"></i>{" "}
                      BDT
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full border border-gray-300 dark:border-gray-700 transition-all hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
                title="Shopping cart"
                type="button"
              >
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-lg min-w-6 text-center animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* SUB-NAVBAR (fixed under) */}
      <div
        id="subNav"
        className={[
          "fixed top-16 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-transform duration-300 will-change-transform",
          subHidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {/* All Categories */}
            <div className="relative" ref={allCatRef}>
              <button
                id="allCatBtn"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700 font-semibold text-sm transition-all hover:border-emerald-400 dark:hover:border-emerald-500 flex items-center gap-2 shadow-sm hover:shadow-md"
                type="button"
                onClick={() => setAllCatOpen((v) => !v)}
              >
                <i className="fa-solid fa-list text-emerald-600 dark:text-emerald-400"></i>
                <span className="hidden sm:inline">{t.allCategories}</span>
                <span className="sm:hidden">Categories</span>
              </button>

              <div
                id="allCatMenu"
                className={[
                  "absolute left-0 mt-2 w-[24rem] max-h-[75vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-4 z-50",
                  allCatOpen
                    ? "animate-in fade-in slide-in-from-top-2 duration-200"
                    : "hidden",
                ].join(" ")}
              >
                {categoryTree.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <i className="fa-solid fa-inbox text-3xl mb-3 opacity-50"></i>
                    <p className="text-sm">No categories found.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoryTree.map((c, idx) => (
                      <div key={c.cat}>
                        <button
                          type="button"
                          onClick={() => selectFilter(c.cat)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-emerald-300 dark:hover:border-emerald-700"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform">
                            {String.fromCharCode(65 + (idx % 26))}
                          </div>
                          <span className="text-gray-900 dark:text-white text-sm">
                            {c.cat}
                          </span>
                          <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-semibold">
                            {c.subs.length + 1}
                          </span>
                        </button>

                        {c.subs.length > 0 && (
                          <div className="mt-1 pl-6 pb-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
                            {c.subs.map((s) => (
                              <button
                                key={`${c.cat}-${s}`}
                                type="button"
                                onClick={() => selectFilter(s)}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                              >
                                <i className="fa-solid fa-tag text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                <span className="group-hover:font-medium">
                                  {s}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Featured selections */}
            <div className="relative" ref={featuredRef}>
              <button
                id="featuredBtn"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700 font-semibold text-sm transition-all hover:border-amber-400 dark:hover:border-amber-500 flex items-center gap-2 shadow-sm hover:shadow-md"
                type="button"
                onClick={() => setFeaturedOpen((v) => !v)}
              >
                <i className="fa-solid fa-star text-amber-500"></i>
                <span className="hidden sm:inline">{t.featuredSelections}</span>
                <span className="sm:hidden">Featured</span>
                <i className="fa-solid fa-caret-down ms-1 text-xs"></i>
              </button>

              <div
                id="featuredMenu"
                className={[
                  "absolute left-0 mt-2 w-72 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-3 z-50",
                  featuredOpen
                    ? "animate-in fade-in slide-in-from-top-2 duration-200"
                    : "hidden",
                ].join(" ")}
              >
                <div className="space-y-2">
                  <button
                    data-feature="top-ranking"
                    type="button"
                    onClick={() => selectFilter("Top ranking")}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-amber-300 dark:hover:border-amber-700"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-ranking-star text-lg"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {t.topRanking}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Most popular items
                      </div>
                    </div>
                  </button>

                  <button
                    data-feature="new-arrivals"
                    type="button"
                    onClick={() => selectFilter("New arrivals")}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-green-300 dark:hover:border-green-700"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <i className="fa-regular fa-square-plus text-lg"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {t.newArrivals}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Latest in stock
                      </div>
                    </div>
                  </button>

                  <button
                    data-feature="top-deals"
                    type="button"
                    onClick={() => selectFilter("Top deals")}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-rose-300 dark:hover:border-rose-700"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-tags text-lg"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {t.topDeals}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Best discounts
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More menu */}
          <div className="relative" ref={moreRef}>
            <button
              id="moreBtn"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-all hover:border-emerald-400 dark:hover:border-emerald-600"
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <div
              id="moreMenu"
              className={[
                "absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-2 z-50",
                moreOpen
                  ? "animate-in fade-in slide-in-from-top-2 duration-200"
                  : "hidden",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  nav(token ? "/profile" : "/login");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800/50 transition-colors text-gray-700 dark:text-gray-300 text-left"
              >
                <i className="fa-regular fa-user text-blue-600"></i>
                <span className="text-sm font-medium">
                  {token ? "My Account" : "Sign in / Sign up"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  nav("/contact");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800/50 transition-colors text-gray-700 dark:text-gray-300 text-left"
              >
                <i className="fa-solid fa-briefcase text-purple-600"></i>
                <span className="text-sm font-medium">{t.becomeSupplier}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  nav("/orders");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800/50 transition-colors text-gray-700 dark:text-gray-300 text-left"
              >
                <i className="fa-solid fa-truck text-orange-600"></i>
                <span className="text-sm font-medium">{t.orderTrack}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  nav("/contact");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800/50 transition-colors text-gray-700 dark:text-gray-300 text-left"
              >
                <i className="fa-regular fa-circle-question text-green-600"></i>
                <span className="text-sm font-medium">{t.helpCenter}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacers (same as demo) */}
      <div className="h-16"></div>
      <div className="h-12"></div>

      <MiniCartDrawer />
    </>
  );
};

export default NavBar;

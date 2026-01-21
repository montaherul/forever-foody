import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  // CLEAN START: Removing all duplicates and restarting fresh

  // ============================================
  // CORE SETUP
  // ============================================
  // ---------------- Currency / Language ----------------
  const getInitialCurrency = () => {
    if (typeof window === "undefined") return "$";
    return localStorage.getItem("currency") || "$";
  };

  const getInitialLanguage = () => {
    if (typeof window === "undefined") return "EN";
    return localStorage.getItem("language") || "EN";
  };

  const [currency, setCurrency] = useState(getInitialCurrency);
  const [language, setLanguage] = useState(getInitialLanguage);

  // persist currency + language
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // ---------------- Currency formatting / conversion ----------------
  // Basic fixed exchange rates (assumes product prices are stored in USD)
  const exchangeRates = {
    $: 1, // USD
    "৳": 105, // BDT (example rate)
    "¥": 7.2, // CNY (example rate)
  };

  const formatCurrency = (amount) => {
    const n = Number(amount) || 0;
    const rate = exchangeRates[currency] ?? 1;
    const converted = n * rate;
    // keep two decimals
    return `${currency} ${converted.toFixed(2)}`;
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // ---------------- Basic Config ----------------
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ---------------- Theme (FIXED) ----------------
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);

    console.log("THEME:", theme, "HTML CLASS:", root.className); // ✅ debug
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // ---------------- App States ----------------
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const removeFromCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/remove",
            { itemId, size },
            { headers: { token } },
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
  }

  const navigate = useNavigate();

  // ---------------- Logout ----------------
  const logout = async () => {
    try {
      await signOut(auth);
      setToken("");
      setUser(null);
      setCartItems({});
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  // ---------------- Pricing normalize ----------------
  const normalizePricing = (product) => {
    if (!product) return product;

    if (product.sizePricing) return product;

    if (product.pricingId && product.pricingId.sizes) {
      const sizePricing = {};
      product.pricingId.sizes.forEach((sizeObj) => {
        sizePricing[sizeObj.size] = sizeObj.price;
      });
      return { ...product, sizePricing };
    }

    if (product.sizes && product.sizes.length > 0 && !product.pricingId) {
      const sizePricing = {};
      product.sizes.forEach((size) => {
        sizePricing[size] = product.price;
      });
      return { ...product, sizePricing };
    }

    return product;
  };

  // ---------------- Cart ----------------
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const product = normalizePricing(products.find((p) => p._id === itemId));
    if (product) {
      if (product.inStock === false || (product.stockQuantity ?? 0) <= 0) {
        toast.error("This product is out of stock");
        return;
      }
      if (
        product.sizeStock &&
        product.sizeStock[size] !== undefined &&
        Number(product.sizeStock[size]) <= 0
      ) {
        toast.error("Selected size is out of stock");
        return;
      }
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) totalCount += cartItems[items][item];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const calculateCartSubtotal = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      itemInfo = normalizePricing(itemInfo);

      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const discount = Number(itemInfo?.discount || 0);
          const sizePrice = itemInfo?.sizePricing?.[item];
          const unitPrice = sizePrice || Number(itemInfo?.price || 0);
          const effectivePrice =
            discount > 0 ? unitPrice * (1 - discount / 100) : unitPrice;

          totalAmount += effectivePrice * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  const getCartAmount = () => calculateCartSubtotal();

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- Coupon ----------------
  const applyCoupon = async (code) => {
    const trimmed = (code || "").trim();
    if (!trimmed) {
      setCouponMessage("Enter a coupon code");
      setAppliedCoupon(null);
      return { success: false };
    }

    try {
      const subtotal = calculateCartSubtotal();
      const response = await axios.post(`${backendUrl}/api/coupon/validate`, {
        code: trimmed,
        subtotal,
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        setCouponMessage("Coupon applied");
        return { success: true };
      }

      setAppliedCoupon(null);
      setCouponMessage(response.data.message || "Invalid coupon");
      return { success: false };
    } catch (error) {
      console.log(error);
      setAppliedCoupon(null);
      setCouponMessage("Failed to apply coupon");
      return { success: false };
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage("");
  };

  // ---------------- Drawer ----------------
  const toggleCartDrawer = (next) => {
    setCartDrawerOpen((prev) => (typeof next === "boolean" ? next : !prev));
  };

  // ---------------- Products ----------------
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      const data = response.data;

      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products.map(normalizePricing));
        return;
      }

      if (Array.isArray(data.products)) {
        setProducts(data.products.map(normalizePricing));
        return;
      }

      if (Array.isArray(data)) {
        setProducts(data.map(normalizePricing));
        return;
      }

      console.error("Unexpected product API response:", data);
      toast.error("Invalid product data from server");
    } catch (error) {
      console.log("Product fetch error:", error);
      toast.error("Failed to load products");
    }
  };

  // ---------------- Wishlist / Compare ----------------
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/wishlist/list`,
        {},
        { headers: { token } },
      );
      if (res.data.success) setWishlist(res.data.wishlist || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompare = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/compare/list`,
        {},
        { headers: { token } },
      );
      if (res.data.success) setCompareList(res.data.compareList || []);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error("Login to manage wishlist");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/wishlist/toggle`,
        { productId },
        { headers: { token } },
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
        toast.success(
          res.data.action === "added"
            ? "Added to wishlist"
            : "Removed from wishlist",
        );
      } else toast.error(res.data.message || "Wishlist update failed");
    } catch (error) {
      console.log(error);
      toast.error("Wishlist update failed");
    }
  };

  const toggleCompare = async (productId) => {
    if (!token) {
      toast.error("Login to manage compare list");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/compare/toggle`,
        { productId },
        { headers: { token } },
      );
      if (res.data.success) {
        setCompareList(res.data.compareList || []);
        toast.success(
          res.data.action === "added"
            ? "Added to compare"
            : "Removed from compare",
        );
      } else toast.error(res.data.message || "Compare update failed");
    } catch (error) {
      console.log(error);
      toast.error("Compare update failed");
    }
  };

  // ---------------- User Profile ----------------
  const getUserProfile = async (token, retries = 0) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        if (retries < 1)
          setTimeout(() => getUserProfile(token, retries + 1), 500);
      }
    } catch (error) {
      console.log("Profile fetch error:", error);
      if (retries < 1)
        setTimeout(() => getUserProfile(token, retries + 1), 500);
    }
  };

  // ---------------- Init ----------------
  useEffect(() => {
    getProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart(token);
      getUserProfile(token);
      fetchWishlist();
      fetchCompare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ---------------- Context Value ----------------
  const value = {
    products,
    currency,
    setCurrency,
    language,
    setLanguage,

    delivery_fee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    calculateCartSubtotal,
    getCartAmount,

    backendUrl,
    token,
    setToken,
    authChecked,

    user,
    setUser,
    logout,

    appliedCoupon,
    couponMessage,
    applyCoupon,
    clearCoupon,

    wishlist,
    compareList,
    toggleWishlist,
    toggleCompare,

    normalizePricing,

    cartDrawerOpen,
    toggleCartDrawer,

    formatCurrency,

    theme,
    toggleTheme,

    navigate,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

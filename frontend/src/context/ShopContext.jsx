import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl);
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

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
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();

  // Logout function with Firebase
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

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // Basic stock check to prevent adding sold-out items
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
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        console.log(token);
        console.log(itemId);
        console.log(size);
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
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
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
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
          { headers: { token } }
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
      // Normalize product pricing data
      itemInfo = normalizePricing(itemInfo);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            const discount = Number(itemInfo?.discount || 0);
            // NEW: Use size-specific pricing if available
            const sizePrice = itemInfo?.sizePricing?.[item];
            const unitPrice = sizePrice || Number(itemInfo?.price || 0);
            const effectivePrice =
              discount > 0 ? unitPrice * (1 - discount / 100) : unitPrice;
            totalAmount += effectivePrice * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getCartAmount = () => calculateCartSubtotal();

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

  const toggleCartDrawer = (next) => {
    setCartDrawerOpen((prev) => (typeof next === "boolean" ? next : !prev));
  };

  // Convert pricingId structure to sizePricing for backward compatibility
  const normalizePricing = (product) => {
    if (!product) return product;

    // If product already has sizePricing (old format), return as is
    if (product.sizePricing) {
      return product;
    }

    // If product has pricingId (new format), convert to sizePricing
    if (product.pricingId && product.pricingId.sizes) {
      const sizePricing = {};
      product.pricingId.sizes.forEach((sizeObj) => {
        sizePricing[sizeObj.size] = sizeObj.price;
      });
      return {
        ...product,
        sizePricing,
      };
    }

    // NEW: If product has sizes but no pricing, use base price for all sizes
    if (product.sizes && product.sizes.length > 0 && !product.pricingId) {
      const sizePricing = {};
      product.sizes.forEach((size) => {
        // Use the base price for each size variant
        sizePricing[size] = product.price;
      });
      return {
        ...product,
        sizePricing,
      };
    }

    // Fallback: no pricing data
    return product;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        // Normalize products to ensure sizePricing is available
        const normalizedProducts = response.data.products.map(normalizePricing);
        setProducts(normalizedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/wishlist/list`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      }
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
        { headers: { token } }
      );
      if (res.data.success) {
        setCompareList(res.data.compareList || []);
      }
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
        { headers: { token } }
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
        toast.success(
          res.data.action === "added"
            ? "Added to wishlist"
            : "Removed from wishlist"
        );
      } else {
        toast.error(res.data.message || "Wishlist update failed");
      }
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
        { headers: { token } }
      );
      if (res.data.success) {
        setCompareList(res.data.compareList || []);
        toast.success(
          res.data.action === "added"
            ? "Added to compare"
            : "Removed from compare"
        );
      } else {
        toast.error(res.data.message || "Compare update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Compare update failed");
    }
  };

  const getUserProfile = async (token, retries = 0) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setUser(response.data.user);
        console.log("✅ User profile loaded:", response.data.user);
      } else {
        console.log("❌ Profile error:", response.data.message);
        // Retry once if failed
        if (retries < 1) {
          setTimeout(() => getUserProfile(token, retries + 1), 500);
        }
      }
    } catch (error) {
      console.log("❌ Profile fetch error:", error);
      // Retry once if failed
      if (retries < 1) {
        setTimeout(() => getUserProfile(token, retries + 1), 500);
      }
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch cart and profile when token changes
  useEffect(() => {
    if (token) {
      getUserCart(token);
      getUserProfile(token);
      fetchWishlist();
      fetchCompare();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    calculateCartSubtotal,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    authChecked,
    setProducts,
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
    theme,
    toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;

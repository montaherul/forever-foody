import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-14 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-4">Get to Know Us</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="footer-link">
                  About Foody
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop With Us</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/collection" className="footer-link">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">
                  Your Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="footer-link">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="footer-link">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
            <ul className="space-y-2">
              <li className="footer-item">Credit / Debit Cards</li>
              <li className="footer-item">UPI Payments</li>
              <li className="footer-item">Net Banking</li>
              <li className="footer-item">Cash on Delivery</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="footer-link">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="footer-link">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="footer-link">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="footer-link">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* MIDDLE BAR */}
        <div className="border-t border-gray-700 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={assets.logo} alt="Foody" className="w-40" />
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            {/* Language */}
            <div className="footer-pill">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 21l5.25-11.25L21 21M3 21h7.5M12 3v3m6.364 9.364l-2.121-2.121M6.343 6.343L4.222 4.222M21 12h-3M6 12H3"
                />
              </svg>
              English
            </div>

            {/* Currency */}
            <div className="footer-pill">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-9h6m-7 6h8"
                />
              </svg>
              USD
            </div>

            {/* Location */}
            <div className="footer-pill">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7.5-7.125 7.5-12A7.5 7.5 0 104.5 9c0 4.875 7.5 12 7.5 12z"
                />
              </svg>
              United States
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 py-4 text-xs text-gray-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© 2026 forever.com, Inc. or its affiliates</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:underline">
              Conditions of Use
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy Notice
            </Link>
            <Link to="/ads" className="hover:underline">
              Interest-Based Ads
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700 dark:text-slate-300 bg-green-50 dark:bg-slate-800/50 rounded-2xl my-10">
      <div className="group hover:scale-105 transition-transform">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center m-auto mb-5 group-hover:bg-green-700 transition-colors">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </div>
        <p className="font-bold text-green-900 dark:text-green-400 text-lg">
          Same Day Delivery
        </p>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Order before 2 PM for same day delivery
        </p>
      </div>
      <div className="group hover:scale-105 transition-transform">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center m-auto mb-5 group-hover:bg-orange-600 transition-colors">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="font-bold text-green-900 dark:text-green-400 text-lg">
          100% Fresh Guarantee
        </p>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Farm-fresh quality or your money back
        </p>
      </div>
      <div className="group hover:scale-105 transition-transform">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center m-auto mb-5 group-hover:bg-yellow-600 transition-colors">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <p className="font-bold text-green-900 dark:text-green-400 text-lg">
          24/7 Support
        </p>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          We're here to help anytime you need
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;

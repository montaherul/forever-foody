import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    calculateCartSubtotal,
    appliedCoupon,
    clearCoupon,
    formatCurrency,
  } = useContext(ShopContext);

  const subtotal = calculateCartSubtotal();
  const couponSavings = appliedCoupon
    ? subtotal >= (appliedCoupon.minPurchase || 0)
      ? Number(((appliedCoupon.discountPercent / 100) * subtotal).toFixed(2))
      : 0
    : 0;
  const total =
    subtotal === 0 ? 0 : Math.max(0, subtotal - couponSavings) + delivery_fee;

  return (
    <div className="w-full">
      <div className="text-2xl mb-6">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b-2 border-gray-200 dark:border-slate-700">
          <p className="text-gray-700 dark:text-slate-300 font-medium">
            Subtotal
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="flex justify-between items-center py-3 border-b-2 border-gray-200 dark:border-slate-700">
          <div>
            <p className="text-gray-700 dark:text-slate-300 font-medium">
              Shipping Fee
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Same-day delivery
            </p>
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {subtotal === 0 ? formatCurrency(0) : formatCurrency(delivery_fee)}
          </p>
        </div>

        {/* Coupon Display Only (No Input) */}
        {appliedCoupon && (
          <div className="py-3 border-b-2 border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-slate-300 font-medium">
                  Coupon Applied
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Code: {appliedCoupon.code}
                </p>
              </div>
              <button
                onClick={clearCoupon}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {couponSavings > 0 && (
          <div className="flex justify-between items-center py-3 border-b-2 border-gray-200 dark:border-slate-700 text-green-700 dark:text-green-400">
            <p className="font-semibold flex items-center gap-2">
              <i className="fa-solid fa-tag text-emerald-500"></i>
              Coupon Savings
            </p>
            <p className="text-lg font-semibold">
              - {formatCurrency(couponSavings)}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 -mx-4 px-4 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-xl font-bold text-green-900 dark:text-green-400">
            Total
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;

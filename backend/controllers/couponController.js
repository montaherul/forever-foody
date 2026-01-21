import couponModel from "../models/couponModel.js";

const normalizeCode = (code) => (code || "").trim().toUpperCase();

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercent,
      minPurchase = 0,
      expiresAt,
      active = true,
      usageLimit,
    } = req.body;

    const normalizedCode = normalizeCode(code);
    if (!normalizedCode) {
      return res.json({ success: false, message: "Coupon code is required" });
    }

    const percent = Number(discountPercent);
    if (Number.isNaN(percent) || percent <= 0 || percent > 100) {
      return res.json({
        success: false,
        message: "Discount must be between 1 and 100",
      });
    }

    const existing = await couponModel.findOne({ code: normalizedCode });
    if (existing) {
      return res.json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new couponModel({
      code: normalizedCode,
      discountPercent: percent,
      minPurchase: Number(minPurchase) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      active: active === false || active === "false" ? false : true,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      createdBy: req.adminEmail || "admin",
    });

    await coupon.save();

    res.json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    console.error("createCoupon error", error);
    res.json({ success: false, message: error.message });
  }
};

const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error("listCoupons error", error);
    res.json({ success: false, message: error.message });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    await couponModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Coupon removed" });
  } catch (error) {
    console.error("removeCoupon error", error);
    res.json({ success: false, message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    const normalizedCode = normalizeCode(code);
    if (!normalizedCode) {
      return res.json({ success: false, message: "Enter a coupon code" });
    }

    const coupon = await couponModel.findOne({ code: normalizedCode });
    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }

    if (!coupon.active) {
      return res.json({ success: false, message: "Coupon is inactive" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.json({ success: false, message: "Coupon has expired" });
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usageLimit !== null &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      return res.json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    const numericSubtotal = Number(subtotal) || 0;
    if (numericSubtotal < (coupon.minPurchase || 0)) {
      return res.json({
        success: false,
        message: `Minimum purchase ${coupon.minPurchase}`,
      });
    }

    const discountPercent = coupon.discountPercent;
    const discountAmount = Number(
      ((discountPercent / 100) * numericSubtotal).toFixed(2)
    );

    res.json({
      success: true,
      message: "Coupon applied",
      coupon: {
        code: coupon.code,
        discountPercent,
        minPurchase: coupon.minPurchase || 0,
        expiresAt: coupon.expiresAt,
      },
      discountAmount,
    });
  } catch (error) {
    console.error("validateCoupon error", error);
    res.json({ success: false, message: error.message });
  }
};

export { createCoupon, listCoupons, removeCoupon, validateCoupon };

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersJsonPath = path.join(__dirname, "../data/orders.json");

// Status dictionary keeps API payloads and UI displays consistent
const STATUS_DICTIONARY = {
  placed: "Order Placed",
  confirmed: "Order Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
  // Legacy labels for backward compatibility
  "Order Placed": "Order Placed",
  Packing: "Packed",
  Shipped: "Shipped",
  "Out for delivery": "Out for Delivery",
  Delivered: "Delivered",
};

const deriveStatus = (input) => {
  if (!input) {
    return { code: "placed", label: STATUS_DICTIONARY.placed };
  }
  const normalized = String(input).replace(/\s+/g, "_").toLowerCase();

  if (STATUS_DICTIONARY[normalized]) {
    return { code: normalized, label: STATUS_DICTIONARY[normalized] };
  }

  // Legacy label mapping
  if (STATUS_DICTIONARY[input]) {
    // Map known legacy labels to canonical codes
    const legacyToCanonical = {
      "Order Placed": "placed",
      Packing: "packed",
      Shipped: "shipped",
      "Out for delivery": "out_for_delivery",
      Delivered: "delivered",
    };
    const code = legacyToCanonical[input] || normalized;
    return { code, label: STATUS_DICTIONARY[input] };
  }

  return { code: "placed", label: STATUS_DICTIONARY.placed };
};

const buildActor = ({
  req,
  fallbackName = "System",
  fallbackType = "system",
}) => {
  const isAdminRoute = req?.originalUrl?.includes("/api/order/status");
  const actorType = isAdminRoute ? "admin" : fallbackType;
  return {
    actorType,
    actorName:
      req?.body?.actorName || (actorType === "admin" ? "Admin" : fallbackName),
    actorId: req?.body?.userId,
  };
};

// ✅ Helper function to sync orders to JSON file
const syncOrdersToJSON = async () => {
  try {
    const orders = await orderModel.find({});
    fs.writeFileSync(ordersJsonPath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error syncing orders to JSON:", error);
  }
};

const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      amount,
      address,
      coupon,
      couponSavings = 0,
    } = req.body;

    const statusMeta = deriveStatus("placed");
    const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(2)
      .toString("hex")}`;
    const orderData = {
      userId,
      orderCode,
      items,
      amount,
      address,
      coupon: coupon || null,
      couponSavings,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: statusMeta.label,
      statusCode: statusMeta.code,
      statusHistory: [
        {
          status: statusMeta.label,
          statusCode: statusMeta.code,
          note: "Order placed",
          actorType: "system",
          actorName: "Checkout",
          source: "checkout",
          meta: { amount, coupon: coupon?.code },
        },
      ],
      paymentReference: orderCode,
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Increment coupon usage if applicable
    if (coupon && coupon.code) {
      await couponModel.updateOne(
        { code: coupon.code },
        { $inc: { usageCount: 1 } }
      );
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Sync to JSON file
    await syncOrdersToJSON();

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using stripe method
const placeOrderStripe = async (req, res) => {};

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {};

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    const {
      orderId,
      status,
      note,
      courier,
      trackingNumber,
      trackingUrl,
      expectedDelivery,
      warehouse,
      supplier,
      actorName,
    } = req.body;

    const expectedDeliveryDate = expectedDelivery
      ? new Date(expectedDelivery)
      : null;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const statusMeta = deriveStatus(status || order.status || "placed");
    order.status = statusMeta.label;
    order.statusCode = statusMeta.code;

    const actor = buildActor({ req, fallbackName: actorName });

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: statusMeta.label,
      statusCode: statusMeta.code,
      note: note || `${statusMeta.label} updated`,
      actorType: actor.actorType,
      actorName: actor.actorName,
      actorId: actor.actorId,
      source: "admin-panel",
      meta: {
        courier,
        trackingNumber,
        trackingUrl,
        expectedDelivery:
          expectedDeliveryDate || order.logistics?.expectedDelivery,
        warehouse,
        supplier,
      },
    });

    order.logistics = {
      ...(order.logistics || {}),
      courier: courier ?? order.logistics?.courier,
      trackingNumber: trackingNumber ?? order.logistics?.trackingNumber,
      trackingUrl: trackingUrl ?? order.logistics?.trackingUrl,
      expectedDelivery:
        expectedDeliveryDate || order.logistics?.expectedDelivery || null,
      warehouse: warehouse ?? order.logistics?.warehouse,
      supplier: supplier ?? order.logistics?.supplier,
      shippedAt:
        statusMeta.code === "shipped" ? new Date() : order.logistics?.shippedAt,
      deliveredAt:
        statusMeta.code === "delivered" || statusMeta.code === "completed"
          ? new Date()
          : order.logistics?.deliveredAt,
    };

    // Optional free-form notes without changing status
    if (note && (!status || statusMeta.code === order.statusCode)) {
      order.notes = order.notes || [];
      order.notes.push({
        note,
        actorType: actor.actorType,
        actorName: actor.actorName,
        actorId: actor.actorId,
      });
    }

    await order.save();

    // ✅ Sync to JSON file
    await syncOrdersToJSON();

    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
};

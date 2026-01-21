import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderCode: { type: String, index: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    coupon: { type: Object },
    couponSavings: { type: Number, default: 0 },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    statusCode: { type: String, default: "placed", index: true },
    statusHistory: [
      {
        status: String,
        statusCode: String,
        note: String,
        actorType: { type: String, default: "system" },
        actorName: String,
        actorId: String,
        source: String,
        meta: Object,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    paymentReference: { type: String },
    paymentInfo: {
      gateway: String,
      reference: String,
      paidAt: Date,
      refundStatus: String,
    },
    logistics: {
      courier: String,
      trackingNumber: String,
      trackingUrl: String,
      expectedDelivery: Date,
      warehouse: String,
      supplier: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
    notes: [
      {
        note: String,
        actorType: String,
        actorName: String,
        actorId: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;

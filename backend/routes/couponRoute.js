import express from "express";
import {
  createCoupon,
  listCoupons,
  removeCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import adminAuth from "../middleware/adminAuth.js";

const couponRouter = express.Router();

couponRouter.post("/create", adminAuth, createCoupon);
couponRouter.get("/list", adminAuth, listCoupons);
couponRouter.post("/remove", adminAuth, removeCoupon);
couponRouter.post("/validate", validateCoupon);

export default couponRouter;

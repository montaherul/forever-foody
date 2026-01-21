import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getWishlist,
  toggleCompare,
  getCompare,
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/admin", adminLogin);
userRouter.post("/profile", authUser, getUserProfile);
userRouter.post("/profile/update", authUser, updateUserProfile);
userRouter.post("/wishlist/toggle", authUser, toggleWishlist);
userRouter.post("/wishlist/list", authUser, getWishlist);
userRouter.post("/compare/toggle", authUser, toggleCompare);
userRouter.post("/compare/list", authUser, getCompare);

// Admin routes - User management
userRouter.get("/admin/users", adminAuth, adminGetAllUsers);
userRouter.delete("/admin/user/:id", adminAuth, adminDeleteUser);
userRouter.put("/admin/user/:id", adminAuth, adminUpdateUser);

export default userRouter;

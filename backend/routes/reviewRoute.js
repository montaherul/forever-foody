import express from "express";
import {
  addReview,
  listProductReviews,
  listRecentReviews,
} from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authUser, addReview);
reviewRouter.post("/product", listProductReviews);
reviewRouter.get("/recent", listRecentReviews);
reviewRouter.get("/product/:productId", authUser, listProductReviews);
<<<<<<< HEAD
=======



>>>>>>> 03960244955b50567a1ff75e37f2f16b9f244d1c
export default reviewRouter;

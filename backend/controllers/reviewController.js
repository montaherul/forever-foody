import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

const clampRating = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(1, Math.min(5, n));
};

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;
    const userId = req.userId || req.body.userId; // prefer auth middleware value

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please log in." });
    }

    if (!productId) {
      return res.json({ success: false, message: "Product is required" });
    }
    if (!comment || comment.trim().length < 3) {
      return res.json({ success: false, message: "Please add a comment" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const normalizedRating = clampRating(rating);
    if (!normalizedRating) {
      return res.json({ success: false, message: "Rating must be 1-5" });
    }

    const review = new reviewModel({
      productId,
      userId,
      userName: userName || "Anonymous",
      rating: normalizedRating,
      comment: comment.trim(),
    });

    await review.save();

    res.json({ success: true, message: "Review submitted" });
  } catch (error) {
    console.error("addReview error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.json({ success: false, message: "Product is required" });
    }
    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("listProductReviews error", error);
    res.json({ success: false, message: error.message });
  }
};

const listRecentReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("listRecentReviews error", error);
    res.json({ success: false, message: error.message });
  }
};
// 🔐 ADMIN: delete review
const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewModel.findById(id);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    await reviewModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("adminDeleteReview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addReview, listProductReviews, listRecentReviews , adminDeleteReview};

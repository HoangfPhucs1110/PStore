const express = require("express");
const router = express.Router();
const { getReviews, createReview, getAllReviewsAdmin, deleteReview } = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/auth");

router.get("/products/:productId/reviews", getReviews);
router.post("/", protect, createReview);

// Admin
router.get("/admin/reviews", protect, admin, getAllReviewsAdmin);
router.get("/admin", protect, admin, getAllReviewsAdmin); 
router.delete("/:id", protect, deleteReview);
router.delete("/admin/:id", protect, admin, deleteReview);

module.exports = router;
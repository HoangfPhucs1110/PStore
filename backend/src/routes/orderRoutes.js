const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder, lookupOrder } = require("../controllers/orderController"); 
const { protect, admin, verifyTokenOptional } = require("../middleware/auth");

router.post("/", verifyTokenOptional, createOrder);

router.post("/lookup", lookupOrder); 

router.get("/my", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
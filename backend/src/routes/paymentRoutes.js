const express = require("express");
const router = express.Router();
const { createPaymentLink, getPaymentInfo } = require("../controllers/paymentController");

router.post("/create-payment-link", createPaymentLink);
router.post("/get-payment-info", getPaymentInfo);

module.exports = router;
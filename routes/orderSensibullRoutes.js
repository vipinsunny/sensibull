const express = require("express");
const router = express.Router();
const path = require("path");

const {
  placeOrderSensibull,
  modifyOrderSensibull,
  cancelOrderSensibull,
  getOrderStatusForIds,
} = require("../controllers/orderController");

router.route("/place").post(placeOrderSensibull);
router.route("/:orderId").post(modifyOrderSensibull);
router.route("/:orderId").post(cancelOrderSensibull);
router.route("/status-for-ids").post(getOrderStatusForIds);


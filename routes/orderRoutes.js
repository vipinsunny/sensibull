const express = require("express");
const router = express.Router();
const path = require("path");

const {
  placeOrder,
  modifyOrder,
  cancelOrder,
  getOrderStatus,
} = require("../controllers/orderController");
// Place Order route
router.route("/order-service").post(placeOrder);
router.route("/order-service").put(modifyOrder);
router.route("/order-service").delete(cancelOrder);
router.route("/order-service/status").post(getOrderStatus);


module.exports = router;

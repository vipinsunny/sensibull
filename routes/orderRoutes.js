const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Place Order route
router.post("/order-service", orderController.placeOrder);
router.put("/order-service", orderController.modifyOrder);
router.delete("/order-service", orderController.cancelOrder);
router.post("/order-service/status", orderController.getOrderStatus);

router.post("/place", orderController.placeOrderSensibull);

module.exports = router;

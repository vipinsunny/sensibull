const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");


router.post("/place", orderController.placeOrderSensibull);
router.put("/:orderId", orderController.modifyOrderSensibull);
router.delete("/:orderId", orderController.cancelOrderSensibull);

router.post("status-for-ids", orderController.getOrderStatusForIds);

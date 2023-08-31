const Order = require("../models/Order");
const axios = require("axios");
const Sensibullorder = require("../models/OrderSensibull");
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.placeOrder = catchAsyncError(async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    const order = new Order({
      identifier: Date.now().toString(),
      symbol,
      quantity,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      payload: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to place order",
    });
  }
});

exports.modifyOrder = catchAsyncError (async (req, res) => {
  try {
    const { identifier, new_quantity } = req.body;

    const order = await Order.findOne({ identifier });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.quantity = new_quantity;
    await order.save();

    return res.status(200).json({ success: true, payload: order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to modify order" });
  }
});

// Cancel Order
exports.cancelOrder =catchAsyncError(async (req, res) => {
  try {
    const { identifier } = req.body;

    const canceledOrder = await Order.findOneAndUpdate(
      { identifier },
      { order_status: "cancel" },
      { new: true }
    );

    if (!canceledOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, payload: canceledOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
});

exports.getOrderStatus =catchAsyncError (async (req, res) => {
  try {
    const { identifier } = req.body;

    // Assuming you have a model called 'Order'
    const order = await Order.findOne({ identifier });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      payload: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get order status",
    });
  }
});

// Place Order (Sensibull)
exports.placeOrderSensibull = catchAsyncError (async (req, res) => {
  const { symbol, quantity, order_tag } = req.body;

  try {
    // Make API call to Sensibull
    const sensibullResponse = await axios.post(
      "https://prototype.sbulltech.com/api/order/place",
      {
        symbol,
        quantity,
        order_tag,
      },
      {
        headers: {
          "X-AUTH-TOKEN": process.env.X_AUTH_TOKEN,
        },
      }
    );

    const sensibullOrderData = sensibullResponse.data.payload.order;

    // Create a local order record
    const order = await Sensibullorder.create({
      order_id: sensibullOrderData.order_id,
      order_tag: sensibullOrderData.order_tag,
      symbol: sensibullOrderData.symbol,
      request_quantity: sensibullOrderData.request_quantity,
      filled_quantity: sensibullOrderData.filled_quantity,
      status: sensibullOrderData.status,
    });

    return res.status(201).json({
      success: true,
      payload: {
        order,
        message: "Order create success",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err_msg: "some error occured",
    });
  }
});

exports.modifyOrderSensibull = catchAsyncError (async (req, res) => {
  const orderId = req.params.orderId; // Get the order ID from the URL
  const { request_quantity } = req.body; // Get the new quantity from the request body
  console.log(quantity);
  console.log(orderId);
  try {
    // Make API call to Sensibull
    const sensibullResponse = await axios.put(
      `https://prototype.sbulltech.com/api/order/${orderId}`,
      {
        request_quantity,
      },
      {
        headers: {
          "X-AUTH-TOKEN": process.env.X_AUTH_TOKEN,
        },
      }
    );

    const sensibullOrderData = sensibullResponse.data.payload.order;

    // Update the local order record with the new quantity
    const updatedOrder = await OrderSensibull.findOneAndUpdate(
      { order_id: orderId },
      { request_quantity: sensibullOrderData.request_quantity },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      payload: {
        order: updatedOrder,
        message: "Order update success",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err_msg: "some error occured",
    });
  }
});

exports.cancelOrderSensibull = catchAsyncError (async (req, res) => {
  const { orderId } = req.params;

  try {
    // Make API call to Sensibull
    const sensibullResponse = await axios.delete(
      `https://prototype.sbulltech.com/api/order/${orderId}`,
      {
        headers: {
          "X-AUTH-TOKEN": process.env.X_AUTH_TOKEN,
        },
      }
    );

    const sensibullOrderData = sensibullResponse.data.payload.order;

    // Update the local order record with cancellation status
    const updatedOrder = await OrderSensibull.findOneAndUpdate(
      {
        order_id: sensibullOrderData.order_id,
      },
      {
        status: sensibullOrderData.status,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      payload: {
        order: updatedOrder,
        message: "Order cancel success",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err_msg: "some error occured",
    });
  }
});


exports.getOrderStatusForIds = catchAsyncError (async (req, res) => {
  const { order_ids } = req.body;

  try {
    // Make API call to Sensibull
    const sensibullResponse = await axios.post(
      "https://prototype.sbulltech.com/api/order/status-for-ids",
      {
        order_ids,
      },
      {
        headers: {
          "X-AUTH-TOKEN": process.env.X_AUTH_TOKEN,
        },
      }
    );

    const sensibullOrdersData = sensibullResponse.data.payload;

    return res.status(200).json({
      success: true,
      payload: sensibullOrdersData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err_msg: "some error occured",
    });
  }
});
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  filled_quantity: {
    type: Number,
    default: 0,
  },
  order_status: {
    type: String,
    default: "open",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports= Order

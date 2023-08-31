const mongoose = require("mongoose");

const sensibullorderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  order_tag: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  requested_quantity: {
    type: Number,
    required: true,
  },
  filled_quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["open", "complete", "error", "cancel"],
  },
});

const Sensibullorder = mongoose.model("Sensibullorder", sensibullorderSchema);

module.exports = Sensibullorder;

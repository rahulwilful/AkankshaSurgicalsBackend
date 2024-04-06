const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  position: {
    type: Number,
  },

  public_id: {
    type: String,
    required: true,
  },
  catogory: {
    type: String,
  },
  sub_catogory: {
    type: String,
  },
  product_url: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);

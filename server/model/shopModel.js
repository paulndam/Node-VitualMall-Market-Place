const mongoose = require("mongoose");
const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: `Shop name is required`,
  },

  photo: {
    data: Buffer,
    contentType: String,
  },

  description: {
    type: String,
    trim: true,
  },

  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Shop", ShopSchema);

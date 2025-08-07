const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    sizes: {
      type: [String], // Example: ['S', 'M', 'L', 'XL']
      default: [],
    },

    colors: {
      type: [String], // Example: ['Red', 'Black', 'White']
      default: [],
    },

    categorieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String, // URL to the image
      required: true,
    },

    quantity_sold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Product", productSchema);

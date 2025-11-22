

// src/models/Product.ts

import mongoose, { Schema, models } from 'mongoose';

// The Variant sub-schema remains the same
const VariantSchema = new Schema({
  attributes: [{
    name: { type: String, required: true },
    value: { type: String, required: true },
  }],
  sku: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true, index: true },
  modelCompatibility: { type: [String], default: [] },
  yearRange: { start: Number, end: Number },
  
  // NEW FIELD: This will store the lowest price of all variants for quick display.
  // This will be calculated and saved automatically in our "create/update product" server action.
  displayPrice: {
    type: Number,
    required: [true, 'Display price is required. A product must have at least one variant.'],
  },
  
  variants: [VariantSchema],
  images: { type: [String], default: [] },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.Product || mongoose.model("Product", ProductSchema);
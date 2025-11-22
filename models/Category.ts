// src/models/Category.ts


import mongoose, { Schema, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export default models.Category || mongoose.model("Category", CategorySchema);

// // src/models/Category.ts


// import mongoose, { Schema, models } from 'mongoose';

// const CategorySchema = new Schema({
//   name: {
//     type: String,
//     required: [true, 'Category name is required.'],
//     unique: true,
//   },
//   description: {
//     type: String,
//   },
// }, { timestamps: true });

// export default models.Category || mongoose.model("Category", CategorySchema);














// =============== MAIN-----------============== 




import mongoose, { Schema, models } from 'mongoose';

const AttributeSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Voltage", "Rim Diameter"
  type: { type: String, enum: ["text", "number", "select"], default: "text" },
  options: { type: [String], default: [] }, // Renamed 'values' to 'options' for clarity (the dropdown choices)
});

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: { type: String },
  image: { type: String }, // Icon URL
  
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },

  // These define WHAT attributes products in this category MUST have
  attributes: {
    type: [AttributeSchema],
    default: [],
  },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate slug from name if not provided
CategorySchema.pre('save', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

export default models.Category || mongoose.model("Category", CategorySchema);





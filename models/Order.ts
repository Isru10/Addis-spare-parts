// // src/models/Order.ts


import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true }, // Store the specific variant purchased
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true }, // Crucial: Lock in the price at the time of order
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  // --- Shipping & Payment Info ---
  shippingAddress: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  paymentScreenshotUrl: {
    type: String,
    required: [true, 'Payment screenshot is required for verification.'],
  },
  // --- Order Status and Admin Workflow ---
  status: {
    type: String,
    enum: ['Pending Verification', 'Processing', 'On Route', 'Delivered', 'Cancelled'],
    default: 'Pending Verification',
  },
  activityLog: [{
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    adminName: { type: String }, // Denormalized for easy display
    action: { type: String, required: true }, // e.g., "Verified Payment", "Changed status to On Route"
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default models.Order || mongoose.model("Order", OrderSchema);
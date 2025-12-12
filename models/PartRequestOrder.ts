// models/PartRequestOrder.ts

import mongoose, { Schema, models } from 'mongoose';

const PartRequestOrderSchema = new Schema({
  // Link back to the original conversation
  requestId: { type: Schema.Types.ObjectId, ref: 'PartRequest', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Financials
  totalAmount: { type: Number, required: true }, // Agreed price
  amountPaid: { type: Number, required: true }, // Could be deposit or full
  paymentMethod: { type: String, enum: ['Chapa', 'Bank Transfer'], required: true },
  transactionReference: { type: String },
  paymentScreenshot: { type: String }, // For manual transfers

  // Logistics tracking specific to imports
  logisticsStatus: {
    type: String,
    enum: ['Order Placed', 'Shipped to Warehouse', 'Customs Clearance', 'Ready for Pickup', 'Delivered'],
    default: 'Order Placed'
  },
  
  trackingNumber: { type: String }, // International tracking if applicable
  
  shippingAddress: {
    fullName: String,
    phone: String,
    city: String
  }
}, { timestamps: true });

export default models.PartRequestOrder || mongoose.model("PartRequestOrder", PartRequestOrderSchema);
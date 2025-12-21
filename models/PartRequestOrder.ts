// // models/PartRequestOrder.ts

// import mongoose, { Schema, models } from 'mongoose';

// const PartRequestOrderSchema = new Schema({
//   // Link back to the original conversation
//   requestId: { type: Schema.Types.ObjectId, ref: 'PartRequest', required: true, index:true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index:true },

//   // Financials
//   totalAmount: { type: Number, required: true }, // Agreed price
//   amountPaid: { type: Number, required: true }, // Could be deposit or full
//   paymentMethod: { type: String, enum: ['Chapa', 'Bank Transfer'], required: true },
//   transactionReference: { type: String },
//   paymentScreenshot: { type: String }, // For manual transfers

//   // Logistics tracking specific to imports
//   logisticsStatus: {
//     type: String,
//     enum: ['Order Placed', 'Shipped to Warehouse', 'Customs Clearance', 'Ready for Pickup', 'Delivered'],
//     default: 'Order Placed',
//     index:true
//   },
  
//   trackingNumber: { type: String }, // International tracking if applicable
  
//   shippingAddress: {
//     fullName: String,
//     phone: String,
//     city: String
//   }
// }, { timestamps: true });

// // Sort Index for Admin Dashboard (Newest Orders First)
// PartRequestOrderSchema.index({ createdAt: -1 });
// export default models.PartRequestOrder || mongoose.model("PartRequestOrder", PartRequestOrderSchema);

import mongoose, { Schema, models } from 'mongoose';

const PartRequestOrderSchema = new Schema({
  // FIX: Added 'refPath' so Mongoose knows which collection to look at dynamically
  requestId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    index: true,
    refPath: 'requestType' 
  },
  
  // FIX: This field determines if we look in "PartRequest" or "InsuranceRequest"
  requestType: { 
    type: String, 
    required: true,
    enum: ['PartRequest', 'InsuranceRequest'], 
    default: 'PartRequest' 
  },

  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },

  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Chapa', 'Bank Transfer'], required: true },
  transactionReference: { type: String },
  paymentScreenshot: { type: String },

  logisticsStatus: {
    type: String,
    enum: ['Order Placed', 'Shipped to Warehouse', 'Customs Clearance', 'Ready for Pickup', 'Delivered'],
    default: 'Order Placed',
    index: true
  },
  
  trackingNumber: { type: String },
  
  shippingAddress: {
    fullName: String,
    phone: String,
    city: String
  }
}, { timestamps: true });

PartRequestOrderSchema.index({ createdAt: -1 });

export default models.PartRequestOrder || mongoose.model("PartRequestOrder", PartRequestOrderSchema);
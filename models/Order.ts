// // src/models/Order.ts
import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Cart Items Snapshot
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // Snapshot name
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Snapshot price
    variantSku: { type: String }
  }],

  totalAmount: { type: Number, required: true },

  // --- NEW PAYMENT FIELDS ---
  paymentMethod: { 
    type: String, 
    enum: ['Chapa', 'Bank Transfer'], 
    required: true 
  },
  
  // Chapa Transaction Ref (Unique, sparse allows nulls for Bank Transfers)
  transactionReference: { 
    type: String, 
    unique: true, 
    sparse: true 
  },

  // For Manual Verification
  paymentScreenshotUrl: { type: String },

  // --- LIFECYCLE ---
  status: {
    type: String,
    enum: ['Pending Verification', 'Processing', 'On Route', 'Delivered', 'Cancelled'],
    default: 'Pending Verification'
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    city: String,
    subCity: String,
    woreda: String,
    houseNumber: String,
  },

  // Audit Trail
  activityLog: [{
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: String, // e.g. "Verified Payment", "Marked as Delivered"
    timestamp: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

export default models.Order || mongoose.model('Order', OrderSchema);
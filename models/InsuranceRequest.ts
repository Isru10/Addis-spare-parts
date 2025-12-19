import mongoose, { Schema, models } from 'mongoose';

const QuoteItemSchema = new Schema({
  partName: { type: String, required: true },
  partNumber: String,
  condition: { type: String, enum: ['New Genuine', 'New Aftermarket', 'Used'] },
  availability: { type: String, enum: ['In Stock', 'Order (3-5 Days)', 'Order (15+ Days)', 'Unavailable'] },
  unitPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  notes: String
});

const InsuranceRequestSchema = new Schema({
  insurerId: { type: Schema.Types.ObjectId, ref: 'InsurerProfile', required: true, index: true },
  
  // Claim Context (To link digital request to physical file)
  claimReferenceNumber: { type: String, required: true, index: true }, // The Insurance's own file number
  
  vehicleDetails: {
    make: String,
    model: String,
    year: Number,
    vin: String, // Critical for accuracy
    plateNumber: String
  },

  // The "Ask"
  requestedPartsList: [{ type: String }], // Raw list from the insurer
  officialDocumentUrl: { type: String, required: true }, // The scanned request letter
  
  // The "Answer" (Your Quotation)
  quotation: {
    items: [QuoteItemSchema],
    subtotal: Number,
    vat: Number,
    grandTotal: Number,
    
    generatedAt: Date,
    validUntil: Date, // Quotations must expire to protect you from price hikes
    
    // Unique Code for the Claimant to buy this package later
    redemptionCode: { type: String, unique: true, sparse: true } 
  },

  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Quoted', 'Accepted', 'Expired', 'Declined'],
    default: 'Submitted',
    index: true
  }
}, { timestamps: true });

export default models.InsuranceRequest || mongoose.model("InsuranceRequest", InsuranceRequestSchema);
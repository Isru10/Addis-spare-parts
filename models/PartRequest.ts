// models/PartRequest.ts
import mongoose, { Schema, models } from 'mongoose';

const PartRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 1. Precise Vehicle Identity
  vehicleDetails: {
    make: { type: String, required: true }, // Toyota
    model: { type: String, required: true }, // Hilux
    year: { type: Number, required: true }, // 2015
    trim: { type: String }, // e.g. "SR5 Double Cab" (Crucial for body parts)
    engineCode: { type: String }, // e.g. "1GD-FTV" (Crucial for engine parts)
    vin: { type: String }, // Chassis Number (The ultimate identifier)
    transmission: { type: String, enum: ['Automatic', 'Manual', 'CVT', 'Other'] },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] }
  },

  // 2. Part Description
  partDetails: {
    partName: { type: String, required: true }, // "Side Mirror"
    description: { type: String, required: true }, // "Left side, heated, with indicator light"
    partNumber: { type: String }, // Optional: If user knows OEM number
    quantity: { type: Number, default: 1 },
    condition: { type: String, enum: ['New Genuine', 'New Aftermarket', 'Used', 'Any'], default: 'New Genuine' }
  },

  // 3. Visuals (Crucial to prevent mistakes)
  images: { type: [String], default: [] }, // Uploads of broken part or VIN plate

  // 4. Admin Response (The Quote)
  quote: {
    price: { type: Number }, // Unit Price
    depositRequired: { type: Number }, // usually 50% or 100%
    estimatedArrival: { type: String }, // "15-20 Days"
    shippingMethod: { type: String, enum: ['Air Freight', 'Sea Freight'] },
    adminNotes: { type: String }, // "Found original Denso part in Dubai"
    quotedAt: { type: Date }
  },

  status: {
    type: String,
    enum: ['Pending Review', 'Searching', 'Quoted', 'Rejected', 'Ordered', 'Completed'],
    default: 'Pending Review'
  }
}, { timestamps: true });

export default models.PartRequest || mongoose.model("PartRequest", PartRequestSchema);
import mongoose, { Schema, models } from 'mongoose';

const InsurerProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Professional Identity
  companyName: { type: String, required: true, index: true }, // e.g., "Awash Insurance"
  branchName: { type: String, required: true }, // e.g., "Bole Branch"
  tinNumber: { type: String }, // Tax ID (Adds legitimacy)
  
  // Verification
  licenseDocument: { type: String, required: true }, // Cloudinary URL of their ID/License
  
  // Contact for Claims
  officialEmail: { type: String, required: true }, 
  officialPhone: { type: String, required: true },

  // Application Status
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
    default: 'Pending',
    index: true
  },
  
  rejectionReason: { type: String } // Feedback if rejected
}, { timestamps: true });

export default models.InsurerProfile || mongoose.model("InsurerProfile", InsurerProfileSchema);
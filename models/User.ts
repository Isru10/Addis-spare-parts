// src/models/User.ts

import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    unique: true,
    required:  [true, 'Email is required.'],
  },
  phone: {
    type: String,
    default: "", // Defaults to an empty string as per requirements
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin","insurer"],
    default: "user",
  },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

export default models.User || mongoose.model("User", UserSchema);
// src/app/actions/upload-receipt.ts.
/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadPaymentReceipt(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validation: Check size (e.g., max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File size too large (Max 2MB)" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: "addis-parts/receipts", // Specialized folder for receipts
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload image" };
  }
}
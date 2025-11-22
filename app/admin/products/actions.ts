"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/session";
import Product from "@/models/Product";
import { IVariant } from "@/types/product";
import { v2 as cloudinary } from 'cloudinary';




// Add this function to the bottom of src/app/admin/products/actions.ts

import { z } from 'zod'; // We'll use Zod for safe parsing of the ID

export async function deleteProduct(productId: string) {
  // 1. Authorization Check: Re-verify user permissions
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    // We throw an error here because this action is called directly, not from useActionState
    throw new Error("Unauthorized"); 
  }

  // 2. Validation: Ensure the provided ID is a valid string
  const schema = z.string().min(1);
  const validatedId = schema.safeParse(productId);

  if (!validatedId.success) {
    throw new Error("Invalid Product ID provided.");
  }

  try {
    await dbConnect();
    
    // 3. Database Interaction: Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(validatedId.data);

    if (!deletedProduct) {
      // This case handles if someone tries to delete a product that's already been deleted
      throw new Error("Product not found.");
    }

    // TODO in future: Add logic to delete associated images from Cloudinary to save space.
    // This requires storing the public_id from Cloudinary in your Product model.

  } catch (error) {
    console.error("Failed to delete product:", error);
    // In a real app, you might want more sophisticated error logging here.
    throw new Error("Database error: Could not delete product.");
  }

  // 4. Post-Action Tasks: Revalidate caches to update the UI
  revalidatePath("/admin/products");
  revalidatePath("/products"); // Also revalidate the public-facing product list
}
// Configure Cloudinary with your credentials from .env.local
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Define a type for our form state, which will be returned to the client
interface FormState {
  success: boolean;
  message: string;
}

// Helper function to upload a single image buffer to Cloudinary
async function uploadImageToCloudinary(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
              // --- THIS IS THE ADDED OPTION ---
              folder: "addis-auto-spare-parts/new-product",
              resource_type: 'image' 
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result) {
                    return resolve(result.secure_url);
                }
            }
        );
        stream.end(fileBuffer);
    });
}

export async function createOrUpdateProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return { success: false, message: "Unauthorized: You do not have permission to perform this action." };
  }

  try {
    await dbConnect();

    const productId = formData.get("productId") as string | null;
    
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      isActive: formData.get("isActive") === "on",
    };

    const existingImagesToKeep = (formData.get("existingImages") as string || '').split(',').filter(Boolean);
    const newImageFiles = formData.getAll("image-uploads") as File[];
    
    const uploadedImageUrls: string[] = [];
    if (newImageFiles.length > 0) {
        const validFiles = newImageFiles.filter(file => file.size > 0);
        
        const uploadPromises = validFiles.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return uploadImageToCloudinary(buffer);
        });

        const results = await Promise.all(uploadPromises);
        uploadedImageUrls.push(...results);
    }

    const finalImages = [...existingImagesToKeep, ...uploadedImageUrls];

    const variantsData: Record<string, Partial<IVariant>> = {};
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("variant-")) {
            const parts = key.split('-');
            const index = parts[1];
            const field = parts[2];
            if (!variantsData[index]) variantsData[index] = { attributes: [{ name: '', value: '' }] };
            if (field === 'sku') variantsData[index].sku = value as string;
            if (field === 'price') variantsData[index].price = parseFloat(value as string);
            if (field === 'stock') variantsData[index].stock = parseInt(value as string);
            if (field === 'attr') {
                const attrIndex = parseInt(parts[3]);
                const attrField = parts[4];
                if (!variantsData[index].attributes) variantsData[index].attributes = [];
                if (!variantsData[index].attributes![attrIndex]) variantsData[index].attributes![attrIndex] = { name: '', value: '' };
                (variantsData[index].attributes![attrIndex] as any)[attrField] = value;
            }
        }
    }
    const variants = Object.values(variantsData).filter(v => v.sku);

    if (!rawData.name || !rawData.brand || !rawData.category) {
      return { success: false, message: "Name, Brand, and Category are required." };
    }
    if (variants.length === 0) {
      return { success: false, message: "At least one variant must be added." };
    }

    const displayPrice = Math.min(...variants.map(v => v.price || Infinity));
    if (displayPrice === Infinity) {
        return { success: false, message: "One or more variants has an invalid price." };
    }
    
    const productData = { ...rawData, images: finalImages, variants, displayPrice };

    if (productId && productId.length > 0) {
      await Product.findByIdAndUpdate(productId, productData);
    } else {
      await Product.create(productData);
    }
  } catch (error: any) {
    console.error("Error creating/updating product:", error);
    if (error.code === 11000) {
      return { success: false, message: `A variant with a duplicate SKU already exists. Please check your SKUs.` };
    }
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  
  redirect("/admin/products");
}
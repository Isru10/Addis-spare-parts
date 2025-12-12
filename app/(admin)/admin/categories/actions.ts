// // src/app/admin/categories/actions.ts
// "use server";

// import dbConnect from "@/lib/mongodb";
// import Category from "@/models/Category";
// import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */




// // Define a type for our form state
// interface FormState {
//   success: boolean;
//   message: string;
// }

// // THE FIX: The action must accept `prevState` as its first argument.
// export async function createCategory(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   const name = formData.get('name') as string;
//   const description = formData.get('description') as string;

//   if (!name) {
//     return { success: false, message: "Category name is required." };
//   }

//   try {
//     await dbConnect();
//     await Category.create({ name, description });
//     revalidatePath("/admin/categories");
//     // On success, return a new state object
//     return { success: true, message: "Category created successfully." };
//   } catch (error) {
//     // Check for duplicate key error
//     if ((error as any).code === 11000) {
//       return { success: false, message: "A category with this name already exists." };
//     }
//     return { success: false, message: "Failed to create category." };
//   }
// }

// export async function deleteCategory(categoryId: string) {
//   try {
//     await dbConnect();
//     // Optional: Check if any products are using this category before deleting
//     await Category.findByIdAndDelete(categoryId);
//     revalidatePath("/admin/categories");
//   } catch (error) {
//     console.error("Failed to delete category:", error);
//   }
// }

"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/session";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
              folder: "addis-parts/categories", 
              resource_type: 'image',
              // Add a timeout to Cloudinary options (in ms)
              timeout: 60000 
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
}

export async function createOrUpdateCategory(prevState: any, formData: FormData) {
  // 1. Auth Check
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return { success: false, message: "Unauthorized access" };
  }

  await dbConnect();

  try {
    const id = formData.get("categoryId") as string;
    const name = formData.get("name") as string;
    
    // Server-side validation
    if (!name || name.trim().length < 2) {
      return { success: false, message: "Category name must be at least 2 characters." };
    }

    const description = formData.get("description") as string;
    
    // Parent Logic
    const parentCategoryRaw = formData.get("parentCategory") as string;
    const parentCategory = (parentCategoryRaw === "root" || !parentCategoryRaw) ? null : parentCategoryRaw;

    // Attribute Parsing
    let attributes = [];
    try {
       const attributesRaw = formData.get("attributes") as string;
       attributes = attributesRaw ? JSON.parse(attributesRaw) : [];
    } catch (e) {
       return { success: false, message: "Invalid attribute data format." };
    }

    // Image Upload Handling
    const file = formData.get("image") as File;
    let imageUrl = formData.get("existingImage") as string;
    
    if (file && file.size > 0) {
      // Validate file size on server (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, message: "Image is too large. Max size is 2MB." };
      }
      try {
        imageUrl = await uploadImage(file);
      } catch (uploadError) {
        console.error("Cloudinary Error:", uploadError);
        return { success: false, message: "Failed to upload image. Please try a smaller file." };
      }
    }

    const data = {
      name,
      description,
      image: imageUrl,
      parentCategory,
      attributes,
      isActive: formData.get("isActive") === "on"
    };

    if (id) {
      await Category.findByIdAndUpdate(id, data);
    } else {
      await Category.create(data);
    }

    revalidatePath("/admin/categories");
    // Return empty message on success so we can close the sheet in the UI
    return { success: true, message: "Category saved successfully" };

  } catch (error: any) {
    console.error("Database Error:", error);
    // Handle Duplicate Key Error (E11000)
    if (error.code === 11000) {
        return { success: false, message: "A category with this name already exists." };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteCategory(id: string) {
    await dbConnect();
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
}
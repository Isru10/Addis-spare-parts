// src/app/admin/categories/actions.ts
"use server";

import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */




// Define a type for our form state
interface FormState {
  success: boolean;
  message: string;
}

// THE FIX: The action must accept `prevState` as its first argument.
export async function createCategory(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    return { success: false, message: "Category name is required." };
  }

  try {
    await dbConnect();
    await Category.create({ name, description });
    revalidatePath("/admin/categories");
    // On success, return a new state object
    return { success: true, message: "Category created successfully." };
  } catch (error) {
    // Check for duplicate key error
    if ((error as any).code === 11000) {
      return { success: false, message: "A category with this name already exists." };
    }
    return { success: false, message: "Failed to create category." };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await dbConnect();
    // Optional: Check if any products are using this category before deleting
    await Category.findByIdAndDelete(categoryId);
    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Failed to delete category:", error);
  }
}
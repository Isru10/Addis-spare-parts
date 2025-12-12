"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import { getCurrentUser } from "@/lib/session";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface RequestFormState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

// Accepts the raw form data object directly
export async function createPartRequest(formData: any): Promise<RequestFormState> {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, message: "Unauthorized. Please log in." };
  }

  // Basic Validation
  if (!formData.make || !formData.model || !formData.partName) {
    return { 
      success: false, 
      message: "Validation Error",
      fieldErrors: {
        make: !formData.make ? "Required" : "",
        model: !formData.model ? "Required" : "",
        partName: !formData.partName ? "Required" : ""
      }
    };
  }

  try {
    await dbConnect();

    await PartRequest.create({
      userId: user.id,
      
      vehicleDetails: {
        make: formData.make,
        model: formData.model,
        year: Number(formData.year) || new Date().getFullYear(),
        trim: formData.trim,
        vin: formData.vin,
        transmission: formData.transmission,
      },

      partDetails: {
        partName: formData.partName,
        description: formData.description,
        quantity: Number(formData.quantity) || 1,
        condition: formData.condition
      },

      images: formData.images || [],
      
      status: 'Pending Review'
    });

    // Revalidate paths so the user sees the new request in their profile immediately
    revalidatePath("/profile/requests");
    revalidatePath("/admin/requests");

    return { success: true, message: "Request submitted successfully!" };

  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, message: "Database Error: Failed to create request." };
  }
}
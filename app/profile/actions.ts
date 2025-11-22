// src/app/profile/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/session";
import User from "@/models/User";

interface FormState {
  success: boolean;
  message: string;
}

export async function updateUserPhone(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  const phone = formData.get("phone") as string;

  // Basic validation
  if (!phone || phone.length < 6) {
    return { success: false, message: "Please enter a valid phone number." };
  }

  try {
    await dbConnect();
    await User.findByIdAndUpdate(user.id, { phone });

    // Revalidate the path to show the updated data instantly
    revalidatePath("/profile");

    return { success: true, message: "Phone number updated successfully!" };
  } catch (error) {
    console.error("Error updating phone number:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
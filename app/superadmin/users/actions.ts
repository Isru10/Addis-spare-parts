// src/app/superadmin/users/actions.ts
"use server";

import dbConnect from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/session";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

type UserRole = "user" | "admin" | "superadmin";

export async function updateUserRole(userId: string, newRole: UserRole) {
  const currentUser = await getCurrentUser();

  // Security Check 1: Must be a superadmin
  if (!currentUser || currentUser.role !== "superadmin") {
    throw new Error("Unauthorized: Only superadmins can change user roles.");
  }

  // Security Check 2: Superadmin cannot demote themselves
  if (currentUser.id === userId && newRole !== "superadmin") {
    throw new Error("Action not allowed: You cannot demote your own account.");
  }

  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath("/superadmin/users"); // Refresh the user list
    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (error) {
    return { success: false, message: "Database error. Failed to update role." };
  }
}
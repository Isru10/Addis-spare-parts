"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";

export async function updateUserRole(userId: string, newRole: string) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'superadmin') throw new Error("Unauthorized");

  await dbConnect();
  await User.findByIdAndUpdate(userId, { role: newRole });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  await dbConnect();
  
  const targetUser = await User.findById(userId);
  
  // Logic Check: Admin cannot delete other Admins
  if (currentUser.role !== 'superadmin' && targetUser.role === 'admin') {
    throw new Error("Admins cannot delete other admins.");
  }

  await User.findByIdAndDelete(userId);
  revalidatePath("/admin/users");
}
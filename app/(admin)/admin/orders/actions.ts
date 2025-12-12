"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/session";

export async function verifyPayment(orderId: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await Order.findByIdAndUpdate(orderId, {
    status: "Processing",
    $push: {
      activityLog: {
        adminId: user.id,
        action: "Manual Payment Verified",
        timestamp: new Date()
      }
    }
  });
  
  revalidatePath("/admin/orders");
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await Order.findByIdAndUpdate(orderId, {
    status: newStatus,
    $push: {
      activityLog: {
        adminId: user.id,
        action: `Status updated to ${newStatus}`,
        timestamp: new Date()
      }
    }
  });

  revalidatePath("/admin/orders");
}
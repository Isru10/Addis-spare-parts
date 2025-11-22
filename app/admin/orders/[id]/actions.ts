// src/app/admin/orders/[id]/actions.ts
"use server";

import dbConnect from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/session";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

type OrderStatus = 'Pending Verification' | 'Processing' | 'On Route' | 'Delivered' | 'Cancelled';

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    throw new Error("Unauthorized");
  }

  try {
    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status: newStatus },
        $push: {
          activityLog: {
            adminId: user.id,
            adminName: user.name,
            action: `Status changed to ${newStatus}`,
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found.");
    }

    // Revalidate the page to show the changes immediately
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`); // Also revalidate the list page

    return { success: true, message: `Order status updated to ${newStatus}` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
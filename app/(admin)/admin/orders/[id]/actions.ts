// // src/app/admin/orders/[id]/actions.ts
// "use server";

// import dbConnect from "@/lib/mongodb";
// import { getCurrentUser } from "@/lib/session";
// import Order from "@/models/Order";
// import { revalidatePath } from "next/cache";

// type OrderStatus = 'Pending Verification' | 'Processing' | 'On Route' | 'Delivered' | 'Cancelled';

// export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
//   const user = await getCurrentUser();
//   if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
//     throw new Error("Unauthorized");
//   }

//   try {
//     await dbConnect();
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         $set: { status: newStatus },
//         $push: {
//           activityLog: {
//             adminId: user.id,
//             adminName: user.name,
//             action: `Status changed to ${newStatus}`,
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       throw new Error("Order not found.");
//     }

//     // Revalidate the page to show the changes immediately
//     revalidatePath(`/admin/orders/${orderId}`);
//     revalidatePath(`/admin/orders`); // Also revalidate the list page

//     return { success: true, message: `Order status updated to ${newStatus}` };
//   } catch (error) {
//     return { success: false, message: (error as Error).message };
//   }
// }


"use server";

import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Verify Bank Transfer
export async function verifyPayment(orderId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error("Unauthorized");

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

// Update Lifecycle Status
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error("Unauthorized");

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
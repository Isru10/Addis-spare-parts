"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import PartRequestOrder from "@/models/PartRequestOrder";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(id: string, status: string) {
  await dbConnect();
  
  if (status === 'Deleted') {
    await PartRequest.findByIdAndDelete(id);
  } else {
    await PartRequest.findByIdAndUpdate(id, { status });
  }
  
  revalidatePath("/admin/requests");
}


export async function sendQuote(requestId: string, quoteData: any) {
  await dbConnect();
  
  try {
    await PartRequest.findByIdAndUpdate(requestId, {
      status: 'Quoted',
      quote: {
        price: quoteData.price,
        estimatedArrival: quoteData.estimatedArrival,
        shippingMethod: quoteData.shippingMethod,
        adminNotes: quoteData.adminNotes,
        quotedAt: new Date()
      }
    });
    
    // Optional: Send Email Notification to User here
    
    revalidatePath("/admin/requests");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



export async function updateLogisticsStatus(orderId: string, status: string) {
  await dbConnect();
  
  const order = await PartRequestOrder.findByIdAndUpdate(orderId, { logisticsStatus: status });
  
  // If Delivered, mark the original request as Completed too
  if (status === 'Delivered' && order) {
    await PartRequest.findByIdAndUpdate(order.requestId, { status: 'Completed' });
  }
  
  revalidatePath("/admin/requests/orders");
}



export async function rejectFakePayment(orderId: string) {
  await dbConnect();
  
  const order = await PartRequestOrder.findById(orderId);
  if (!order) throw new Error("Order not found");

  // 1. Delete the fake order
  await PartRequestOrder.findByIdAndDelete(orderId);

  // 2. Revert the original request so they can try again (or reject it entirely)
  // Let's set it back to 'Quoted' so the user sees the 'Pay' button again, 
  // maybe you'd want to email them saying "Upload Failed".
  await PartRequest.findByIdAndUpdate(order.requestId, { status: 'Quoted' });

  revalidatePath("/admin/requests/orders");
}

"use server";

import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { revalidatePath } from "next/cache";

export async function acceptSettlement(requestId: string) {
  await dbConnect();
  
  await InsuranceRequest.findByIdAndUpdate(requestId, {
    status: 'Accepted'
  });

  revalidatePath(`/insurer/requests/${requestId}`);
  return { success: true };
}
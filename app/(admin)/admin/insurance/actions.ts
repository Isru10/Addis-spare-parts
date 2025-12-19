"use server";

import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import InsurerProfile from "@/models/InsurerProfile";
import User from "@/models/User";


/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createQuote(claimId: string, data: any) {
  await dbConnect();

  try {
    // Generate a redemption code for the claimant
    const redemptionCode = `CLAIM-${uuidv4().substring(0, 6).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // 7 Days validity

    await InsuranceRequest.findByIdAndUpdate(claimId, {
      status: 'Quoted',
      quotation: {
        items: data.items,
        subtotal: data.subtotal,
        vat: data.vat,
        grandTotal: data.grandTotal,
        generatedAt: new Date(),
        validUntil: validUntil,
        redemptionCode: redemptionCode
      }
    });

    revalidatePath("/admin/insurance");
    revalidatePath(`/insurer/requests/${claimId}`); // Update Insurer view
    
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}




export async function updatePartnerStatus(profileId: string, status: string) {
  await dbConnect();
  
  // 1. Update Profile
  const profile = await InsurerProfile.findByIdAndUpdate(profileId, { status }, { new: true });
  
  if (!profile) throw new Error("Profile not found");

  // 2. Sync User Role
  if (status === 'Approved') {
    await User.findByIdAndUpdate(profile.userId, { role: 'insurer' });
  } else if (status === 'Suspended' || status === 'Rejected') {
    await User.findByIdAndUpdate(profile.userId, { role: 'user' }); // Demote back to normal user
  }

  revalidatePath("/admin/insurance/partners");
}
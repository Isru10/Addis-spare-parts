import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import PartRequestOrder from "@/models/PartRequestOrder"; 
import { getCurrentUser } from "@/lib/session";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  const user = await getCurrentUser();
  // We allow Guest users to pay for claims if they have the code, 
  // BUT linking to a User ID is better for tracking. 
  // If no user is logged in, we might need to handle 'Guest' logic or force login.
  // For now, let's assume they must log in to pay (prevents fraud).
  if (!user) return NextResponse.json({ error: "Please log in to complete the claim." }, { status: 401 });

  try {
    const { requestId, paymentScreenshot, shippingAddress } = await req.json();
    await dbConnect();

    const insuranceRequest = await InsuranceRequest.findById(requestId);
    if (!insuranceRequest) return NextResponse.json({ error: "Claim not found" }, { status: 404 });




    // new create order
    const order = await PartRequestOrder.create({
      requestId: requestId, 
      requestType: 'InsuranceRequest', // <--- TELL IT THIS IS INSURANCE
      userId: user.id,
      totalAmount: insuranceRequest.quotation.grandTotal,
      amountPaid: insuranceRequest.quotation.grandTotal,
      paymentMethod: 'Bank Transfer',
      paymentScreenshot: paymentScreenshot,
      logisticsStatus: 'Order Placed',
      shippingAddress: shippingAddress
    });

    // Update Request Status to 'Accepted' (Claimant paid)
    // Note: The Insurer might have already clicked "Accept Settlement", which is fine.
    insuranceRequest.status = 'Accepted';
    await insuranceRequest.save();

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



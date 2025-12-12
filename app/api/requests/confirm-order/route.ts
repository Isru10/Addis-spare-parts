import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import PartRequestOrder from "@/models/PartRequestOrder"; // The new model we made earlier
import { getCurrentUser } from "@/lib/session";


/* eslint-disable @typescript-eslint/no-explicit-any */



export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { requestId, paymentScreenshot, shippingAddress } = await req.json();
    await dbConnect();

    // 1. Get original request for price
    const originalRequest = await PartRequest.findById(requestId);
    if (!originalRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // 2. Create Order
    const order = await PartRequestOrder.create({
      requestId: requestId,
      userId: user.id,
      totalAmount: originalRequest.quote.price,
      amountPaid: originalRequest.quote.price, // Assuming full payment
      paymentMethod: 'Bank Transfer',
      paymentScreenshot: paymentScreenshot,
      logisticsStatus: 'Order Placed',
      shippingAddress: shippingAddress
    });

    // 3. Update Request Status
    originalRequest.status = 'Ordered';
    await originalRequest.save();

    return NextResponse.json({ success: true, orderId: order._id });

  } catch (error: any) {
    console.error("Order Confirm Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
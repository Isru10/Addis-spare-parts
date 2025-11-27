// app/api/payment/verify/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { chapa } from "@/lib/chapa";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) return NextResponse.redirect(new URL('/cart?status=failed', req.url));

  try {
    await dbConnect();
    
    // 1. Verify with Chapa
    const verification = await chapa.verify(tx_ref);

    if (verification.status === 'success' || verification.message === 'Payment details found') {
      // 2. Update Order
      await Order.findOneAndUpdate(
        { transactionReference: tx_ref },
        { 
          status: 'Processing',
          $push: {
            activityLog: {
              action: 'Automated Verification (Chapa)',
              timestamp: new Date()
            }
          }
        }
      );
      return NextResponse.redirect(new URL('/orders/success', req.url));
    }

    return NextResponse.redirect(new URL('/cart?status=failed', req.url));

  } catch (error) {
    console.error("Verification Error", error);
    return NextResponse.redirect(new URL('/cart?status=error', req.url));
  }
}
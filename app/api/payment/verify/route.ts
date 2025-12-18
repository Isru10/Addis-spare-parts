// // app/api/payment/verify/route.ts

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Order from "@/models/Order";
// import { chapa } from "@/lib/chapa";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const tx_ref = searchParams.get("tx_ref");

//   if (!tx_ref) return NextResponse.redirect(new URL('/cart?status=failed', req.url));

//   try {
//     await dbConnect();
    
//     // 1. Verify with Chapa
//     const verification = await chapa.verify(tx_ref);

//     if (verification.status === 'success' || verification.message === 'Payment details found') {
//       // 2. Update Order
//       await Order.findOneAndUpdate(
//         { transactionReference: tx_ref },
//         { 
//           status: 'Processing',
//           $push: {
//             activityLog: {
//               action: 'Automated Verification (Chapa)',
//               timestamp: new Date()
//             }
//           }
//         }
//       );
//       return NextResponse.redirect(new URL('/orders/success', req.url));
//     }

//     return NextResponse.redirect(new URL('/cart?status=failed', req.url));

//   } catch (error) {
//     console.error("Verification Error", error);
//     return NextResponse.redirect(new URL('/cart?status=error', req.url));
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { chapa } from "@/lib/chapa";
import { deductStock } from "@/lib/inventory"; // Import helper

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) return NextResponse.redirect(new URL('/cart?status=failed', req.url));

  try {
    await dbConnect();
    
    // Check if order exists first
    const order = await Order.findOne({ transactionReference: tx_ref });
    if (!order) return NextResponse.redirect(new URL('/cart?status=error', req.url));

    // If already processed, don't deduct again!
    if (order.status !== 'Pending Verification') {
       return NextResponse.redirect(new URL('/orders/success', req.url));
    }

    // Verify with Chapa
    const verification = await chapa.verify(tx_ref);

    if (verification.status === 'success' || verification.message === 'Payment details found') {
      
      // 1. DEDUCT STOCK NOW
      await deductStock(order.items);

      // 2. Update Order Status
      order.status = 'Processing';
      order.activityLog.push({
        action: 'Automated Verification (Chapa)',
        timestamp: new Date()
      });
      await order.save();

      return NextResponse.redirect(new URL('/orders/success', req.url));
    }

    return NextResponse.redirect(new URL('/cart?status=failed', req.url));

  } catch (error) {
    console.error("Verification Error", error);
    return NextResponse.redirect(new URL('/cart?status=error', req.url));
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from "crypto";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  try {
    // 1. Get Signature and Secret
    const signature = req.headers.get("x-chapa-signature");
    const secret = process.env.CHAPA_WEBHOOK_SECRET; 

    if (!signature || !secret) {
        // If these are missing, it's not a valid request from Chapa
        return NextResponse.json({ error: "Missing signature or secret configuration" }, { status: 400 });
    }

    // 2. Parse Body
    // We clone the request because reading the body might consume the stream
    const body = await req.json();
    
    // 3. Verify Signature (Security Critical)
    // Chapa hashes the JSON body using your secret key via HMAC-SHA256
    const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');

    if (hash !== signature) {
        console.error("Invalid Webhook Signature. Potential attack.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 4. Connect DB
    await dbConnect();

    // 5. Handle the Event
    // Chapa sends distinct events. We care about 'charge.success'.
    // NOTE: Chapa structure might vary slightly, but usually body.tx_ref exists.
    const tx_ref = body.tx_ref || body.data?.tx_ref; 

    if (body.event === 'charge.success' && tx_ref) {
        console.log(`Webhook: Processing success for ${tx_ref}`);

        // Update Order Status
        const updatedOrder = await Order.findOneAndUpdate(
            { transactionReference: tx_ref },
            { 
              status: 'Processing',
              $push: {
                activityLog: {
                  action: 'Webhook Verification (Chapa)',
                  timestamp: new Date()
                }
              }
            },
            { new: true } // Return updated doc
        );

        if (!updatedOrder) {
            console.error(`Webhook: Order ${tx_ref} not found in DB`);
            // We still return 200 to Chapa so they stop retrying, but log the error internally
            return NextResponse.json({ status: "Order not found" }, { status: 200 });
        }
    }

    // Always return 200 OK to Chapa, otherwise they will keep retrying the webhook
    return NextResponse.json({ status: "ok" });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
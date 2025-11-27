// (src/app/api/payment/initiate/route.ts)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/session";
import { chapa } from "@/lib/chapa";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Calculate Total Securely
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId) throw new Error("Invalid cart item (missing ID)");

      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      let price = product.displayPrice;
      if (item.sku) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const variant = product.variants.find((v: any) => v.sku === item.sku);
        if (variant) price = variant.price;
      }
      
      totalAmount += price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: price,
        variantSku: item.sku
      });
    }

    // 2. Transaction Reference
    const tx_ref = `TX-${uuidv4()}`;

    // 3. Create Pending Order
    await Order.create({
      userId: user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: 'Chapa',
      transactionReference: tx_ref,
      status: 'Pending Verification',
      shippingAddress
    });

    // 4. Prepare Customer Info (Prioritize Shipping Form)
    // Split full name from shipping form
    const nameParts = shippingAddress.fullName ? shippingAddress.fullName.trim().split(" ") : [];
    const firstName = nameParts[0] || user.name?.split(" ")[0] || "Guest";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : (user.name?.split(" ")[1] || "User");
    
    // Use logged-in email as primary contact for digital receipts, 
    // but you could add an email field to the shipping form if needed.
    const email = user.email || "customer@addisparts.com"; 

    // 5. Call Chapa
    const chapaResponse = await chapa.initialize({
      amount: Number(totalAmount),
      currency: "ETB",
      email: email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/verify?tx_ref=${tx_ref}`,
      customization: {
        title: "AddisParts", // 10 chars (Safe)
        description: `Order ${tx_ref.substring(0, 8)}`
      }
    });

    return NextResponse.json({ checkout_url: chapaResponse.data.checkout_url });

  } catch (error: any) {
    console.error("Payment Initiation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
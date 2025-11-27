import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/session";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, shippingAddress, screenshotUrl } = body;

    if (!screenshotUrl) {
      return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Calculate Total (Securely)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      const variant = product.variants.find((v: any) => v.sku === item.sku);
      const price = variant ? variant.price : product.displayPrice;
      totalAmount += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: price,
        variantSku: item.sku
      });
    }

    // 2. Create Order
    const order = await Order.create({
      userId: user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: 'Bank Transfer',
      paymentScreenshotUrl: screenshotUrl,
      status: 'Pending Verification',
      shippingAddress,
      activityLog: [{ action: 'Order Placed (Manual)', timestamp: new Date() }]
    });

    return NextResponse.json({ success: true, orderId: order._id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
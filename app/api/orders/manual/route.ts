/* eslint-disable @typescript-eslint/no-explicit-any */


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { getCurrentUser } from "@/lib/session";
// import { deductStock } from "@/lib/inventory"; // Import helper

// export async function POST(req: Request) {
//   const user = await getCurrentUser();
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const body = await req.json();
//     const { items, shippingAddress, screenshotUrl } = body;

//     await dbConnect();

//     // 1. Validation Loop: Check stock BEFORE creating order
//     // This prevents race conditions where 2 people buy the last item
//     const orderItems = [];
//     let totalAmount = 0;

//     for (const item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) throw new Error(`Product not found`);
      
//       const variant = product.variants.find((v: any) => v.sku === item.sku);
//       if (!variant) throw new Error(`Variant not found`);
      
//       // CRITICAL CHECK
//       if (variant.stock < item.quantity) {
//         throw new Error(`Insufficient stock for ${product.name} (${variant.sku}). Available: ${variant.stock}`);
//       }

//       const price = variant.price;
//       totalAmount += price * item.quantity;
      
//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: price,
//         variantSku: item.sku
//       });
//     }

//     // 2. Deduct Stock ATOMICALLY
//     await deductStock(orderItems);

//     // 3. Create Order
//     const order = await Order.create({
//       userId: user.id,
//       items: orderItems,
//       totalAmount,
//       paymentMethod: 'Bank Transfer',
//       paymentScreenshotUrl: screenshotUrl,
//       status: 'Pending Verification',
//       shippingAddress,
//       activityLog: [{ action: 'Order Placed (Manual)', timestamp: new Date() }]
//     });

//     return NextResponse.json({ success: true, orderId: order._id });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose"; // 1. Import Mongoose
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  
  // 2. Start a Session for Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const { items, shippingAddress, screenshotUrl } = body;

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // 3. Pass session to queries to lock the document
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Product not found: ${item.name}`);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variant = product.variants.find((v: any) => v.sku === item.sku);
      if (!variant) throw new Error(`Variant not found: ${item.sku}`);
      
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${variant.stock}`);
      }

      // 4. Deduct Stock INSIDE the transaction
      // We use updateOne directly here to ensure it's part of the session atomicity
      await Product.updateOne(
        { _id: item.productId, "variants.sku": item.sku },
        { $inc: { "variants.$.stock": -item.quantity } }
      ).session(session);

      totalAmount += variant.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: variant.price,
        variantSku: item.sku
      });
    }

    // 5. Create Order INSIDE the transaction
    // Note: create returns an array when using sessions
    const [order] = await Order.create([{
      userId: user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: 'Bank Transfer',
      paymentScreenshotUrl: screenshotUrl,
      status: 'Pending Verification',
      shippingAddress,
      activityLog: [{ action: 'Order Placed (Manual)', timestamp: new Date() }]
    }], { session });

    // 6. Commit: If we get here, save EVERYTHING
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, orderId: order._id });

  } catch (error: any) {
    // 7. Rollback: If ANY error happened above, UNDO the stock deduction
    await session.abortTransaction();
    session.endSession();
    
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
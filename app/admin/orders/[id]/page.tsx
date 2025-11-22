// src/app/admin/orders/[id]/page.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Image from "next/image";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "./actions";
import { IOrder } from "@/types/order";

// This data-fetching function is correct and does not need changes.
async function getOrderDetails(id: string) {
  await dbConnect();
  const order = await Order.findById(id)
    .populate("user", "name email")
    .lean<IOrder>();

  if (!order) notFound();
  return order;
}

// ==========================================================
// THE FIX IS APPLIED HERE, IDENTICAL TO THE PREVIOUS FIX
// ==========================================================
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // <-- Fix 1: params is a Promise
}) {
  const { id } = await params; // <-- Fix 2: await params to get the value
  const order = await getOrderDetails(id);

  return (
    <div className="grid gap-6">
      {/* Order Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Order ID: {order._id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Customer:</strong> {order.user.name} ({order.user.email})
          </p>
          <p>
            <strong>Phone:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Address:</strong> {order.shippingAddress}
          </p>
          <p>
            <strong>Status:</strong> <Badge>{order.status}</Badge>
          </p>
        </CardContent>
      </Card>

      {/* Payment Verification Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Review the payment screenshot and update the order status.
          </p>
          <Image
            src={order.paymentScreenshotUrl}
            alt="Payment Screenshot"
            width={400}
            height={600}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Update Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          {order.status === "Pending Verification" && (
            <form action={async () => { "use server"; await updateOrderStatus(id, "Processing"); }}>
              <Button>Verify & Mark as Processing</Button>
            </form>
          )}
          {order.status === "Processing" && (
            <form action={async () => { "use server"; await updateOrderStatus(id, "On Route"); }}>
              <Button>Mark as On Route</Button>
            </form>
          )}
          {order.status === "On Route" && (
            <form action={async () => { "use server"; await updateOrderStatus(id, "Delivered"); }}>
              <Button>Mark as Delivered</Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Card */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {order.activityLog.map((log, index) => (
              <li key={index}>
                <strong>{log.adminName}</strong>: {log.action} -{" "}
                {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
// src/app/admin/orders/page.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";
import { IOrder } from "@/types/order"; // <-- IMPORT THE TYPE

async function getOrders() {
  await dbConnect();
  const orders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean<IOrder[]>(); // <-- APPLY THE TYPE HERE
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              // Now TypeScript knows order._id is a string
              <TableRow key={order._id}>
                <TableCell>{order.user.name}</TableCell>
                <TableCell><Badge>{order.status}</Badge></TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order._id}`} className="text-primary hover:underline">
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
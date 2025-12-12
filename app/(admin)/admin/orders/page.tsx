// // src/app/admin/orders/page.tsx

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import dbConnect from "@/lib/mongodb";
// import Order from "@/models/Order";
// import Link from "next/link";
// import { IOrder } from "@/types/order"; // <-- IMPORT THE TYPE

// async function getOrders() {
//   await dbConnect();
//   const orders = await Order.find({})
//     .populate('user', 'name')
//     .sort({ createdAt: -1 })
//     .lean<IOrder[]>(); // <-- APPLY THE TYPE HERE
//   return orders;
// }

// export default async function OrdersPage() {
//   const orders = await getOrders();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>All Orders</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Customer</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead className="text-right">Amount</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders.map((order) => (
//               // Now TypeScript knows order._id is a string
//               <TableRow key={order._id}>
//                 <TableCell>{order.user.name}</TableCell>
//                 <TableCell><Badge>{order.status}</Badge></TableCell>
//                 <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
//                 <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
//                 <TableCell className="text-right">
//                   <Link href={`/admin/orders/${order._id}`} className="text-primary hover:underline">
//                     View Details
//                   </Link>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ExternalLink } from "lucide-react";
import OrderActions from "@/components/admin/OrderActions";


/* eslint-disable @typescript-eslint/no-explicit-any */

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Verification": return "bg-yellow-100 text-yellow-800";
    case "Processing": return "bg-blue-100 text-blue-800";
    case "On Route": return "bg-purple-100 text-purple-800";
    case "Delivered": return "bg-green-100 text-green-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100";
  }
};

async function getOrders() {
  await dbConnect();
  // Populate user info if needed, but userId reference is usually enough for list
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs">
                    {order.transactionReference?.substring(0,8) || order._id.substring(0,8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{order.shippingAddress.fullName}</span>
                      <span className="text-xs text-muted-foreground">{order.shippingAddress.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ETB {order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{order.paymentMethod}</span>
                      {order.paymentScreenshotUrl && (
                        <a 
                          href={order.paymentScreenshotUrl} 
                          target="_blank" 
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> Proof
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Client Component for Interactions */}
                    <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
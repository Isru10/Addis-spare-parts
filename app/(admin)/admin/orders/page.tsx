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
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User"; // Ensure User model is registered
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import OrderActions from "@/components/admin/OrderActions";
import AdminSearch from "@/components/admin/AdminSearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

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

async function getOrders(page: number, query: string) {
  await dbConnect();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (query) {
    filter.$or = [
      { "shippingAddress.fullName": { $regex: query, $options: "i" } },
      { "shippingAddress.phone": { $regex: query, $options: "i" } },
      { transactionReference: { $regex: query, $options: "i" } } // Also search by Transaction ID
    ];
  }

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const ordersPromise = Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean();

  const countPromise = Order.countDocuments(filter);

  const [orders, count] = await Promise.all([ordersPromise, countPromise]);
  
  return {
    orders: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(count / ITEMS_PER_PAGE)
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q || "";

  const { orders, totalPages } = await getOrders(page, query);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage standard inventory orders.</p>
        </div>
        <AdminSearch placeholder="Search name, phone, or ref..." />
      </div>

      <Card>
        <CardContent className="p-0">
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
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs">
                    {/* {order.transactionReference?.substring(0,8) || order._id.substring(0,8)} */}

                    <Link 
                      href={`/admin/orders/${order._id}`} 
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {order.transactionReference?.substring(0,8) || order._id.substring(0,8)}
                    </Link>
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
                    <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 ? (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${page - 1}&q=${query}`} />
                </PaginationItem>
              ) : null}
              
              <PaginationItem>
                <span className="px-4 text-sm font-medium">Page {page} of {totalPages}</span>
              </PaginationItem>

              {page < totalPages ? (
                <PaginationItem>
                  <PaginationNext href={`?page=${page + 1}&q=${query}`} />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
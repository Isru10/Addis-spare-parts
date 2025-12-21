




// import Link from "next/link";
// import dbConnect from "@/lib/mongodb";
// import PartRequestOrder from "@/models/PartRequestOrder";
// import "@/models/PartRequest"; 
// import "@/models/User";
// import { 
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Eye } from "lucide-react";
// import RequestOrderActions from "@/components/admin/requests/RequestOrderActions";
// import AdminSearch from "@/components/admin/AdminSearch"; // Search Component
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";



// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import PartRequest from "@/models/PartRequest";
// import "@/models/PartRequest"
// import "@/models/User";


// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const dynamic = "force-dynamic";

// const ITEMS_PER_PAGE = 10;

// // Logistics Status Colors
// const getLogisticsBadge = (status: string) => {
//   switch (status) {
//     case "Order Placed": return "bg-gray-100 text-gray-800";
//     case "Shipped to Warehouse": return "bg-blue-100 text-blue-800";
//     case "Customs Clearance": return "bg-yellow-100 text-yellow-800 animate-pulse";
//     case "Ready for Pickup": return "bg-green-100 text-green-800";
//     case "Delivered": return "bg-green-600 text-white";
//     default: return "bg-gray-100";
//   }
// };

// async function getRequestOrders(page: number, query: string) {
//   await dbConnect();
  
//   // Build Search Filter
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const filter: any = {};
//   if (query) {
//     filter.$or = [
//       { "shippingAddress.fullName": { $regex: query, $options: "i" } },
//       { "shippingAddress.phone": { $regex: query, $options: "i" } },
//       // Note: Searching by Part Name requires aggregation or population match which is complex. 
//       // Searching by Customer/Phone is usually enough for admins.
//     ];
//   }

//   const skip = (page - 1) * ITEMS_PER_PAGE;

//   const ordersPromise = PartRequestOrder.find(filter)
//     .populate({
//       path: "requestId",
//       select: "partDetails.partName vehicleDetails.make vehicleDetails.model"
//     })
//     .populate("userId", "name email")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(ITEMS_PER_PAGE)
//     .lean();

//   const countPromise = PartRequestOrder.countDocuments(filter);

//   const [orders, count] = await Promise.all([ordersPromise, countPromise]);
  
//   return {
//     orders: JSON.parse(JSON.stringify(orders)),
//     totalPages: Math.ceil(count / ITEMS_PER_PAGE)
//   };
// }

// interface PageProps {
//   searchParams: Promise<{ page?: string; q?: string }>;
// }

// export default async function RequestOrdersPage({ searchParams }: PageProps) {
//   const params = await searchParams;
//   const page = Number(params.page) || 1;
//   const query = params.q || "";

//   const { orders, totalPages } = await getRequestOrders(page, query);

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Special Orders</h1>
//           <p className="text-muted-foreground">Manage logistics and payment verification.</p>
//         </div>
        
//         {/* Search Bar */}
//         <AdminSearch placeholder="Search customer or phone..." />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Order Date</TableHead>
//               <TableHead>Part Details</TableHead>
//               <TableHead>Customer</TableHead>
//               <TableHead>Payment</TableHead>
//               <TableHead>Logistics Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//             {orders.map((order: any) => (
//               <TableRow key={order._id}>
//                 <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </TableCell>
                
//                 <TableCell>
//                   {order.requestId ? (
//                     <div className="flex flex-col">
//                       <span className="font-semibold text-sm">{order.requestId.partDetails.partName}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {order.requestId.vehicleDetails.make} {order.requestId.vehicleDetails.model}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-red-500 text-xs">Original Request Deleted</span>
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   <div className="flex flex-col">
//                     <span className="text-sm">{order.shippingAddress.fullName}</span>
//                     <span className="text-xs text-muted-foreground">{order.shippingAddress.phone}</span>
//                   </div>
//                 </TableCell>

//                 <TableCell>
//                   <div className="flex flex-col gap-1">
//                     <span className="font-bold text-sm">ETB {order.totalAmount.toLocaleString()}</span>
//                     {order.paymentScreenshot && (
//                       <a 
//                         href={order.paymentScreenshot} 
//                         target="_blank" 
//                         className="text-xs text-blue-600 hover:underline flex items-center gap-1"
//                       >
//                         <Eye className="h-3 w-3" /> View Receipt
//                       </a>
//                     )}
//                   </div>
//                 </TableCell>

//                 <TableCell>
//                   <Badge className={`border-0 whitespace-nowrap ${getLogisticsBadge(order.logisticsStatus)}`}>
//                     {order.logisticsStatus === 'Order Placed' ? 'Pending Verify' : order.logisticsStatus}
//                   </Badge>
//                 </TableCell>

//                 <TableCell className="text-right">
//                   <RequestOrderActions order={order} />
//                 </TableCell>
//               </TableRow>
//             ))}
//             {orders.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-24 text-center">
//                     No orders found.
//                   </TableCell>
//                 </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center">
//           <Pagination>
//             <PaginationContent>
//               {page > 1 ? (
//                 <PaginationItem>
//                   <PaginationPrevious href={`?page=${page - 1}&q=${query}`} />
//                 </PaginationItem>
//               ) : null}
              
//               <PaginationItem>
//                 <span className="px-4 text-sm font-medium">Page {page} of {totalPages}</span>
//               </PaginationItem>

//               {page < totalPages ? (
//                 <PaginationItem>
//                   <PaginationNext href={`?page=${page + 1}&q=${query}`} />
//                 </PaginationItem>
//               ) : null}
//             </PaginationContent>
//           </Pagination>
//         </div>
//       )}
//     </div>
//   );
// }

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import PartRequestOrder from "@/models/PartRequestOrder";
import "@/models/PartRequest"; 
import "@/models/InsuranceRequest";
import "@/models/User";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import RequestOrderActions from "@/components/admin/requests/RequestOrderActions";
import AdminSearch from "@/components/admin/AdminSearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

const getLogisticsBadge = (status: string) => {
  switch (status) {
    case "Order Placed": return "bg-gray-100 text-gray-800";
    case "Shipped to Warehouse": return "bg-blue-100 text-blue-800";
    case "Customs Clearance": return "bg-yellow-100 text-yellow-800 animate-pulse";
    case "Ready for Pickup": return "bg-green-100 text-green-800";
    case "Delivered": return "bg-green-600 text-white";
    default: return "bg-gray-100";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOrderContext = (order: any) => {
  const req = order.requestId;
  
  if (!req) return { title: "Unknown Request", subtitle: "Deleted or Missing", isInsurance: false };

  if (order.requestType === 'InsuranceRequest' || req.claimReferenceNumber) {
    return {
      title: `Claim #${req.claimReferenceNumber}`,
      subtitle: req.vehicleDetails ? `${req.vehicleDetails.year} ${req.vehicleDetails.make}` : "Vehicle Info N/A",
      isInsurance: true
    };
  }

  return {
    title: req.partDetails?.partName || "Part Request",
    subtitle: req.vehicleDetails ? `${req.vehicleDetails.make} ${req.vehicleDetails.model}` : "Vehicle Info N/A",
    isInsurance: false
  };
};

async function getRequestOrders(page: number, query: string) {
  await dbConnect();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (query) {
    filter.$or = [
      { "shippingAddress.fullName": { $regex: query, $options: "i" } },
      { "shippingAddress.phone": { $regex: query, $options: "i" } },
    ];
  }

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const ordersPromise = PartRequestOrder.find(filter)
    .populate("requestId")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean();

  const countPromise = PartRequestOrder.countDocuments(filter);

  const [orders, count] = await Promise.all([ordersPromise, countPromise]);
  
  return {
    orders: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(count / ITEMS_PER_PAGE)
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function RequestOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q || "";

  const { orders, totalPages } = await getRequestOrders(page, query);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Special Orders</h1>
          <p className="text-muted-foreground">Manage logistics and payment verification.</p>
        </div>
        <AdminSearch placeholder="Search customer or phone..." />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Logistics Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {orders.map((order: any) => {
              const { title, subtitle, isInsurance } = getOrderContext(order);

              return (
                <TableRow key={order._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{title}</span>
                      <span className="text-xs text-muted-foreground">{subtitle}</span>
                      {isInsurance && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded w-fit mt-1 font-medium">
                          Insurance Claim
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{order.shippingAddress?.fullName || "N/A"}</span>
                      <span className="text-xs text-muted-foreground">{order.shippingAddress?.phone}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm">ETB {order.totalAmount.toLocaleString()}</span>
                      {order.paymentScreenshot && (
                        <a 
                          href={order.paymentScreenshot} 
                          target="_blank" 
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> View Receipt
                        </a>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={`border-0 whitespace-nowrap ${getLogisticsBadge(order.logisticsStatus)}`}>
                      {order.logisticsStatus === 'Order Placed' ? 'Pending Verify' : order.logisticsStatus}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <RequestOrderActions order={order} />
                  </TableCell>
                </TableRow>
              );
            })}
            {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

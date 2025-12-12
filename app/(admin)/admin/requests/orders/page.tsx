import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import PartRequestOrder from "@/models/PartRequestOrder";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Eye, PackageCheck } from "lucide-react";
import RequestOrderActions from "@/components/admin/requests/RequestOrderActions";
import PartRequest from "@/models/PartRequest";
import "@/models/PartRequest"


/* eslint-disable @typescript-eslint/no-explicit-any */

// Logistics Status Colors
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

async function getRequestOrders() {
  await dbConnect();
  // Populate requestId to get the Part Name (from the original request)
  // Populate userId to get Customer Name
  const orders = await PartRequestOrder.find({})
    .populate({
      path: "requestId",
      select: "partDetails.partName vehicleDetails.make vehicleDetails.model"
    })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
  
  return JSON.parse(JSON.stringify(orders));
}

export default async function RequestOrdersPage() {
  const orders = await getRequestOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Special Orders</h1>
          <p className="text-muted-foreground">Manage logistics and payment verification for import orders.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Part Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Logistics Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell>
                    {order.requestId ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{order.requestId.partDetails.partName}</span>
                        <span className="text-xs text-muted-foreground">
                          {order.requestId.vehicleDetails.make} {order.requestId.vehicleDetails.model}
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-500 text-xs">Original Request Deleted</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{order.shippingAddress.fullName}</span>
                      <span className="text-xs text-muted-foreground">{order.shippingAddress.phone}</span>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
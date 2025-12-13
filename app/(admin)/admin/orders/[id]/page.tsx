// src/app/admin/orders/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { IOrder, IOrderUser, IOrderItem, IOrderActivity } from "@/types/order"; // Import IOrderItem
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, MapPin, CreditCard, Package, Calendar, User, Eye 
} from "lucide-react";
import OrderActions from "@/components/admin/OrderActions";
export const dynamic = "force-dynamic";

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Verification": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Processing": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "On Route": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-100";
    default: return "bg-gray-100 text-gray-800";
  }
};

async function getOrder(id: string) {
  await dbConnect();
  const order = await Order.findById(id)
    .populate('userId', 'name email')
    .lean<IOrder>();
  
  if (!order) return null;
  return JSON.parse(JSON.stringify(order));
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  // Type Guard: Check if userId is populated
  const userEmail = typeof order.userId === 'object' && 'email' in order.userId 
    ? (order.userId as IOrderUser).email 
    : 'N/A';

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order #{order._id.substring(0,8)}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
             {order.status}
           </Badge>
           <OrderActions order={order} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: IOrderItem, idx: number) => (
                <div key={idx} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground shrink-0">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ETB {item.price}</p>
                      {item.variantSku && <p className="text-[10px] font-mono text-muted-foreground">SKU: {item.variantSku}</p>}
                    </div>
                  </div>
                  <p className="font-bold text-sm">ETB {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">ETB {order.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Method
                </span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              
              {order.paymentMethod === 'Chapa' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction Ref</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{order.transactionReference}</span>
                </div>
              )}

              {order.paymentMethod === 'Bank Transfer' && order.paymentScreenshotUrl && (
                <div className="pt-2">
                  <span className="text-sm text-muted-foreground mb-2 block">Payment Proof</span>
                  <a href={order.paymentScreenshotUrl} target="_blank" className="relative block h-48 w-full bg-muted rounded-lg overflow-hidden border hover:opacity-90 transition-opacity">
                    <Image 
                      src={order.paymentScreenshotUrl} 
                      alt="Receipt" 
                      fill 
                      className="object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm"><Eye className="mr-2 h-4 w-4"/> View Full Image</Button>
                    </div>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR: Customer & Shipping */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary"><User className="h-4 w-4"/></div>
                <div>
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-700 p-2 rounded-full mt-0.5"><MapPin className="h-4 w-4"/></div>
                <div className="space-y-1">
                  <p>{order.shippingAddress.subCity}, {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.woreda && `Woreda: ${order.shippingAddress.woreda}`}</p>
                  <p>{order.shippingAddress.houseNumber && `House No: ${order.shippingAddress.houseNumber}`}</p>
                  <p className="font-mono text-xs pt-1">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log (Audit Trail) */}
          <Card>
            <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 border-l-2 border-muted pl-4 ml-1">
                {order.activityLog.map((log:IOrderActivity, i:number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/session";
import { IOrder, IOrderItem } from "@/types/order"; // Import IOrderItem
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Package, Calendar } from "lucide-react";

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Verification": return "bg-yellow-100 text-yellow-800";
    case "Processing": return "bg-blue-100 text-blue-800";
    case "On Route": return "bg-purple-100 text-purple-800";
    case "Delivered": return "bg-green-100 text-green-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

async function getOrder(id: string, userId: string) {
  await dbConnect();
  // Ensure the user owns the order!
  const order = await Order.findOne({ _id: id, userId }).lean<IOrder>();
  if (!order) return null;
  return JSON.parse(JSON.stringify(order));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const order = await getOrder(id, user.id);

  if (!order) notFound();

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              #{order._id.substring(0,8)} • <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={`text-sm px-4 py-1.5 ${getStatusColor(order.status)}`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Items Ordered</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* FIX: Explicit types added here */}
              {order.items.map((item: IOrderItem, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <Package className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    {item.variantSku && <p className="text-xs text-muted-foreground font-mono mt-1">SKU: {item.variantSku}</p>}
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-medium">ETB {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>ETB {order.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="text-muted-foreground">
                  <p className="text-foreground font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.subCity}, {order.shippingAddress.city}</p>
                  {order.shippingAddress.houseNumber && <p>House No: {order.shippingAddress.houseNumber}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.paymentMethod}</p>
              {order.paymentMethod === 'Bank Transfer' && (
                <p className="text-xs text-muted-foreground mt-1">Manual Verification</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
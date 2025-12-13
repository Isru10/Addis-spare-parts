import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/session";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import "@/models/User";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

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

async function getUserOrders(userId: string) {
  await dbConnect();
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(orders));
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await getUserOrders(user.id);

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8" /> My Orders
        </h1>
        <Button asChild variant="outline">
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">You haven not placed any orders yet.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order._id} className="overflow-hidden border shadow-sm">
              {/* Order Header */}
              <div className="bg-muted/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Order <span className="font-mono text-muted-foreground">#{order.transactionReference|| order._id}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", { 
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <p className="text-sm font-bold">ETB {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center shrink-0">
                         <Package className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                           <span>Qty: {item.quantity}</span>
                           <span>Price: ETB {item.price}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ETB {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Footer Info */}
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-semibold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                      <MapPin className="h-3 w-3" /> Shipping Details
                    </h5>
                    <div className="text-foreground/80 space-y-0.5 pl-5">
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.subCity}, {order.shippingAddress.city}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                      <CreditCard className="h-3 w-3" /> Payment Info
                    </h5>
                    <div className="text-foreground/80 pl-5">
                      <p>{order.paymentMethod}</p>
                      {order.paymentScreenshotUrl && (
                        <a href={order.paymentScreenshotUrl} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 block">View Receipt</a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
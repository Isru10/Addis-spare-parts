/* eslint-disable @typescript-eslint/no-explicit-any */



import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/session";
import { 
  Card, CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, MapPin, Calendar, CreditCard, ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5; // Fewer items per page for user history feels cleaner

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

async function getUserOrders(userId: string, page: number) {
  await dbConnect();
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const ordersPromise = Order.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean();

  const countPromise = Order.countDocuments({ userId });

  const [orders, count] = await Promise.all([ordersPromise, countPromise]);
  
  return {
    orders: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(count / ITEMS_PER_PAGE)
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { orders, totalPages } = await getUserOrders(user.id, page);

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
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
            <Link key={order._id} href={`/orders/${order._id}`} className="block group">
              <Card className="overflow-hidden border shadow-sm group-hover:border-primary/50 transition-colors">
                
                {/* Order Header */}
                <div className="bg-muted/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      Order <span className="font-mono text-muted-foreground">#{order.transactionReference?.substring(0,8) || order._id.substring(0,8)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
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
                  {/* Item Preview (First 2 Items) */}
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                           <Package className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted-foreground pl-14">
                        + {order.items.length - 2} more items...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 ? (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${page - 1}`} />
                </PaginationItem>
              ) : null}
              
              <PaginationItem>
                <span className="px-4 text-sm font-medium">Page {page} of {totalPages}</span>
              </PaginationItem>

              {page < totalPages ? (
                <PaginationItem>
                  <PaginationNext href={`?page=${page + 1}`} />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
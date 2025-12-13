// src/app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { BaggageClaim, BarChart4, ShoppingBag, UserCircle } from "lucide-react";
export const dynamic = "force-dynamic";

async function getStats() {
  await dbConnect();
  // Run queries in parallel for maximum efficiency
  const [productCount, userCount, pendingOrderCount] = await Promise.all([
    Product.countDocuments({}),
    User.countDocuments({}),
    Order.countDocuments({ status: 'Pending Verification' })
  ]);
  return { productCount, userCount, pendingOrderCount };
}

export default async function AdminDashboardPage() {
  const { productCount, userCount, pendingOrderCount } = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <BaggageClaim className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrderCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment verification</p>
          </CardContent>
        </Card>
      </div>
      {/* More components for recent orders or sales charts can be added here */}
    </div>
  );
}
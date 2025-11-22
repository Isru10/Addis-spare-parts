// src/app/superadmin/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { DollarSign, Package, Users } from "lucide-react";
import mongoose from "mongoose";

// Use efficient queries to get all stats in one go
async function getSiteAnalytics() {
  await dbConnect();

  const [userCount, productCount, orderStats] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    userCount,
    productCount,
    totalSales: orderStats[0]?.totalSales || 0,
    totalOrders: orderStats[0]?.totalOrders || 0,
  };
}

export default async function SuperAdminDashboardPage() {
  const { userCount, productCount, totalSales, totalOrders } = await getSiteAnalytics();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
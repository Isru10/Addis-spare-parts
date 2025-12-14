import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import PartRequestOrder from "@/models/PartRequestOrder";
import Product from "@/models/Product";
import PartRequest from "@/models/PartRequest";
// CRITICAL: Import User model to prevent "MissingSchemaError" when populating
import "@/models/User"; 

import { OverviewChart } from "@/components/admin/dashboard/OverviewChart";
import { RequestsVsOrdersChart } from "@/components/admin/dashboard/RequestsVsOrdersChart";
import { RecentSales } from "@/components/admin/dashboard/RecentSales";
import { LowStock } from "@/components/admin/dashboard/LowStock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Activity } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

// Ensure this page is not statically cached by Vercel
export const dynamic = "force-dynamic";

async function getDashboardData() {
  await dbConnect();

  // 1. Get Financial Totals
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, sum: { $sum: "$totalAmount" } } }
  ]);
  
  const totalSpecialRevenue = await PartRequestOrder.aggregate([
    { $group: { _id: null, sum: { $sum: "$totalAmount" } } }
  ]);

  const grandTotal = (totalRevenue[0]?.sum || 0) + (totalSpecialRevenue[0]?.sum || 0);
  
  // 2. Get Counts
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const activeRequests = await PartRequest.countDocuments({ status: { $in: ['Pending Review', 'Quoted'] } });

  // 3. Get Revenue Data (Bar Chart - Last 6 Months)
  const monthlyRevenue = await Order.aggregate([
    { 
      $match: { 
        status: { $ne: "Cancelled" },
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } 
      } 
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 }
      }
    }
  ]);

  const chartData = [0, 1, 2, 3, 4, 5].map((i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthIndex = d.getMonth() + 1;
    const found = monthlyRevenue.find((m) => m._id === monthIndex);
    return {
      name: d.toLocaleString('default', { month: 'short' }),
      total: found ? found.total : 0,
      count: found ? found.count : 0
    };
  }).reverse();

  // 4. Get Comparison Data (Line Chart: Orders vs Requests)
  const orderTrends = await Order.aggregate([
    { 
      $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } 
    },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);

  const requestTrends = await PartRequest.aggregate([
    { 
      $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } 
    },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);

  const comparisonData = [0, 1, 2, 3, 4, 5].map((i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthIndex = d.getMonth() + 1;
    
    const orderCount = orderTrends.find((o) => o._id === monthIndex)?.count || 0;
    const reqCount = requestTrends.find((r) => r._id === monthIndex)?.count || 0;

    return {
      month: d.toLocaleString('default', { month: 'short' }),
      orders: orderCount,
      requests: reqCount
    };
  }).reverse();

  // 5. Get Low Stock Items
  // Look for products where ANY variant has stock <= 5
  const lowStockRaw = await Product.find({
    "variants.stock": { $lte: 5 },
    isActive: true
  }).select("name variants").limit(5).lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lowStockItems = lowStockRaw.map((p: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lowVariant = p.variants.find((v: any) => v.stock <= 5);
    return {
      id: p._id.toString(),
      name: p.name,
      sku: lowVariant?.sku || "N/A",
      stock: lowVariant?.stock || 0
    };
  });

  // 6. Get Recent Sales (Merge Standard + Special Orders)
  const recentStandard = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email")
    .lean();
    
  const recentSpecial = await PartRequestOrder.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name email")
    .lean();

  // Merge, Sort by Date, Take Top 5
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allSalesRaw = [...recentStandard.map((o: any) => ({ ...o, type: 'Standard' })), ...recentSpecial.map((o: any) => ({ ...o, type: 'Special' }))]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allSales = allSalesRaw.map((sale: any) => ({
    id: sale._id.toString(),
    name: sale.userId?.name || sale.shippingAddress?.fullName || "Guest",
    email: sale.userId?.email || "N/A",
    amount: sale.totalAmount,
    type: sale.type
  }));

  return { grandTotal, totalOrders, totalProducts, activeRequests, chartData, comparisonData, lowStockItems, allSales };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* TOP CARDS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {data.grandTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined Sales & Requests</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standard Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Inventory purchases</p>
          </CardContent>
        </Card>

        {/* Active Parts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in catalog</p>
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeRequests}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN GRAPHS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Revenue Chart (Bar) */}
        <div className="col-span-4">
            <OverviewChart data={data.chartData} />
        </div>
        
        {/* Comparison Chart (Line) */}
        <div className="col-span-3">
            <RequestsVsOrdersChart data={data.comparisonData} />
        </div>
      </div>

      {/* BOTTOM ROW: RECENT SALES & LOW STOCK */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Sales List */}
        <RecentSales sales={data.allSales as any} />
        
        {/* Low Stock Alerts */}
        <LowStock items={data.lowStockItems} />
      </div>
    </div>
  );
}
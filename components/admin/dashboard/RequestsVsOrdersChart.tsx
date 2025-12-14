"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartProps {
  data: {
    month: string;
    orders: number;
    requests: number;
  }[];
}

export function RequestsVsOrdersChart({ data }: ChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sales Source Trends</CardTitle>
        <CardDescription>Comparing Inventory Sales vs Special Requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                fontSize={12}
                stroke="#888888"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                fontSize={12}
                stroke="#888888"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              
              {/* Line 1: Standard Orders (Blue) */}
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#2563EB" // Blue
                strokeWidth={2}
                dot={false}
                name="Inventory Sales"
                activeDot={{ r: 4 }}
              />
              
              {/* Line 2: Special Requests (Purple/Orange) */}
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#F97316" // Orange
                strokeWidth={2}
                dot={false}
                name="Special Requests"
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
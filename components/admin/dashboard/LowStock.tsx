import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

export function LowStock({ items }: { items: StockItem[] }) {
  return (
    <Card className="col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" /> 
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Items with less than 5 units remaining.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="space-y-1">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="destructive" className="h-6">
                  {item.stock} left
                </Badge>
              </div>
            </div>
          ))}
          
          {items.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">Inventory looks healthy!</p>
          ) : (
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/products">
                Manage Inventory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
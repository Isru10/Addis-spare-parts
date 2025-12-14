import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SaleItem {
  id: string;
  name: string;
  email: string;
  amount: number;
  type: "Standard" | "Special";
}

export function RecentSales({ sales }: { sales: SaleItem[] }) {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{sale.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.name}</p>
                <p className="text-xs text-muted-foreground">{sale.email}</p>
              </div>
              <div className="ml-auto font-medium">
                +ETB {sale.amount.toLocaleString()}
                <span className="block text-[10px] text-muted-foreground text-right font-normal">
                  {sale.type}
                </span>
              </div>
            </div>
          ))}
          {sales.length === 0 && <p className="text-muted-foreground text-sm">No recent sales.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
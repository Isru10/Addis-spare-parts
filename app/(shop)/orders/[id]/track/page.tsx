import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import PartRequestOrder from "@/models/PartRequestOrder";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { CheckCircle2, Truck, Plane, Package, MapPin } from "lucide-react";
export const dynamic = "force-dynamic";


/* eslint-disable @typescript-eslint/no-explicit-any */

const STEPS = [
  { status: 'Order Placed', label: 'Order Placed', icon: CheckCircle2 },
  { status: 'Shipped to Warehouse', label: 'Shipped to Warehouse', icon: Plane },
  { status: 'Customs Clearance', label: 'Customs Clearance', icon: MapPin },
  { status: 'Ready for Pickup', label: 'Ready for Pickup', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: Package },
];

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  
  // Find order by the REQUEST ID (since user clicks from Request page)
  // OR create a direct link logic. Let's assume we find by RequestId for easier linking.
  const order : any= await PartRequestOrder.findOne({ requestId: id }).lean();

  if (!order) return <div className="p-8 text-center">Order not found yet. Payment might be verifying.</div>;

  const currentStepIndex = STEPS.findIndex(s => s.status === order.logisticsStatus);

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
      
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex justify-between items-center text-lg">
            <span>Tracking ID: {order._id.toString().substring(0,8)}</span>
            <span className="text-sm font-normal text-muted-foreground">
              ETA: Check Quote
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />

            <div className="space-y-8">
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.status} className="relative flex items-center gap-6">
                    {/* Icon Bubble */}
                    <div className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4
                      ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-background border-muted text-muted-foreground'}
                      ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                    `}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    
                    {/* Text */}
                    <div className={isCompleted ? 'text-foreground' : 'text-muted-foreground'}>
                      <h3 className="font-semibold text-lg">{step.label}</h3>
                      {isCurrent && <p className="text-sm text-primary font-medium animate-pulse">Current Status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
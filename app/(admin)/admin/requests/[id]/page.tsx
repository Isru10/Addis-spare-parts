import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Calendar, User, FileText, DollarSign } from "lucide-react";
import RequestActions from "@/components/admin/requests/RequestActions"; // Reuse the actions
import "@/models/User";


export const dynamic = "force-dynamic";


async function getRequest(id: string) {
  await dbConnect();
  const req = await PartRequest.findById(id).populate("userId", "name email phone").lean();
  return JSON.parse(JSON.stringify(req));
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) return <div>Request not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/requests"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Request #{request._id.substring(0,8)}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Created {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="text-base px-3 py-1 bg-background">{request.status}</Badge>
           <RequestActions request={request} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vehicle & Part Info */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5"/> Vehicle Details</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Make & Model</span>
                <span className="font-semibold text-lg">{request.vehicleDetails.year} {request.vehicleDetails.make} {request.vehicleDetails.model}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">VIN / Chassis</span>
                <span className="font-mono bg-muted px-2 py-1 rounded">{request.vehicleDetails.vin || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Engine / Trim</span>
                <span>{request.vehicleDetails.trim || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Transmission</span>
                <span>{request.vehicleDetails.transmission}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Part Requested</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-bold text-lg">{request.partDetails.partName}</h3>
                  <p className="text-sm text-muted-foreground">Qty: {request.partDetails.quantity}</p>
                </div>
                <Badge variant="secondary">{request.partDetails.condition}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Customer Notes</span>
                <p className="bg-muted/30 p-3 rounded-md text-sm italic">{request.partDetails.description}</p>
              </div>
              
              {/* Images faGrid */}
              {request.images && request.images.length > 0 && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-2">Reference Photos</span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {request.images.map((img: string, i: number) => (
                      <a key={i} href={img} target="_blank" className="relative h-24 w-24 rounded-md overflow-hidden border hover:opacity-90 block shrink-0">
                        <Image src={img} alt="Part" fill className="object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Quote (If exists) */}
          {request.quote?.price && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader><CardTitle className="text-blue-700 flex items-center gap-2"><DollarSign className="h-5 w-5"/> Active Quote</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Price Quoted</span>
                  <span className="text-xl font-bold">ETB {request.quote.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">ETA</span>
                  <span className="font-medium">{request.quote.estimatedArrival} via {request.quote.shippingMethod}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Admin Note</span>
                  <p className="text-sm">{request.quote.adminNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Customer</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{request.userId?.name}</p>
              <p className="text-muted-foreground">{request.userId?.email}</p>
              <p className="text-muted-foreground">{request.userId?.phone || "No phone provided"}</p>
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <a href={`mailto:${request.userId?.email}`}>Email Customer</a>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
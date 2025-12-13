import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import { getCurrentUser } from "@/lib/session";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, ChevronRight, Clock } from "lucide-react";
import RequestOfferDialog from "@/components/request/RequestOfferDialog";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Status Badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Review": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Quoted": return "bg-blue-100 text-blue-800 hover:bg-blue-100 animate-pulse"; // Pulse to catch attention
    case "Ordered": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Completed": return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Rejected": return "bg-red-100 text-red-800 hover:bg-red-100";
    default: return "bg-gray-100 text-gray-800";
  }
};

async function getUserRequests(userId: string) {
  await dbConnect();
  const requests = await PartRequest.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(requests));
}

export default async function MyRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await getUserRequests(user.id);

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-8 w-8" /> Part Requests
        </h1>
        <Button asChild>
          <Link href="/request-part">New Request</Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-6">Need a specific part? Let us find it for you.</p>
            <Button asChild>
              <Link href="/request-part">Request a Part</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <Card key={req._id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                {/* Info Block */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge className={getStatusBadge(req.status)}>{req.status}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{req.partDetails.partName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {req.vehicleDetails.year} {req.vehicleDetails.make} {req.vehicleDetails.model}
                  </p>
                </div>

                {/* Action Block */}
                <div>
                  {req.status === 'Quoted' ? (
                    // Show "View Offer" if Admin responded
                    <RequestOfferDialog request={req} />
                  ) : req.status === 'Ordered' ? (
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${req._id}/track`}>View Order Status</Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled>Processing...</Button>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
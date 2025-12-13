import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import PartRequest from "@/models/PartRequest";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Clock, FileText, CheckCircle2, XCircle } from "lucide-react";
import RequestActions from "@/components/admin/requests/RequestActions"; // We'll create this
import "@/models/User";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";


const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Quoted": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Ordered": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Completed": return "bg-green-100 text-green-800 border-green-200";
    case "Rejected": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800";
  }
};

async function getRequests() {
  await dbConnect();
  // Fetch requests, sort by newest
  // Populate User to see who asked
  const requests = await PartRequest.find({})
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 })
    .lean();
  
  return JSON.parse(JSON.stringify(requests));
}

export default async function AdminRequestsPage() {
  const requests = await getRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Part Requests</h1>
          <p className="text-muted-foreground">Manage special order inquiries and quotes.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      {/* Summary Cards (Optional but cool) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter((r: any) => r.status === 'Pending Review').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter((r: any) => r.status === 'Quoted').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted Orders</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter((r: any) => r.status === 'Ordered').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Part Requested</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req: any) => (
                <TableRow key={req._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{req.vehicleDetails.year} {req.vehicleDetails.make}</span>
                      <span className="text-xs text-muted-foreground">{req.vehicleDetails.model}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{req.partDetails.partName}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={req.partDetails.description}>
                        {req.partDetails.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{req.userId?.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{req.userId?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RequestActions request={req} />
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
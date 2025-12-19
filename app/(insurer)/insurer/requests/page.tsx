import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import InsurerProfile from "@/models/InsurerProfile";
import { getCurrentUser } from "@/lib/session";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, FileText, Download } from "lucide-react";

export const dynamic = "force-dynamic";

// Helper for status styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Submitted': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200';
    case 'Quoted': return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 animate-pulse'; // Highlight quoted ones
    case 'Accepted': return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
    case 'Declined': return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
    case 'Expired': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-50 text-gray-600';
  }
};

async function getRequests(userId: string, query: string) {
  await dbConnect();
  
  // 1. Get Profile
  const profile = await InsurerProfile.findOne({ userId });
  if (!profile) return [];

  // 2. Build Query (Search by Claim Ref or Plate)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { insurerId: profile._id };
  if (query) {
    filter.$or = [
      { claimReferenceNumber: { $regex: query, $options: 'i' } },
      { "vehicleDetails.plateNumber": { $regex: query, $options: 'i' } }
    ];
  }

  const requests = await InsuranceRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(50) // Limit to recent 50 for performance, add pagination later if needed
    .lean();

  return JSON.parse(JSON.stringify(requests));
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function InsurerRequestsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const query = params.q || "";
  
  const requests = await getRequests(user.id, query);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Claims</h1>
          <p className="text-slate-500 text-sm">Manage proforma requests and view quotations.</p>
        </div>
        
        {/* Search Bar (Simple Form for Server Side Search) */}
        <form className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            name="q" 
            placeholder="Search Claim # or Plate..." 
            className="pl-9 bg-white"
            defaultValue={query}
          />
        </form>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Claim Reference</TableHead>
              <TableHead>Vehicle Info</TableHead>
              <TableHead>Parts Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {requests.map((req: any) => (
              <TableRow key={req._id} className="hover:bg-slate-50/50">
                <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString()}
                </TableCell>
                
                <TableCell className="font-mono font-medium text-slate-900">
                  {req.claimReferenceNumber}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-slate-700">
                      {req.vehicleDetails.year} {req.vehicleDetails.make} {req.vehicleDetails.model}
                    </span>
                    <span className="text-xs text-slate-400">
                      Plate: {req.vehicleDetails.plateNumber || "N/A"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600">
                  {req.requestedPartsList?.length || 0} items
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={`border ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  {req.status === 'Quoted' || req.status === 'Accepted' ? (
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8">
                      <Link href={`/insurer/requests/${req._id}`}>
                        <Eye className="mr-2 h-3 w-3" /> View Quote
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" size="sm" className="h-8">
                      <Link href={`/insurer/requests/${req._id}`}>
                        Details
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No claims found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import "@/models/InsurerProfile"; // Register model
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Submitted': return 'bg-yellow-100 text-yellow-800';
    case 'Quoted': return 'bg-blue-100 text-blue-800';
    case 'Accepted': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100';
  }
};

async function getClaims() {
  await dbConnect();
  const claims = await InsuranceRequest.find({})
    .populate('insurerId', 'companyName branchName') // Show which insurance sent it
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return JSON.parse(JSON.stringify(claims));
}

export default async function AdminInsurancePage() {
  const claims = await getClaims();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance Claims</h1>
          <p className="text-muted-foreground">Manage incoming proforma requests from partners.</p>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Claim Ref</TableHead>
              <TableHead>Insurance Co.</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {claims.map((claim: any) => (
              <TableRow key={claim._id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {claim.claimReferenceNumber}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{claim.insurerId?.companyName || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{claim.insurerId?.branchName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {claim.vehicleDetails.year} {claim.vehicleDetails.make} {claim.vehicleDetails.model}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-0 ${getStatusBadge(claim.status)}`}>
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant={claim.status === 'Submitted' ? 'default' : 'outline'}>
                    <Link href={`/admin/insurance/${claim._id}`}>
                      {claim.status === 'Submitted' ? 'Create Quote' : 'View Details'}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
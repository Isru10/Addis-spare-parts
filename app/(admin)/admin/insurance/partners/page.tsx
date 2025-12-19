import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import InsurerProfile from "@/models/InsurerProfile";
import "@/models/User"; // Ensure User is registered
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileCheck } from "lucide-react";
import PartnerActions from "@/components/admin/insurance/PartnerActions";


export const dynamic = "force-dynamic";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 animate-pulse';
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100';
  }
};

async function getPartners() {
  await dbConnect();
  // Populate the User to see who registered
  const partners = await InsurerProfile.find({})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(partners));
}

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance Partners</h1>
          <p className="text-muted-foreground">Approve or manage insurance company accounts.</p>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Representative</TableHead>
              <TableHead>TIN Number</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {partners.map((partner: any) => (
              <TableRow key={partner._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{partner.companyName}</span>
                    <span className="text-xs text-muted-foreground">{partner.branchName}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{partner.userId?.name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{partner.officialEmail}</span>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-xs">{partner.tinNumber}</TableCell>

                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={partner.licenseDocument} target="_blank" className="flex items-center gap-1 text-blue-600">
                      <FileCheck className="h-4 w-4" /> Verify ID
                    </a>
                  </Button>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={`border-0 ${getStatusBadge(partner.status)}`}>
                    {partner.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <PartnerActions partner={partner} />
                </TableCell>
              </TableRow>
            ))}
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No partners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
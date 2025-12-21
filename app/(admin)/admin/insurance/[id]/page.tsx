import { notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, User } from "lucide-react";
import InsuranceQuoteForm from "@/components/insurer/InsuranceQuoteForm";

import "@/models/InsurerProfile"; // Register model



async function getClaim(id: string) {
  await dbConnect();
  const claim = await InsuranceRequest.findById(id)
    .populate('insurerId')
    .lean();
  return JSON.parse(JSON.stringify(claim));
}

export default async function AdminClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = await getClaim(id);

  if (!claim) notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/insurance"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Claim #{claim.claimReferenceNumber}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><User className="h-3 w-3"/> {claim.insurerId?.companyName}</span>
            <span>•</span>
            <span>{claim.vehicleDetails.year} {claim.vehicleDetails.make} {claim.vehicleDetails.model}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT: Context (The Ask) */}
        <div className="space-y-6">
          
          {/* Document Viewer Button */}
          <div className="bg-white p-4 border rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded text-blue-700"><FileText className="h-5 w-5"/></div>
              <div>
                <p className="font-medium text-sm">Official Assessment</p>
                <p className="text-xs text-muted-foreground">Original PDF/Image</p>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href={claim.officialDocumentUrl} target="_blank">View File</a>
            </Button>
          </div>

          {/* Requested Parts List (Raw) */}
          <div className="bg-slate-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm mb-3 text-slate-700">Requested Parts (Raw List)</h3>
            <ul className="space-y-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {claim.requestedPartsList.map((part: string, i: number) => (
                <li key={i} className="text-sm bg-white p-2 rounded border shadow-sm text-slate-700">
                  {part}
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Detail */}
          <div className="bg-white p-4 rounded-lg border text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">VIN</span> <span className="font-mono">{claim.vehicleDetails.vin || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Plate</span> <span>{claim.vehicleDetails.plateNumber || "N/A"}</span></div>
          </div>
        </div>

        {/* RIGHT: The Answer (Quote Builder) */}
        <div className="lg:col-span-2">
           <InsuranceQuoteForm claim={claim} />
        </div>

      </div>
    </div>
  );
}
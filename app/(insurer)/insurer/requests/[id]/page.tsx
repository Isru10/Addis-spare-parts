
// // (insurer)/insurer/requests/[id]/page.tsx
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import dbConnect from "@/lib/mongodb";
// import InsuranceRequest from "@/models/InsuranceRequest";
// import { 
//   Card, CardContent
// } from "@/components/ui/card"; // Removed unused imports
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { 
//   ArrowLeft, CheckCircle, FileText, AlertCircle, Clock
// } from "lucide-react";
// import PrintButton from "@/components/admin/insurance/PrintButton";


// async function getRequest(id: string) {
//   await dbConnect();
//   const req = await InsuranceRequest.findById(id).lean();
//   return JSON.parse(JSON.stringify(req));
// }

// // Status Helpers
// const getStatusColor = (status: string) => {
//   if (status === 'Quoted') return 'bg-blue-600 text-white';
//   if (status === 'Accepted') return 'bg-green-600 text-white';
//   return 'bg-gray-100 text-gray-800';
// };

// export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const request = await getRequest(id);

//   if (!request) notFound();

//   const quote = request.quotation;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
//       {/* Header */}
//       <div className="flex items-center justify-between print:hidden">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/insurer/requests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to List</Link>
//         </Button>
//         <div className="flex gap-2">
//           {/* FIX: Use the Client Component here */}
//           {quote && <PrintButton />}
//         </div>
//       </div>

//       {/* Main Document Card */}
//       <Card className="border-t-4 border-t-blue-900 shadow-lg print:shadow-none print:border-none">
        
//         {/* Proforma Header */}
//         <div className="bg-slate-50 p-6 border-b flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               {quote ? "Proforma Invoice" : "Request Details"}
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">
//               Ref: <span className="font-mono font-medium text-slate-900">{request.claimReferenceNumber}</span>
//             </p>
//           </div>
//           <div className="text-right">
//             <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
//             <p className="text-xs text-slate-400 mt-2">
//               Date: {new Date(request.createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         </div>

//         <CardContent className="p-8 space-y-8">
          
//           {/* 1. Vehicle Information */}
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vehicle Details</h3>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between border-b border-dashed pb-1">
//                   <span className="text-slate-500">Make & Model</span>
//                   <span className="font-medium">{request.vehicleDetails.year} {request.vehicleDetails.make} {request.vehicleDetails.model}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-dashed pb-1 pt-1">
//                   <span className="text-slate-500">VIN / Chassis</span>
//                   <span className="font-mono">{request.vehicleDetails.vin || "-"}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-dashed pb-1 pt-1">
//                   <span className="text-slate-500">Plate Number</span>
//                   <span>{request.vehicleDetails.plateNumber || "-"}</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Download Original Doc */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
//               <div>
//                 <h4 className="text-sm font-semibold text-blue-900">Original Assessment</h4>
//                 <p className="text-xs text-blue-600">Uploaded by Surveyor</p>
//               </div>
//               <Button asChild size="sm" variant="secondary" className="h-8">
//                 <a href={request.officialDocumentUrl} target="_blank">
//                   <FileText className="mr-2 h-3 w-3"/> View
//                 </a>
//               </Button>
//             </div>
//           </div>

//           <Separator />

//           {/* 2. Quotation Table (Only if Quoted) */}
//           {quote ? (
//             <div>
//               <h3 className="text-lg font-bold text-slate-900 mb-4">Verified Market Offer</h3>
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-slate-100 text-slate-600 font-medium border-b">
//                     <tr>
//                       <th className="p-3 text-left">Part Name</th>
//                       <th className="p-3 text-left">Condition</th>
//                       <th className="p-3 text-left">Availability</th>
//                       <th className="p-3 text-right">Unit Price</th>
//                       <th className="p-3 text-right">Qty</th>
//                       <th className="p-3 text-right">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//                     {quote.items.map((item: any, i: number) => (
//                       <tr key={i} className="hover:bg-slate-50">
//                         <td className="p-3 font-medium">{item.partName}</td>
//                         <td className="p-3 text-slate-500">{item.condition}</td>
//                         <td className="p-3">
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             item.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
//                           }`}>
//                             {item.availability}
//                           </span>
//                         </td>
//                         <td className="p-3 text-right">{item.unitPrice.toLocaleString()}</td>
//                         <td className="p-3 text-right">{item.quantity}</td>
//                         <td className="p-3 text-right font-medium">
//                           {(item.unitPrice * item.quantity).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-slate-50 font-medium text-slate-700">
//                     <tr>
//                       <td colSpan={5} className="p-3 text-right">Subtotal</td>
//                       <td className="p-3 text-right">{quote.subtotal.toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                       <td colSpan={5} className="p-3 text-right">VAT (15%)</td>
//                       <td className="p-3 text-right">{quote.vat.toLocaleString()}</td>
//                     </tr>
//                     <tr className="bg-blue-900 text-white text-base">
//                       <td colSpan={5} className="p-4 text-right">Grand Total</td>
//                       <td className="p-4 text-right font-bold">ETB {quote.grandTotal.toLocaleString()}</td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               {/* Disclaimer */}
//               <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3 text-sm text-yellow-800">
//                 <AlertCircle className="h-5 w-5 shrink-0" />
//                 <div>
//                   <p className="font-semibold">Validity: 7 Days</p>
//                   <p className="opacity-90">
//                     This quotation is valid until {new Date(quote.validUntil).toLocaleDateString()}. 
//                     Prices are subject to change after this period. Parts are reserved for 48 hours upon acceptance.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
//               <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
//               <h3 className="text-slate-900 font-medium">Quotation Pending</h3>
//               <p className="text-slate-500 text-sm">
//                 The merchant has not responded to this request yet. Please check back later.
//               </p>
//             </div>
//           )}

//         </CardContent>

//         {/* Footer Actions - We can add Server Actions form here later for "Accept" */}
//         {quote && request.status !== 'Accepted' && (
//           <div className="bg-slate-50 border-t p-6 flex justify-end gap-4 rounded-b-lg">
//              <Button size="lg" className="bg-green-600 hover:bg-green-700">
//                <CheckCircle className="mr-2 h-5 w-5" /> Accept Settlement
//              </Button>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }


import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { 
  Card, CardContent
} from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, FileText, AlertCircle, Clock
} from "lucide-react";

import AcceptButton from "@/components/insurer/AcceptButton"; // <--- IMPORT THIS
import PrintButton from "@/components/admin/insurance/PrintButton";

async function getRequest(id: string) {
  await dbConnect();
  const req = await InsuranceRequest.findById(id).lean();
  return JSON.parse(JSON.stringify(req));
}

const getStatusColor = (status: string) => {
  if (status === 'Quoted') return 'bg-blue-600 text-white';
  if (status === 'Accepted') return 'bg-green-600 text-white';
  return 'bg-gray-100 text-gray-800';
};

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) notFound();

  const quote = request.quotation; 

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/insurer/requests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to List</Link>
        </Button>
        <div className="flex gap-2">
          {quote && <PrintButton />}
        </div>
      </div>

      {/* Main Document Card */}
      <Card className="border-t-4 border-t-blue-900 shadow-lg print:shadow-none print:border-none">
        
        {/* Proforma Header */}
        <div className="bg-slate-50 p-6 border-b flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {quote ? "Proforma Invoice" : "Request Details"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ref: <span className="font-mono font-medium text-slate-900">{request.claimReferenceNumber}</span>
            </p>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
            <p className="text-xs text-slate-400 mt-2">
              Date: {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          
          {/* 1. Vehicle Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vehicle Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-dashed pb-1">
                  <span className="text-slate-500">Make & Model</span>
                  <span className="font-medium">{request.vehicleDetails.year} {request.vehicleDetails.make} {request.vehicleDetails.model}</span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-1 pt-1">
                  <span className="text-slate-500">VIN / Chassis</span>
                  <span className="font-mono">{request.vehicleDetails.vin || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-1 pt-1">
                  <span className="text-slate-500">Plate Number</span>
                  <span>{request.vehicleDetails.plateNumber || "-"}</span>
                </div>
              </div>
            </div>
            
            {/* Download Original Doc */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Original Assessment</h4>
                <p className="text-xs text-blue-600">Uploaded by Surveyor</p>
              </div>
              <Button asChild size="sm" variant="secondary" className="h-8">
                <a href={request.officialDocumentUrl} target="_blank">
                  <FileText className="mr-2 h-3 w-3"/> View
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* 2. Quotation Table (Only if Quoted) */}
          {quote ? (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Verified Market Offer</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-medium border-b">
                    <tr>
                      <th className="p-3 text-left">Part Name</th>
                      <th className="p-3 text-left">Condition</th>
                      <th className="p-3 text-left">Availability</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {quote.items.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-medium">{item.partName}</td>
                        <td className="p-3 text-slate-500">{item.condition}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.availability}
                          </span>
                        </td>
                        <td className="p-3 text-right">{item.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right font-medium">
                          {(item.unitPrice * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-medium text-slate-700">
                    <tr>
                      <td colSpan={5} className="p-3 text-right">Subtotal</td>
                      <td className="p-3 text-right">{quote.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="p-3 text-right">VAT (15%)</td>
                      <td className="p-3 text-right">{quote.vat.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-blue-900 text-white text-base">
                      <td colSpan={5} className="p-4 text-right">Grand Total</td>
                      <td className="p-4 text-right font-bold">ETB {quote.grandTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3 text-sm text-yellow-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Validity: 7 Days</p>
                  <p className="opacity-90">
                    This quotation is valid until {new Date(quote.validUntil).toLocaleDateString()}. 
                    Prices are subject to change after this period. Parts are reserved for 48 hours upon acceptance.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
              <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-900 font-medium">Quotation Pending</h3>
              <p className="text-slate-500 text-sm">
                The merchant has not responded to this request yet. Please check back later.
              </p>
            </div>
          )}

        </CardContent>

        {/* Footer Actions */}
        {quote && request.status !== 'Accepted' && (
          <div className="bg-slate-50 border-t p-6 flex justify-end gap-4 rounded-b-lg">
             {/* FIX: Use the Interactive Client Component */}
             <AcceptButton requestId={request._id} />
          </div>
        )}
      </Card>
    </div>
  );
}
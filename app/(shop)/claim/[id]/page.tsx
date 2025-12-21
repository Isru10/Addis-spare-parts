import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { AlertTriangle, Package, ShieldCheck } from "lucide-react";
import RequestCheckout from "@/components/request/RequestCheckout";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function ClaimRedemptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  // FIX: Type cast to 'any' to avoid TS errors with .lean() objects
  const request: any = await InsuranceRequest.findOne({ 
    $or: [
      { claimReferenceNumber: id },
      { "quotation.redemptionCode": id }
    ]
  }).lean();

  if (!request) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">Claim Not Found</h1>
        <p className="text-muted-foreground">Please check the Reference Number on your proforma paper.</p>
      </div>
    );
  }

  if (request.status !== 'Quoted' && request.status !== 'Accepted') {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">Claim Unavailable</h1>
        <p className="text-muted-foreground">This claim is either pending review or has expired.</p>
      </div>
    );
  }

  const quote = request.quotation;

  return (
    <div className="container py-12 max-w-4xl">
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Insurance Claim Fulfillment</h1>
            <p className="text-blue-700">Ref: {request.claimReferenceNumber} • Verified Offer</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Total Value</p>
          <p className="text-3xl font-bold text-blue-900">ETB {quote.grandTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT: Item List */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Parts List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {quote.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="bg-muted w-12 h-12 rounded flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.partName}</p>
                        <p className="text-xs text-muted-foreground">{item.condition} • {item.availability}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">x{item.quantity}</p>
                      <p className="font-bold text-sm">{(item.unitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 bg-yellow-50 p-4 rounded text-sm text-yellow-800 border border-yellow-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>
              This quote is valid until <strong>{new Date(quote.validUntil).toLocaleDateString()}</strong>. 
              Please proceed to checkout to secure these parts and prices.
            </p>
          </div>
        </div>

        {/* RIGHT: Checkout Action */}
        <div>
          <Card className="sticky top-24 border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              
              <RequestCheckout 
                type="insurance-claim"
                request={{
                  _id: request._id.toString(), // Convert ObjectId to string
                  quote: { price: quote.grandTotal }
                }} 
              />

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
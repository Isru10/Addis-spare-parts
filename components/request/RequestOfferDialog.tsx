"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, DollarSign, Truck, AlertCircle } from "lucide-react";
import RequestCheckout from "./RequestCheckout";
/* eslint-disable @typescript-eslint/no-explicit-any */


export default function RequestOfferDialog({ request }: { request: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Review Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" /> Part Found!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-3xl font-bold text-blue-900">ETB {request.quote.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Estimated Arrival</p>
                <p className="font-medium text-blue-900">{request.quote.estimatedArrival}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Shipping Method</span>
              <span className="font-medium">{request.quote.shippingMethod}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs block">Admin Note</span>
              <p className="bg-muted p-2 rounded text-foreground italic">{request.quote.adminNotes}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded text-yellow-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Payment is required to confirm this order. Once paid, the import process begins immediately.
            </p>
          </div>
        </div>

        {/* The Checkout Form */}
        <RequestCheckout request={request} />

      </DialogContent>
    </Dialog>
  );
}
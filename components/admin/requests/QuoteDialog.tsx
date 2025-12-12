"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calculator } from "lucide-react";
import { sendQuote } from "@/app/(admin)/admin/requests/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface QuoteDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  request: any; // Ideally typed as IPartRequest
}

export default function QuoteDialog({ open, setOpen, request }: QuoteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize with existing quote data if editing
  const [formData, setFormData] = useState({
    price: request.quote?.price || "",
    estimatedArrival: request.quote?.estimatedArrival || "7-10 Days",
    shippingMethod: request.quote?.shippingMethod || "Air Freight",
    condition: request.partDetails?.condition || "New Genuine", // Allow admin to override requested condition
    adminNotes: request.quote?.adminNotes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const result = await sendQuote(request._id, {
          price: Number(formData.price),
          estimatedArrival: formData.estimatedArrival,
          shippingMethod: formData.shippingMethod,
          adminNotes: formData.adminNotes,
          // We assume 'condition' might be updated if admin found something else
        });

        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          alert("Failed to send quote: " + result.message);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send Quote to Customer</DialogTitle>
            <DialogDescription>
              Provide pricing and delivery details for the <strong>{request.vehicleDetails.year} {request.vehicleDetails.model} {request.partDetails.partName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            
            {/* PRICE & CONDITION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-right">Total Price (ETB)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">ETB</span>
                  <Input
                    id="price"
                    type="number"
                    required
                    placeholder="0.00"
                    className="pl-12"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sourcing Condition</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(val) => setFormData({...formData, condition: val})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Genuine">New Genuine</SelectItem>
                    <SelectItem value="New Aftermarket">New Aftermarket</SelectItem>
                    <SelectItem value="Used">Used / Second Hand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* LOGISTICS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shipping Method</Label>
                <Select 
                  value={formData.shippingMethod} 
                  onValueChange={(val) => setFormData({...formData, shippingMethod: val})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Air Freight">Air Freight (Fast)</SelectItem>
                    <SelectItem value="Sea Freight">Sea Freight (Slow)</SelectItem>
                    <SelectItem value="Local Stock">Local Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estimated Time</Label>
                <Select 
                  value={formData.estimatedArrival} 
                  onValueChange={(val) => setFormData({...formData, estimatedArrival: val})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                    <SelectItem value="3-5 Days">3-5 Days</SelectItem>
                    <SelectItem value="7-10 Days">7-10 Days</SelectItem>
                    <SelectItem value="15-20 Days">15-20 Days</SelectItem>
                    <SelectItem value="30-45 Days">30-45 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-2">
              <Label>Admin Notes (Visible to Customer)</Label>
              <Textarea
                placeholder="e.g. Price includes customs. Part is Original Denso."
                value={formData.adminNotes}
                onChange={(e) => setFormData({...formData, adminNotes: e.target.value})}
                rows={3}
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Send Quote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
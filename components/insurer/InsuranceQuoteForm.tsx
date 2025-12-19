"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2, Save, Send } from "lucide-react";
import { createQuote } from "@/app/(admin)/admin/insurance/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface QuoteItem {
  partName: string;
  condition: string;
  availability: string;
  unitPrice: number;
  quantity: number;
}

export default function InsuranceQuoteForm({ claim }: { claim: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Pre-fill items based on the requested list if empty, or existing quote if editing
  const initialItems = claim.quotation?.items?.length > 0 
    ? claim.quotation.items 
    : claim.requestedPartsList.map((name: string) => ({
        partName: name,
        condition: 'New Genuine',
        availability: 'In Stock',
        unitPrice: 0,
        quantity: 1
      }));

  const [items, setItems] = useState<QuoteItem[]>(initialItems);

  // Calc Totals
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const vat = subtotal * 0.15;
  const grandTotal = subtotal + vat;

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { partName: "", condition: "New Genuine", availability: "In Stock", unitPrice: 0, quantity: 1 }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await createQuote(claim._id, {
        items,
        subtotal,
        vat,
        grandTotal
      });

      if (res.success) {
        router.refresh();
        alert("Quotation sent successfully!");
      } else {
        alert("Error: " + res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // If already quoted, maybe show read-only or edit mode. For now, let's allow edits.
  const isQuoted = claim.status === 'Quoted' || claim.status === 'Accepted';

  return (
    <Card className="border-t-4 border-t-primary shadow-md">
      <CardHeader>
        <CardTitle>Build Quotation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-lg bg-slate-50/50 relative group">
              <button 
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Part Name</Label>
                  <Input 
                    value={item.partName} 
                    onChange={e => handleItemChange(index, 'partName', e.target.value)} 
                    placeholder="e.g. Front Bumper"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Condition</Label>
                  <Select 
                    value={item.condition} 
                    onValueChange={val => handleItemChange(index, 'condition', val)}
                  >
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Genuine">New Genuine</SelectItem>
                      <SelectItem value="New Aftermarket">New Aftermarket</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Availability</Label>
                  <Select 
                    value={item.availability} 
                    onValueChange={val => handleItemChange(index, 'availability', val)}
                  >
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Order (3-5 Days)">Order (3-5 Days)</SelectItem>
                      <SelectItem value="Order (15+ Days)">Order (15+ Days)</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Unit Price (ETB)</Label>
                  <Input 
                    type="number" 
                    value={item.unitPrice} 
                    onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Qty</Label>
                  <Input 
                    type="number" 
                    value={item.quantity} 
                    onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addItem} className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" /> Add Line Item
        </Button>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()} ETB</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT (15%)</span>
            <span>{vat.toLocaleString()} ETB</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t">
            <span>Grand Total</span>
            <span>{grandTotal.toLocaleString()} ETB</span>
          </div>
        </div>

      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-6 flex justify-end gap-3">
        <Button disabled={loading || items.length === 0} onClick={handleSubmit} className="w-full sm:w-auto">
          {loading ? <Loader2 className="animate-spin mr-2"/> : <><Send className="mr-2 h-4 w-4"/> Send Quotation</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cartSlice";

export default function OrderSuccessPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Clear cart when landing on success page
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="p-4 rounded-full bg-green-100 text-green-600 mb-6">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Thank you for your purchase. Your order has been received and is now being processed. 
        We will notify you once it ships.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/profile">
            <Package className="mr-2 h-4 w-4" /> View My Orders
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
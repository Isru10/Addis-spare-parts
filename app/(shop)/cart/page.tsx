// // src/app/cart/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeItem, incrementQuantity, decrementQuantity } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CheckoutModal from "@/components/checkout/CheckoutModal"; 

function CartContent() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // FIX: Add mounted state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // While loading (SSR or hydration), show a generic loading state
  // This ensures Server HTML matches Client initial HTML
  if (!isMounted) {
    return <div className="container py-12 text-center">Loading cart...</div>;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; 
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you havent added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          {/* DESKTOP VIEW */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.sku}> 
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <Image 
                            src={item.image || '/placeholder-product.png'} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => dispatch(decrementQuantity({ sku: item.sku }))}><Minus className="h-3 w-3"/></Button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => dispatch(incrementQuantity({ sku: item.sku }))}><Plus className="h-3 w-3"/></Button>
                      </div>
                    </TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => dispatch(removeItem({ sku: item.sku }))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>        
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden space-y-4">
            {cartItems.map((item) => (
              <Card key={item.sku} className="overflow-hidden">
                <CardContent className="p-4 flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                    <Image 
                      src={item.image || '/placeholder-product.png'} 
                      alt={item.name} 
                      fill
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-2 leading-tight">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div><p className="text-sm font-bold">${item.price.toFixed(2)}</p></div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center border rounded-md">
                            <button className="p-1 px-2 hover:bg-muted" onClick={() => dispatch(decrementQuantity({ sku: item.sku }))}>-</button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button className="p-1 px-2 hover:bg-muted" onClick={() => dispatch(incrementQuantity({ sku: item.sku }))}>+</button>
                         </div>
                         <button className="text-red-500 p-1" onClick={() => dispatch(removeItem({ sku: item.sku }))}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/30 border p-6 rounded-lg h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (5%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={() => setIsCheckoutOpen(true)}>Proceed to Checkout</Button>
        </div>
      </div>
      <CheckoutModal open={isCheckoutOpen} setOpen={setIsCheckoutOpen} />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center">Loading cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
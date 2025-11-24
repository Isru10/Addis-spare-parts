// // src/app/cart/page.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// import { removeItem, incrementQuantity, decrementQuantity } from "@/redux/slices/cartSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Trash2 } from "lucide-react";

// export default function CartPage() {
//   const dispatch = useAppDispatch();
//   const cartItems = useAppSelector((state) => state.cart.items);

//   const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const tax = subtotal * 0.05; // Example 5% tax
//   const total = subtotal + tax;

//   if (cartItems.length === 0) {
//     return (
//       <div className="container py-12 text-center">
//         <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//         <p className="text-muted-foreground mb-6">Looks like you havent added anything to your cart yet.</p>
//         <Button asChild>
//           <Link href="/products">Start Shopping</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-12">
//       <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="md:col-span-2">



//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Quantity</TableHead>
//                 <TableHead>Total</TableHead>
//                 <TableHead></TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {cartItems.map((item) => (
//                 <TableRow key={item.sku}> {/* Key is now the unique SKU */}
//                   <TableCell className="flex items-center gap-4">
//                     <Image src={item.image || '/placeholder-product.png'} alt={item.name} width={64} height={64} className="rounded-md" />
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       {/* Display the chosen variant attributes */}
//                       <p className="text-sm text-muted-foreground">
//                         {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
//                       </p>
//                     </div>
//                   </TableCell>
//                   <TableCell>${item.price.toFixed(2)}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="icon" onClick={() => dispatch(decrementQuantity({ sku: item.sku }))}>-</Button>
//                       <span>{item.quantity}</span>
//                       <Button variant="outline" size="icon" onClick={() => dispatch(incrementQuantity({ sku: item.sku }))}>+</Button>
//                     </div>
//                   </TableCell>
//                   <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
//                   <TableCell>
//                     <Button variant="ghost" size="icon" onClick={() => dispatch(removeItem({ sku: item.sku }))}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>        </div>

//         <div className="bg-muted/50 p-6 rounded-lg">
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax (5%)</span>
//               <span>${tax.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg">
//               <span>Total</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>
//           <Button size="lg" className="w-full mt-6">Proceed to Checkout</Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { Suspense } from "react"; // 1. Import Suspense
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeItem, incrementQuantity, decrementQuantity } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

// 2. Move the logic into a separate component or keep it here but wrapped
function CartContent() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; 
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you havent added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
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
                      <Image 
                        src={item.image || '/placeholder-product.png'} 
                        alt={item.name} 
                        width={64} 
                        height={64} 
                        className="rounded-md" 
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => dispatch(decrementQuantity({ sku: item.sku }))}>-</Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => dispatch(incrementQuantity({ sku: item.sku }))}>+</Button>
                    </div>
                  </TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => dispatch(removeItem({ sku: item.sku }))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>        
        </div>

        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-6">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}

// 3. Default Export wraps content in Suspense
export default function CartPage() {
  return (
    // The fallback handles the loading state while search params (if any) are resolved
    <Suspense fallback={<div className="container py-12 text-center">Loading cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
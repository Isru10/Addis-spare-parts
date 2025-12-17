// "use client";

// import { useState, useTransition } from "react";
// import { Button } from "@/components/ui/button";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuLabel, 
//   DropdownMenuSeparator, 
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal, CheckCircle, Truck, PackageCheck, Ban } from "lucide-react";
// import { verifyPayment, updateOrderStatus } from "@/app/admin/orders/actions";
// import { useRouter } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */

// export default function OrderActions({ order }: { order: any }) {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   const handleStatusUpdate = (status: string) => {
//     startTransition(async () => {
//       await updateOrderStatus(order._id, status);
//       // Optional: Add toast
//     });
//   };

//   const handleVerify = () => {
//     startTransition(async () => {
//       await verifyPayment(order._id);
//     });
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
//         {/* PAYMENT VERIFICATION (Only for Pending Bank Transfers) */}
//         {order.status === "Pending Verification" && order.paymentMethod === "Bank Transfer" && (
//           <DropdownMenuItem onClick={handleVerify} disabled={isPending}>
//             <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Verify Payment
//           </DropdownMenuItem>
//         )}

//         {/* LIFECYCLE ACTIONS */}
//         {order.status === "Processing" && (
//           <DropdownMenuItem onClick={() => handleStatusUpdate("On Route")} disabled={isPending}>
//             <Truck className="mr-2 h-4 w-4" /> Mark as On Route
//           </DropdownMenuItem>
//         )}

//         {order.status === "On Route" && (
//           <DropdownMenuItem onClick={() => handleStatusUpdate("Delivered")} disabled={isPending}>
//             <PackageCheck className="mr-2 h-4 w-4 text-green-600" /> Mark Delivered
//           </DropdownMenuItem>
//         )}

//         <DropdownMenuSeparator />
        
//         {/* CANCEL */}
//         {order.status !== "Cancelled" && order.status !== "Delivered" && (
//           <DropdownMenuItem 
//             onClick={() => handleStatusUpdate("Cancelled")} 
//             disabled={isPending}
//             className="text-red-600 focus:text-red-600"
//           >
//             <Ban className="mr-2 h-4 w-4" /> Cancel Order
//           </DropdownMenuItem>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, Truck, PackageCheck, Ban, RefreshCw, Eye } from "lucide-react";
import { verifyPayment, updateOrderStatus } from "@/app/(admin)/admin/orders/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderActions({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = (status: string) => {
    startTransition(async () => {
      await updateOrderStatus(order._id, status);
    });
  };

  const handleVerify = () => {
    // Confirm before force-verifying Chapa orders
    if (order.paymentMethod === 'Chapa') {
       if(!confirm("Warning: Only do this if you verified the payment on Chapa Dashboard manually.")) return;
    }
    
    startTransition(async () => {
      await verifyPayment(order._id);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>


        <DropdownMenuItem asChild>
          <Link href={`/admin/orders/${order._id}`} className="cursor-pointer flex items-center">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* ACTION: VERIFY PAYMENT (For BOTH Bank Transfer AND Stuck Chapa Orders) */}
        {order.status === "Pending Verification" && (
          <DropdownMenuItem onClick={handleVerify} disabled={isPending}>
            {order.paymentMethod === 'Chapa' ? (
               // Different icon/text for Chapa Manual Override
               <><RefreshCw className="mr-2 h-4 w-4 text-orange-600" /> Force Verify (Chapa)</>
            ) : (
               <><CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Verify Payment</>
            )}
          </DropdownMenuItem>
        )}

        {/* ... Rest of lifecycle actions (Processing -> On Route -> Delivered) ... */}
        {order.status === "Processing" && (
          <DropdownMenuItem onClick={() => handleStatusUpdate("On Route")} disabled={isPending}>
            <Truck className="mr-2 h-4 w-4" /> Mark as On Route
          </DropdownMenuItem>
        )}

        {order.status === "On Route" && (
          <DropdownMenuItem onClick={() => handleStatusUpdate("Delivered")} disabled={isPending}>
            <PackageCheck className="mr-2 h-4 w-4 text-green-600" /> Mark Delivered
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        {/* CANCEL */}
        {order.status !== "Cancelled" && order.status !== "Delivered" && (
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate("Cancelled")} 
            disabled={isPending}
            className="text-red-600 focus:text-red-600"
          >
            <Ban className="mr-2 h-4 w-4" /> Cancel Order
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
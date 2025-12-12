"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, Plane, Truck, PackageCheck, XCircle } from "lucide-react";
import { rejectFakePayment, updateLogisticsStatus } from "@/app/(admin)/admin/requests/actions";


/* eslint-disable @typescript-eslint/no-explicit-any */

export default function RequestOrderActions({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = (status: string) => {
    if (confirm(`Update status to "${status}"?`)) {
      startTransition(async () => {
        await updateLogisticsStatus(order._id, status);
        router.refresh();
      });
    }
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
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        
        {/* Step 1: Verify Payment -> Start Shipping */}
        {order.logisticsStatus === 'Order Placed' && (
          <DropdownMenuItem onClick={() => handleUpdate("Shipped to Warehouse")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Verify & Ship
          </DropdownMenuItem>
        )}



        
        {/* NEW: Reject Fake Payment */}
        {order.logisticsStatus === 'Order Placed' && (
          <DropdownMenuItem 
            onClick={() => {
               if(confirm("Are you sure this payment is fake? This will cancel the order.")) {
                 startTransition(async () => await rejectFakePayment(order._id));
               }
            }}
            className="text-red-600 focus:text-red-600"
          >
            <XCircle className="mr-2 h-4 w-4" /> Reject Payment (Fake)
          </DropdownMenuItem>
        )}




        {/* Step 2: Customs */}
        {order.logisticsStatus === 'Shipped to Warehouse' && (
          <DropdownMenuItem onClick={() => handleUpdate("Customs Clearance")}>
            <Plane className="mr-2 h-4 w-4" /> Start Customs Clearance
          </DropdownMenuItem>
        )}

        {/* Step 3: Ready */}
        {order.logisticsStatus === 'Customs Clearance' && (
          <DropdownMenuItem onClick={() => handleUpdate("Ready for Pickup")}>
            <Truck className="mr-2 h-4 w-4" /> Mark Ready for Pickup
          </DropdownMenuItem>
        )}

        {/* Step 4: Final */}
        {order.logisticsStatus === 'Ready for Pickup' && (
          <DropdownMenuItem onClick={() => handleUpdate("Delivered")}>
            <PackageCheck className="mr-2 h-4 w-4 text-green-600" /> Mark Delivered
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
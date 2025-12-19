"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { updatePartnerStatus } from "@/app/(admin)/admin/insurance/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */


export default function PartnerActions({ partner }: { partner: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = (status: string) => {
    if (confirm(`Mark this partner as ${status}?`)) {
      startTransition(async () => {
        await updatePartnerStatus(partner._id, status);
        router.refresh();
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {partner.status === 'Pending' && (
          <>
            <DropdownMenuItem onClick={() => handleUpdate('Approved')} className="text-green-600 focus:text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" /> Approve Application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdate('Rejected')} className="text-red-600 focus:text-red-600">
              <XCircle className="mr-2 h-4 w-4" /> Reject Application
            </DropdownMenuItem>
          </>
        )}
        
        {partner.status === 'Approved' && (
          <DropdownMenuItem onClick={() => handleUpdate('Suspended')}>
            <XCircle className="mr-2 h-4 w-4" /> Suspend Account
          </DropdownMenuItem>
        )}

        {partner.status === 'Suspended' && (
           <DropdownMenuItem onClick={() => handleUpdate('Approved')}>
             <CheckCircle className="mr-2 h-4 w-4" /> Reactivate Account
           </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  FileSignature, // Icon for Quote
  Eye, 
  XCircle, 
  Trash2 
} from "lucide-react";
import QuoteDialog from "./QuoteDialog"; // We will build this next
import { updateRequestStatus } from "@/app/(admin)/admin/requests/actions";


interface RequestActionsProps {
  request: any; // Using any for now to avoid strict type import hell, but ideally IPartRequest
}

export default function RequestActions({ request }: RequestActionsProps) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (status: string) => {
    if (confirm(`Are you sure you want to mark this as ${status}?`)) {
      await updateRequestStatus(request._id, status);
      router.refresh(); // Refresh server data
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          {/* VIEW DETAILS */}
          <DropdownMenuItem onClick={() => router.push(`/admin/requests/${request._id}`)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* QUOTE ACTION (Only if Pending) */}
          {request.status === 'Pending Review' && (
            <DropdownMenuItem onClick={() => setIsQuoteOpen(true)}>
              <FileSignature className="mr-2 h-4 w-4 text-blue-600" /> Send Quote
            </DropdownMenuItem>
          )}

          {/* EDIT QUOTE (If already quoted) */}
          {request.status === 'Quoted' && (
            <DropdownMenuItem onClick={() => setIsQuoteOpen(true)}>
              <FileSignature className="mr-2 h-4 w-4" /> Edit Quote
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* REJECT */}
          {request.status !== 'Rejected' && request.status !== 'Ordered' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('Rejected')}
              className="text-orange-600 focus:text-orange-600"
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject Request
            </DropdownMenuItem>
          )}

          {/* DELETE (Admin only cleanup) */}
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate('Deleted')} // You'd need a delete action ideally
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      {/* The Dialog runs in the same context, controlled by state */}
      <QuoteDialog 
        open={isQuoteOpen} 
        setOpen={setIsQuoteOpen} 
        request={request} 
      />
    </>
  );
}
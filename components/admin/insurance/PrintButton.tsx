"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => window.print()} // This works here because of "use client"
    >
      <Printer className="mr-2 h-4 w-4"/> Print Proforma
    </Button>
  );
}
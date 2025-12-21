"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { acceptSettlement } from "@/app/actions/accept-settlement";

export default function AcceptButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (confirm("Are you sure you want to accept this quotation? This will verify the market price for this claim.")) {
      setLoading(true);
      await acceptSettlement(requestId);
      setLoading(false);
    }
  };

  return (
    <Button 
      size="lg" 
      className="bg-green-600 hover:bg-green-700" 
      onClick={handleAccept}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2 h-5 w-5" />}
      Accept Settlement
    </Button>
  );
}
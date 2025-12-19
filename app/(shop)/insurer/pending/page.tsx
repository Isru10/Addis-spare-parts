import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center py-12 px-6">
        <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <Clock className="h-8 w-8 text-yellow-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Under Review</h1>
        <p className="text-slate-600 mb-8">
          Thank you for registering. Our administration team is currently verifying your credentials. 
          You will receive an email notification once your Insurer Account is activated.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
      </Card>
    </div>
  );
}
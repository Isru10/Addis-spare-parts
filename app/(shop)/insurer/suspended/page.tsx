import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ban, Mail } from "lucide-react";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-t-4 border-t-red-600 shadow-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Ban className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">Account Suspended</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Your partner access has been temporarily suspended by the administrator. 
            You cannot access the dashboard or submit new requests at this time.
          </p>
          
          <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-700">
            <p className="font-semibold mb-1">Common Reasons:</p>
            <ul className="list-disc list-inside text-left pl-4 space-y-1">
              <li>Verification document expired</li>
              <li>Pending policy review</li>
              <li>Administrative action</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link href="mailto:support@addisparts.com">
                <Mail className="mr-2 h-4 w-4" /> Contact Support to Appeal
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderFailedPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
      <div className="p-4 rounded-full bg-red-100 text-red-600 mb-6">
        <XCircle className="w-12 h-12" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn not process your payment. This might be due to a network issue or a declined transaction. 
        No funds have been deducted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/cart">Try Again</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
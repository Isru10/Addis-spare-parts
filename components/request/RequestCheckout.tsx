// // components/request/RequestCheckout.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
// import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; // Reuse existing upload action


// /* eslint-disable @typescript-eslint/no-explicit-any */

// interface RequestCheckoutProps {
//   request: any;
//   type?: "part-request" | "insurance-claim"; // NEW PROP
// }

// export default function RequestCheckout({ request }: { request: any }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [shipping, setShipping] = useState({
//     fullName: "", phone: "", city: "Addis Ababa"
//   });

//   const handleConfirm = async () => {
//     if (!file || !shipping.fullName || !shipping.phone) {
//       alert("Please fill in shipping info and upload the receipt.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // 1. Upload Image
//       const formData = new FormData();
//       formData.append("file", file);
//       const uploadRes = await uploadPaymentReceipt(formData);

//       if (uploadRes.error || !uploadRes.url) throw new Error("Image upload failed");

//       // 2. Create Order via API
//       const res = await fetch("/api/requests/confirm-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requestId: request._id,
//           paymentScreenshot: uploadRes.url,
//           shippingAddress: shipping
//         })
//       });

//       if (res.ok) {
//         router.push("/orders/success?type=request");
//       } else {
//         alert("Failed to confirm order.");
//       }

//     } catch (error) {
//       console.error(error);
//       alert("An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4 pt-2 border-t">
//       <h3 className="font-semibold text-sm">Confirm & Pay</h3>
      
//       {/* Shipping */}
//       <div className="grid gap-3">
//         <Input 
//           placeholder="Receiver Name" 
//           value={shipping.fullName}
//           onChange={e => setShipping({...shipping, fullName: e.target.value})}
//         />
//         <Input 
//           placeholder="Phone Number" 
//           value={shipping.phone}
//           onChange={e => setShipping({...shipping, phone: e.target.value})}
//         />
//       </div>

//       {/* Bank Info */}
//       <div className="bg-muted p-3 rounded text-xs space-y-1">
//         <p className="font-bold">Commercial Bank of Ethiopia (CBE)</p>
//         <p>Account: <span className="font-mono">1000123456789</span></p>
//         <p>Name: <span className="font-semibold">Addis Spare Parts PLC</span></p>
//         <p className="pt-1 text-muted-foreground">Amount: ETB {request.quote.price.toLocaleString()}</p>
//       </div>

//       {/* Upload */}
//       <div className="space-y-2">
//         <Label className="text-xs">Upload Receipt</Label>
//         <div className="flex items-center gap-2">
//           <Input 
//             type="file" accept="image/*"
//             onChange={e => setFile(e.target.files?.[0] || null)}
//             className="text-xs"
//           />
//         </div>
//         {file && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Ready to upload</p>}
//       </div>

//       <Button onClick={handleConfirm} disabled={loading} className="w-full">
//         {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Confirm Order"}
//       </Button>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; 

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RequestCheckoutProps {
  request: any;
  type?: "part-request" | "insurance-claim"; // NEW PROP
}

export default function RequestCheckout({ request, type = "part-request" }: RequestCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [shipping, setShipping] = useState({
    fullName: "", phone: "", city: "Addis Ababa"
  });

  const handleConfirm = async () => {
    if (!file || !shipping.fullName || !shipping.phone) {
      alert("Please fill in shipping info and upload the receipt.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadPaymentReceipt(formData);

      if (uploadRes.error || !uploadRes.url) throw new Error("Image upload failed");

      // 2. Determine API Endpoint based on Type
      const apiEndpoint = type === "insurance-claim" 
        ? "/api/insurer/requests/confirm-order" 
        : "/api/requests/confirm-order";

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request._id,
          paymentScreenshot: uploadRes.url,
          shippingAddress: shipping
        })
      });

      if (res.ok) {
        router.push("/orders/success?type=request");
      } else {
        const err = await res.json();
        alert("Failed: " + (err.error || "Unknown error"));
      }

    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t">
      <h3 className="font-semibold text-sm">Confirm & Pay</h3>
      
      {/* Shipping */}
      <div className="grid gap-3">
        <Input 
          placeholder="Receiver Name" 
          value={shipping.fullName}
          onChange={e => setShipping({...shipping, fullName: e.target.value})}
        />
        <Input 
          placeholder="Phone Number" 
          value={shipping.phone}
          onChange={e => setShipping({...shipping, phone: e.target.value})}
        />
      </div>

      {/* Bank Info */}
      <div className="bg-muted p-3 rounded text-xs space-y-1">
        <p className="font-bold">Commercial Bank of Ethiopia (CBE)</p>
        <p>Account: <span className="font-mono">1000123456789</span></p>
        <p>Name: <span className="font-semibold">Addis Spare Parts PLC</span></p>
        <p className="pt-1 text-muted-foreground">Amount: ETB {request.quote.price.toLocaleString()}</p>
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <Label className="text-xs">Upload Receipt</Label>
        <div className="flex items-center gap-2">
          <Input 
            type="file" accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="text-xs"
          />
        </div>
        {file && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Ready to upload</p>}
      </div>

      <Button onClick={handleConfirm} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Confirm Order"}
      </Button>
    </div>
  );
}
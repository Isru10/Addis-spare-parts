"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Loader2, CreditCard, Landmark, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; 
import { clearCart } from "@/redux/slices/cartSlice";

interface CheckoutModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function CheckoutModal({ open, setOpen }: CheckoutModalProps) {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Shipping, Step 2: Payment
  const [loading, setLoading] = useState(false);
  
  // Shipping State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    city: "Addis Ababa",
    subCity: "",
    woreda: "",
    houseNumber: "",
  });

  // Bank Transfer State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // --- HANDLERS ---

  const handleNextStep = () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.subCity) {
      alert("Please fill in all required shipping fields (Name, Phone, Sub-City).");
      return;
    }
    setStep(2);
  };

  const handleChapaPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingInfo, 
        }),
      });
      
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; // Redirect to Chapa
      } else {
        alert("Payment initialization failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!screenshotFile) {
      alert("Please upload the payment receipt screenshot.");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // 1. Upload Image using Server Action
      const formData = new FormData();
      formData.append("file", screenshotFile);
      
      const uploadRes = await uploadPaymentReceipt(formData);

      if (uploadRes.error || !uploadRes.url) {
        throw new Error(uploadRes.error || "Image upload failed");
      }

      // 2. Create Manual Order via API
      const orderRes = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingInfo,
          screenshotUrl: uploadRes.url, // Send the real Cloudinary URL
        }),
      });

      if (orderRes.ok) {
        dispatch(clearCart())
        setOpen(false);
        router.push("/orders/success"); // Redirect to profile/orders to see status
      } else {
        const errorData = await orderRes.json();
        router.push("/orders/failure"); // Redirect to profile/orders to see status
        alert("Order creation failed: " + errorData.error);
      }

    } catch (error: any) {
      console.error(error);
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {step === 1 ? <MapPin className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            {step === 1 ? "Shipping Details" : "Payment Method"}
          </DialogTitle>
        </DialogHeader>

        {/* STEP 1: SHIPPING FORM */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={shippingInfo.fullName} 
                  onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} 
                  placeholder="Kebede Alemu" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone Number <span className="text-red-500">*</span></Label>
                <Input 
                  value={shippingInfo.phone} 
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} 
                  placeholder="0911..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Input 
                    value={shippingInfo.city} 
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Sub-City <span className="text-red-500">*</span></Label>
                  <Input 
                    value={shippingInfo.subCity} 
                    onChange={(e) => setShippingInfo({...shippingInfo, subCity: e.target.value})} 
                    placeholder="Bole" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Woreda</Label>
                  <Input 
                    value={shippingInfo.woreda} 
                    onChange={(e) => setShippingInfo({...shippingInfo, woreda: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>House No.</Label>
                  <Input 
                    value={shippingInfo.houseNumber} 
                    onChange={(e) => setShippingInfo({...shippingInfo, houseNumber: e.target.value})} 
                  />
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 h-11 text-base" onClick={handleNextStep}>
              Next: Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: PAYMENT SELECTION */}
        {step === 2 && (
          <Tabs defaultValue="chapa" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chapa"><CreditCard className="w-4 h-4 mr-2"/> Chapa / Telebirr</TabsTrigger>
              <TabsTrigger value="bank"><Landmark className="w-4 h-4 mr-2"/> Bank Transfer</TabsTrigger>
            </TabsList>

            {/* -- CHAPA TAB -- */}
            <TabsContent value="chapa" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/20 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Pay instantly using Telebirr, CBE Birr, or Debit Card.
                  <br />Your order will be verified automatically.
                </p>
              </div>
              <Button onClick={handleChapaPayment} disabled={loading} className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold">
                {loading ? <Loader2 className="animate-spin mr-2"/> : "Pay Securely Now"}
              </Button>
            </TabsContent>

            {/* -- BANK TRANSFER TAB -- */}
            <TabsContent value="bank" className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm text-blue-900 space-y-1">
                <p className="font-bold">Commercial Bank of Ethiopia (CBE)</p>
                <p>Account: <span className="font-mono font-semibold">1000123456789</span></p>
                <p>Name: <span className="font-semibold">Addis Spare Parts PLC</span></p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receipt">Upload Payment Screenshot</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="receipt" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    className="cursor-pointer file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3 file:text-sm file:font-semibold hover:file:bg-blue-100"
                  />
                </div>
                {screenshotFile && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> {screenshotFile.name} ready to upload
                  </p>
                )}
              </div>

              <Button onClick={handleBankTransfer} disabled={loading} className="w-full h-12 font-bold">
                {loading ? (
                  <><Loader2 className="animate-spin mr-2"/> {uploading ? "Uploading Image..." : "Creating Order..."}</>
                ) : (
                  "Confirm Bank Transfer"
                )}
              </Button>
            </TabsContent>
            
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="w-full mt-2">Back to Shipping</Button>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Car, Info, Camera, CheckCircle2, ChevronRight, ChevronLeft, Loader2, UploadCloud 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; // Reusing your upload logic
import { createPartRequest } from "@/app/actions/create-part-request";

// --- TYPES ---
interface RequestFormData {
  // Vehicle
  make: string; model: string; year: string; vin: string;
  trim: string; transmission: string; fuel: string;
  // Part
  partName: string; description: string; quantity: string; condition: string;
  images: string[];
}

const INITIAL_DATA: RequestFormData = {
  make: "", model: "", year: "", vin: "",
  trim: "", transmission: "", fuel: "",
  partName: "", description: "", quantity: "1", condition: "New Genuine",
  images: []
};

export default function PartRequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RequestFormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- HANDLERS ---
  const handleChange = (field: keyof RequestFormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    // Loop through files and upload individually
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      const res = await uploadPaymentReceipt(formData); // Reusing your action
      if (res.url) newImages.push(res.url);
    }

    setData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploading(false);
  };

 const handleSubmit = async () => {
    setLoading(true);
    try {
      // Call Server Action directly
      const result = await createPartRequest(data);

      if (result.success) {
        // Optional: Show toast here
        router.push("/profile/requests?success=true");
      } else {
        alert(result.message); // Handle error
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---

  // STEP 1: VEHICLE ID
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Car Make <span className="text-red-500">*</span></Label>
          <Input placeholder="e.g. Toyota" value={data.make} onChange={e => handleChange("make", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Model <span className="text-red-500">*</span></Label>
          <Input placeholder="e.g. Hilux / Vitz" value={data.model} onChange={e => handleChange("model", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Year <span className="text-red-500">*</span></Label>
          <Input type="number" placeholder="2018" value={data.year} onChange={e => handleChange("year", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            VIN / Chassis Number
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>Unique 17-char code on your dashboard or door. Ensures 100% fit.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input placeholder="Optional but Recommended" value={data.vin} onChange={e => handleChange("vin", e.target.value)} className="font-mono uppercase" />
        </div>
      </div>
      
      <Separator />
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Engine / Trim Details</Label>
          <Input placeholder="e.g. 1KD Engine, V6, Executive Package" value={data.trim} onChange={e => handleChange("trim", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select value={data.transmission} onValueChange={(val) => handleChange("transmission", val)}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // STEP 2: PART DETAILS
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="space-y-2">
        <Label>Part Name <span className="text-red-500">*</span></Label>
        <Input placeholder="e.g. Right Side Headlight" value={data.partName} onChange={e => handleChange("partName", e.target.value)} />
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input type="number" value={data.quantity} onChange={e => handleChange("quantity", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Preferred Condition</Label>
          <Select value={data.condition} onValueChange={(val) => handleChange("condition", val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="New Genuine">New Genuine (Original)</SelectItem>
              <SelectItem value="New Aftermarket">New Aftermarket (High Quality)</SelectItem>
              <SelectItem value="Used">Used / Second Hand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Detailed Description <span className="text-red-500">*</span></Label>
        <Textarea 
          placeholder="Describe the issue or specifics. E.g. 'Must include the bulb and ballast', 'Chrome finish only'." 
          rows={4}
          value={data.description} 
          onChange={e => handleChange("description", e.target.value)} 
        />
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
        <Label className="flex items-center gap-2">
          <Camera className="h-4 w-4" /> Upload Reference Photos
        </Label>
        <div className="flex items-center gap-4">
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin"/> : <UploadCloud className="h-6 w-6 text-muted-foreground" />}
            <span className="text-[10px] text-muted-foreground mt-1">Add Photo</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          
          {/* Preview Images */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image src={img} alt="Preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Photos of the old part or the VIN plate help us find the exact match faster.</p>
      </div>
    </div>
  );

  // STEP 3: REVIEW
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
          <Car className="h-5 w-5" /> Vehicle Summary
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Vehicle:</dt>
          <dd className="font-medium">{data.year} {data.make} {data.model}</dd>
          <dt className="text-muted-foreground">VIN:</dt>
          <dd className="font-mono text-xs pt-0.5">{data.vin || "Not provided"}</dd>
          <dt className="text-muted-foreground">Spec:</dt>
          <dd>{data.trim} ({data.transmission})</dd>
        </dl>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5" /> Part Request
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Looking for:</dt>
          <dd className="font-medium">{data.quantity}x {data.partName}</dd>
          <dt className="text-muted-foreground">Condition:</dt>
          <dd className="font-medium text-blue-600">{data.condition}</dd>
          <dt className="text-muted-foreground">Notes:</dt>
          <dd className="col-span-2 italic text-muted-foreground bg-background p-2 rounded border mt-1">
            {data.description}
          </dd>
          <dt className="text-muted-foreground mt-2">Images:</dt>
          <dd className="mt-2 text-xs text-muted-foreground">{data.images.length} photos attached</dd>
        </dl>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl">Request a Part</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-2" />
        <CardDescription className="pt-4">
          {step === 1 && "Tell us about your vehicle so we can check compatibility."}
          {step === 2 && "Describe the part you need in detail."}
          {step === 3 && "Review your request before sending to our experts."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div /> // Spacer
        )}

        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!data.make || !data.model)}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Submit Request"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   Card, CardContent, CardHeader, CardTitle, CardFooter 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, UploadCloud, FileCheck, CarFront } from "lucide-react";
// import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; // Reuse secure upload

// export default function NewInsuranceRequestForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     claimRef: "",
//     make: "", model: "", year: "", vin: "", plate: "",
//     partsList: "", // Text area for bulk input
//     file: null as File | null
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.file) return alert("You must upload the official claim document.");

//     setLoading(true);
//     setUploading(true);

//     try {
//       // 1. Upload Document
//       const fileData = new FormData();
//       fileData.append("file", formData.file);
//       const uploadRes = await uploadPaymentReceipt(fileData);
      
//       if (!uploadRes.url) throw new Error("Document upload failed");

//       // 2. Submit Request API
//       const res = await fetch("/api/insurer/requests/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           claimReferenceNumber: formData.claimRef,
//           vehicleDetails: {
//             make: formData.make,
//             model: formData.model,
//             year: Number(formData.year),
//             vin: formData.vin,
//             plateNumber: formData.plate
//           },
//           requestedPartsList: formData.partsList.split("\n").filter(Boolean), // Split lines into array
//           officialDocumentUrl: uploadRes.url
//         })
//       });

//       if (res.ok) {
//         router.push("/insurer/dashboard");
//       } else {
//         const err = await res.json();
//         alert(err.error || "Submission failed");
//       }

//     } catch (error) {
//       console.error(error);
//       alert("System error occurred.");
//     } finally {
//       setLoading(false);
//       setUploading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
      
//       {/* SECTION 1: CLAIM CONTEXT */}
//       <Card className="border-t-4 border-t-blue-800">
//         <CardHeader>
//           <CardTitle className="text-lg">Claim Information</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label>Claim Reference Number <span className="text-red-500">*</span></Label>
//             <Input 
//               placeholder="e.g. CLM-2024-8892" 
//               required 
//               value={formData.claimRef}
//               onChange={e => setFormData({...formData, claimRef: e.target.value})}
//             />
//             <p className="text-xs text-muted-foreground">Internal file number for tracking.</p>
//           </div>
          
//           <div className="space-y-2">
//             <Label>Upload Official Assessment <span className="text-red-500">*</span></Label>
//             <div className="flex items-center gap-4 border border-dashed rounded-lg p-3 bg-slate-50">
//               <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900">
//                 <UploadCloud className="h-4 w-4" />
//                 {formData.file ? "Change File" : "Choose File"}
//                 <input 
//                   type="file" 
//                   accept=".pdf,image/*" 
//                   className="hidden" 
//                   onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} 
//                 />
//               </label>
//               {formData.file ? (
//                 <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
//                   <FileCheck className="h-3 w-3" /> {formData.file.name}
//                 </span>
//               ) : (
//                 <span className="text-xs text-slate-400">PDF or Image (Max 5MB)</span>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 2: VEHICLE DETAILS */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <CarFront className="h-5 w-5 text-slate-500" /> Vehicle Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-3 gap-4">
//           <div className="space-y-2">
//             <Label>Make</Label>
//             <Input placeholder="Toyota" required value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
//           </div>
//           <div className="space-y-2">
//             <Label>Model</Label>
//             <Input placeholder="Corolla" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
//           </div>
//           <div className="space-y-2">
//             <Label>Year</Label>
//             <Input type="number" placeholder="2019" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
//           </div>
//           <div className="space-y-2">
//             <Label>VIN / Chassis No.</Label>
//             <Input placeholder="Optional" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} />
//           </div>
//           <div className="space-y-2">
//             <Label>Plate Number</Label>
//             <Input placeholder="Code 2 - B12345" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} />
//           </div>
//         </CardContent>
//       </Card>

//       {/* SECTION 3: PARTS LIST */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Requested Parts List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             <Label>List parts needed (One per line)</Label>
//             <Textarea 
//               placeholder="Right Headlight&#10;Front Bumper&#10;Radiator Grill" 
//               rows={6}
//               required
//               className="font-mono text-sm"
//               value={formData.partsList}
//               onChange={e => setFormData({...formData, partsList: e.target.value})}
//             />
//             <p className="text-xs text-muted-foreground">
//               Please match the items listed in your uploaded document.
//             </p>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-slate-50 border-t p-6 flex justify-end gap-3">
//           <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
//           <Button type="submit" className="bg-blue-900 hover:bg-blue-800 min-w-[150px]" disabled={loading}>
//             {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {uploading ? "Uploading..." : "Submitting..."}</> : "Submit Request"}
//           </Button>
//         </CardFooter>
//       </Card>

//     </form>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud, FileCheck, CarFront } from "lucide-react";
import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; 

export default function NewInsuranceRequestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    // REMOVED: claimRef
    make: "", model: "", year: "", vin: "", plate: "",
    partsList: "", 
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return alert("You must upload the official claim document.");

    setLoading(true);
    setUploading(true);

    try {
      // 1. Upload Document
      const fileData = new FormData();
      fileData.append("file", formData.file);
      const uploadRes = await uploadPaymentReceipt(fileData);
      
      if (!uploadRes.url) throw new Error("Document upload failed");

      // 2. Submit Request API
      const res = await fetch("/api/insurer/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // REMOVED: claimReferenceNumber (API will generate it)
          vehicleDetails: {
            make: formData.make,
            model: formData.model,
            year: Number(formData.year),
            vin: formData.vin,
            plateNumber: formData.plate
          },
          requestedPartsList: formData.partsList.split("\n").filter(Boolean),
          officialDocumentUrl: uploadRes.url
        })
      });

      if (res.ok) {
        router.push("/insurer/dashboard");
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }

    } catch (error) {
      console.error(error);
      alert("System error occurred.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SECTION 1: DOCUMENT UPLOAD */}
      <Card className="border-t-4 border-t-blue-800">
        <CardHeader>
          <CardTitle className="text-lg">Claim Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <Label>Upload Official Assessment <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-4 border border-dashed rounded-lg p-3 bg-slate-50">
              <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900">
                <UploadCloud className="h-4 w-4" />
                {formData.file ? "Change File" : "Choose File"}
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} 
                />
              </label>
              {formData.file ? (
                <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <FileCheck className="h-3 w-3" /> {formData.file.name}
                </span>
              ) : (
                <span className="text-xs text-slate-400">PDF or Image (Max 5MB)</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              A unique Claim Reference Number will be generated automatically for this request.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: VEHICLE DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CarFront className="h-5 w-5 text-slate-500" /> Vehicle Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Make</Label>
            <Input placeholder="Toyota" required value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input placeholder="Corolla" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" placeholder="2019" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>VIN / Chassis No.</Label>
            <Input placeholder="Optional" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Plate Number</Label>
            <Input placeholder="Code 2 - B12345" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: PARTS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requested Parts List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>List parts needed (One per line)</Label>
            <Textarea 
              placeholder="Right Headlight&#10;Front Bumper&#10;Radiator Grill" 
              rows={6}
              required
              className="font-mono text-sm"
              value={formData.partsList}
              onChange={e => setFormData({...formData, partsList: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800 min-w-[150px]" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {uploading ? "Uploading..." : "Submitting..."}</> : "Submit Request"}
          </Button>
        </CardFooter>
      </Card>

    </form>
  );
}
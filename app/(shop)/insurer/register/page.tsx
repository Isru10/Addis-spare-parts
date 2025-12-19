"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, FileCheck, Phone, UploadCloud, Loader2 } from "lucide-react";
import { uploadPaymentReceipt } from "@/app/actions/upload-receipt"; // Reusing secure upload

export default function InsurerRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",
    branchName: "",
    tinNumber: "",
    officialEmail: "",
    officialPhone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload your authorization document/ID.");
    
    setLoading(true);
    try {
      // 1. Upload Doc
      const uploadData = new FormData();
      uploadData.append("file", file);
      const uploadRes = await uploadPaymentReceipt(uploadData);
      
      if (!uploadRes.url) throw new Error("Document upload failed");

      // 2. Submit Profile
      const res = await fetch("/api/insurer/register", { // We will create this API next
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, licenseDocument: uploadRes.url })
      });

      if (res.ok) {
        router.push("/insurer/pending"); // Redirect to a "Wait for approval" page
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      alert("System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg border-t-4 border-t-blue-800">
        <CardHeader className="text-center pb-8 border-b">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
            <Building2 className="h-8 w-8 text-blue-800" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Partner Registration</CardTitle>
          <CardDescription>
            Join our verified network of insurance providers. 
            Submit your credentials to access the Digital Proforma System.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            
            {/* Corporate Identity */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  placeholder="e.g. Awash Insurance S.C." 
                  required 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Branch / Department</Label>
                <Input 
                  placeholder="e.g. Claims Division (Bole)" 
                  required 
                  value={formData.branchName}
                  onChange={e => setFormData({...formData, branchName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tax Identification Number (TIN)</Label>
              <Input 
                placeholder="00-000-0000" 
                required 
                value={formData.tinNumber}
                onChange={e => setFormData({...formData, tinNumber: e.target.value})}
              />
            </div>

            {/* Verification Upload */}
            <div className="p-4 border border-dashed border-blue-300 bg-blue-50/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-medium">
                <FileCheck className="h-5 w-5" />
                <h3>Authorization Verification</h3>
              </div>
              <p className="text-xs text-slate-600">
                Please upload a scan of your Company ID or Authorization Letter. 
                This is required to verify your status as a claims officer.
              </p>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white border px-4 py-2 rounded shadow-sm text-sm hover:bg-slate-50 flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  {file ? "Change File" : "Upload Document"}
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
                {file && <span className="text-sm text-green-700 font-medium">{file.name}</span>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Official Email</Label>
                <Input 
                  type="email" 
                  placeholder="claims@awash.com" 
                  required 
                  value={formData.officialEmail}
                  onChange={e => setFormData({...formData, officialEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Direct Line / Mobile</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-9" 
                    placeholder="+251 9..." 
                    required 
                    value={formData.officialPhone}
                    onChange={e => setFormData({...formData, officialPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>

          </CardContent>
          <CardFooter className="bg-slate-50 border-t p-6 flex justify-end">
            <Button size="lg" type="submit" className="bg-blue-800 hover:bg-blue-900 min-w-[150px]" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2"/> : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
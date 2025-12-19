import { Metadata } from "next";

import { FileText } from "lucide-react";
import NewInsuranceRequestForm from "@/components/insurer/NewInsuranceRequestForm";

export const metadata: Metadata = {
  title: "New Proforma Request | Insurance Portal",
  description: "Submit a new claim for market price verification.",
};

export default function NewRequestPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-800">
            <FileText className="h-6 w-6" />
          </div>
          New Proforma Request
        </h1>
        <p className="text-slate-500 mt-2 ml-14">
          Upload the surveyor assessment to receive a verified market quotation.
        </p>
      </div>

      <NewInsuranceRequestForm />
    </div>
  );
}
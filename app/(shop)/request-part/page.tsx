import { Metadata } from "next";
import PartRequestForm from "@/components/request/PartRequestForm";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Part | Addis Parts",
  description: "Can't find what you need? Request a specific car part and get a quote.",
};

export default function RequestPartPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-2">
          <Wrench className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Special Order Request
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Can not find the part you are looking for? Fill out the form below, and our experts will source it for you from our global suppliers.
        </p>
      </div>

      <PartRequestForm />
    </div>
  );
}
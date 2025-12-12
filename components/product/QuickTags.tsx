"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TAGS = [
  "Brakes", "Engine", "Toyota", "Honda", "Oil Filter", 
  "Tires", "Suspension", "Lights", "Battery", "Spark Plugs",
  "Wiper Blades", "Radiator", "Alternator", "Clutch"
];

export default function QuickTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentQuery === tag) {
      params.delete("q"); 
    } else {
      params.set("q", tag);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    // FIX: max-w-full ensures it never exceeds parent width
    <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-2 w-max px-1">
        {TAGS.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => handleTagClick(tag)}
            className={cn(
              "rounded-full whitespace-nowrap h-8 px-4 text-xs",
              currentQuery === tag 
                ? "bg-primary text-primary-foreground border-primary" 
                : "border-muted-foreground/20 hover:border-primary/50"
            )}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
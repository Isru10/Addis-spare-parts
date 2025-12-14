"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state directly from URL to avoid hydration mismatch or reset
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    // Only update if query changed from what's in URL
    if (query === searchParams.get("q")) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      // Only reset page if query actually CHANGED (not on initial load)
      if (query !== (searchParams.get("q") || "")) {
         params.set("page", "1");
      }
      
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

export default function AdminSearch(props: { placeholder: string }) {
  return (
    <Suspense fallback={<div className="w-full max-w-sm h-10 bg-muted rounded animate-pulse" />}>
      <SearchBar {...props} />
    </Suspense>
  );
}
// // src/components/layout/SearchInput.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { SheetClose } from "@/components/ui/sheet";

// interface SearchInputProps {
//   className?: string;
//   onSearch?: () => void; // Optional callback to close mobile sheet
// }

// export function SearchInput({ className, onSearch }: SearchInputProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [query, setQuery] = useState("");

//   // Sync input with URL on load
//   useEffect(() => {
//     setQuery(searchParams.get("q") || "");
//   }, [searchParams]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // If empty, do nothing or redirect to all products
//     if (!query.trim()) {
//       router.push("/products");
//       return;
//     }

//     // Construct URL - We intentionally reset other filters (page, category, etc)
//     // to give the user a fresh search result.
//     const params = new URLSearchParams();
//     params.set("q", query.trim());
    
//     router.push(`/products?${params.toString()}`);
    
//     if (onSearch) onSearch();
//   };

//   return (
//     <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
//       <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//       <Input
//         type="search"
//         placeholder="Search products (e.g. Brake Pads)..."
//         className="pl-8 w-full bg-background"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//     </form>
//   );
// }


"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
  onSearch?: () => void;
}

// 1. The Logic Component (Uses useSearchParams)
function SearchInputContent({ className, onSearch }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      router.push("/products");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", query.trim());
    
    router.push(`/products?${params.toString()}`);
    
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-8 w-full bg-background"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

// 2. The Exported Component (Wraps Logic in Suspense)
// This creates a safety boundary so the rest of the app can build statically.
export function SearchInput(props: SearchInputProps) {
  return (
    <Suspense fallback={
      // Fallback UI while params are loading (looks like a disabled input)
      <div className={cn("relative w-full", props.className)}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          disabled 
          placeholder="Search products..." 
          className="pl-8 w-full bg-background opacity-50 cursor-not-allowed"
        />
      </div>
    }>
      <SearchInputContent {...props} />
    </Suspense>
  );
}
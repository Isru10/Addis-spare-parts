"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; 
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";

import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { ICategory } from "@/types/category"; // Using your specific type
import { Checkbox } from "../ui/checkbox";

interface ProductFiltersProps {
  brands: string[];
  categories: ICategory[]; 
  maxPriceData: number;
}

export default function ProductFilters({ brands, categories, maxPriceData }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for immediate UI feedback
  const [priceRange, setPriceRange] = useState([0, maxPriceData]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync local state with URL on load
  useEffect(() => {
    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || maxPriceData;
    setPriceRange([min, max]);
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams, maxPriceData]);

  // Helper to update URL
  const updateFilter = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    // Reset page to 1 whenever a filter changes
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Handle Checkbox Logic (Array of values)
  const toggleFilterArray = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",") || [];
    
    let newValues;
    if (current.includes(value)) {
      newValues = current.filter((v) => v !== value);
    } else {
      newValues = [...current, value];
    }

    if (newValues.length > 0) {
      params.set(key, newValues.join(","));
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Debounce price slider
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const commitPriceChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilter("q", searchQuery);
          }}
        />
      </div>

      {/* Clear Filters */}
      {(searchParams.toString().length > 0) && (
        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={() => router.push("/products")}
        >
          <X className="mr-2 h-4 w-4" /> Clear All Filters
        </Button>
      )}

      <Accordion type="multiple" defaultValue={["category", "brand", "price"]} className="w-full">
        
        {/* Categories */}
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((cat) => {
                // We compare IDs here because the URL stores IDs
                const isChecked = searchParams.get("category")?.split(",").includes(cat._id.toString());
                return (
                  <div key={cat._id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${cat._id}`} 
                      checked={isChecked}
                      onCheckedChange={() => toggleFilterArray("category", cat._id.toString())}
                    />
                    <Label htmlFor={`cat-${cat._id}`} className="cursor-pointer">{cat.name}</Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brand">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
             <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => {
                const isChecked = searchParams.get("brand")?.split(",").includes(brand);
                return (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`} 
                      checked={isChecked}
                      onCheckedChange={() => toggleFilterArray("brand", brand)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-2 space-y-4">
              <Slider
                defaultValue={[0, maxPriceData]}
                max={maxPriceData}
                step={10}
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={commitPriceChange}
              />
              <div className="flex items-center justify-between text-sm font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
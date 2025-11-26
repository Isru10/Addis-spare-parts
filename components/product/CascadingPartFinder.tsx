// // components/product/CascadingPartFinder.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; 
// import { Search, Loader2, RotateCcw, DollarSign } from "lucide-react";
// import { ICategory } from "@/types/category";
// import { getCategoryOptions, FilterOptions } from "@/app/products/actions";

// interface CascadingPartFinderProps {
//   categories: ICategory[];
// }

// export default function CascadingPartFinder({ categories }: CascadingPartFinderProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // --- STATE ---
//   const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
//   const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
//   const [selectedModel, setSelectedModel] = useState<string>(searchParams.get("q") || ""); 
  
//   const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
//   const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
//   const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  
//   const [loading, setLoading] = useState(false);
//   const [options, setOptions] = useState<FilterOptions>({ brands: [], models: [], specs: [] });

//   // --- EFFECT: Load Options ---
//   useEffect(() => {
//     if (!selectedCategory) {
//       setOptions({ brands: [], models: [], specs: [] });
//       return;
//     }

//     const fetchOptions = async () => {
//       setLoading(true);
//       try {
//         const data = await getCategoryOptions(selectedCategory);
//         setOptions(data);
        
//         const currentSpecs: Record<string, string> = {};
//         data.specs.forEach(s => {
//             const val = searchParams.get(`spec_${s.name}`);
//             if(val) currentSpecs[s.name] = val;
//         });
//         setSelectedSpecs(currentSpecs);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOptions();
//   }, [selectedCategory, searchParams]); 

//   // --- HANDLERS ---
//   const handleSearch = () => {
//     const params = new URLSearchParams();
    
//     if (selectedCategory) params.set("category", selectedCategory);
//     if (selectedBrand) params.set("brand", selectedBrand);
//     if (selectedModel) params.set("q", selectedModel); 

//     if (minPrice) params.set("minPrice", minPrice);
//     if (maxPrice) params.set("maxPrice", maxPrice);

//     Object.entries(selectedSpecs).forEach(([name, value]) => {
//       if (value) params.set(`spec_${name}`, value);
//     });

//     router.push(`/products?${params.toString()}`);
//   };

//   const handleReset = () => {
//     setSelectedCategory("");
//     setSelectedBrand("");
//     setSelectedModel("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSelectedSpecs({});
//     router.push("/products");
//   };

//   return (
//     <Card className="border-primary/20 shadow-sm sticky top-24">
//       <CardHeader className="bg-muted/30 pb-4">
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <Search className="h-5 w-5 text-primary" />
//           Advanced Filter
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-4 pt-4">
        
//         {/* 1. Category */}
//         <div className="space-y-1.5">
//           <Label className="text-xs font-semibold text-muted-foreground uppercase">Part Type</Label>
//           <Select value={selectedCategory} onValueChange={(val) => {
//              setSelectedCategory(val);
//              setSelectedBrand("");
//              setSelectedModel("");
//              setSelectedSpecs({});
//           }}>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose Category..." />
//             </SelectTrigger>
            
//             {/* FIX: SCROLLABLE CATEGORY LIST */}
//             <SelectContent className="max-h-[250px] overflow-y-auto"    position="popper">
//               {categories.map((cat) => (
//                 <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* 2. Vehicle / Brand */}
//         <div className="space-y-1.5">
//            <Label className="text-xs font-semibold text-muted-foreground uppercase">Vehicle / Brand</Label>
//            <div className="grid grid-cols-2 gap-2">
//              {/* Model Dropdown */}
//              <Select 
//                disabled={!selectedCategory || loading || options.models.length === 0} 
//                value={selectedModel} 
//                onValueChange={setSelectedModel}
//              >
//               <SelectTrigger>
//                 <SelectValue placeholder="Model" />
//               </SelectTrigger>
//               {/* FIX: SCROLLABLE MODEL LIST */}
//               <SelectContent className="max-h-[250px] overflow-y-auto">
//                 {options.models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//               </SelectContent>
//             </Select>

//              {/* Brand Dropdown */}
//              <Select 
//                disabled={!selectedCategory || loading || options.brands.length === 0}
//                value={selectedBrand} 
//                onValueChange={setSelectedBrand}
//              >
//               <SelectTrigger>
//                 <SelectValue placeholder="Brand" />
//               </SelectTrigger>
//               {/* FIX: SCROLLABLE BRAND LIST */}
//               <SelectContent className="max-h-[250px] overflow-y-auto">
//                 {options.brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
//               </SelectContent>
//             </Select>
//            </div>
//         </div>

//         {/* 3. Specs (Dynamic) */}
//         {options.specs.length > 0 && (
//           <div className="space-y-3 pt-2 border-t">
//             <Label className="text-xs font-semibold text-muted-foreground uppercase">Specifications</Label>
//             {options.specs.map((spec) => (
//               <div key={spec.name}>
//                  <Select 
//                    value={selectedSpecs[spec.name] || ""} 
//                    onValueChange={(val) => setSelectedSpecs(prev => ({ ...prev, [spec.name]: val }))}
//                  >
//                    <SelectTrigger className="h-9 text-sm">
//                      <SelectValue placeholder={`Select ${spec.name}`} />
//                    </SelectTrigger>
//                    {/* FIX: SCROLLABLE SPECS LIST */}
//                    <SelectContent className="max-h-[250px] overflow-y-auto">
//                      {spec.options.map((opt) => (
//                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
//                      ))}
//                    </SelectContent>
//                  </Select>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 4. Price Range */}
//         <div className="space-y-1.5 pt-2 border-t">
//            <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
//              <DollarSign className="h-3 w-3" /> Price Range
//            </Label>
//            <div className="flex items-center gap-2">
//              <Input 
//                 type="number" 
//                 placeholder="Min" 
//                 value={minPrice} 
//                 onChange={(e) => setMinPrice(e.target.value)} 
//                 className="h-9"
//              />
//              <span className="text-muted-foreground">-</span>
//              <Input 
//                 type="number" 
//                 placeholder="Max" 
//                 value={maxPrice} 
//                 onChange={(e) => setMaxPrice(e.target.value)} 
//                 className="h-9"
//              />
//            </div>
//         </div>

//         {/* Actions */}
//         <div className="pt-2 flex flex-col gap-2">
//           <Button onClick={handleSearch} className="w-full">
//              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Apply Filters"}
//           </Button>
//           <Button variant="ghost" size="sm" onClick={handleReset} className="w-full text-muted-foreground">
//             <RotateCcw className="mr-2 h-3 w-3" /> Reset
//           </Button>
//         </div>

//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Loader2, RotateCcw, DollarSign, Filter, Check, ChevronRight } from "lucide-react";
import { ICategory } from "@/types/category";
import { getCategoryOptions, FilterOptions } from "@/app/products/actions";
import { cn } from "@/lib/utils";

interface CascadingPartFinderProps {
  categories: ICategory[];
}

export default function CascadingPartFinder({ categories }: CascadingPartFinderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get("q") || "");
  
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<FilterOptions>({ brands: [], models: [], specs: [] });

  // Helper to get names for display in the header trigger
  const getCategoryName = () => categories.find(c => c._id === selectedCategory)?.name || "Select Category";

  // --- EFFECT: Load Options ---
  useEffect(() => {
    if (!selectedCategory) {
      setOptions({ brands: [], models: [], specs: [] });
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await getCategoryOptions(selectedCategory);
        setOptions(data);
        
        const currentSpecs: Record<string, string> = {};
        data.specs.forEach(s => {
            const val = searchParams.get(`spec_${s.name}`);
            if(val) currentSpecs[s.name] = val;
        });
        setSelectedSpecs(currentSpecs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [selectedCategory, searchParams]);

  // --- HANDLERS ---
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("q", selectedModel); 
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    Object.entries(selectedSpecs).forEach(([name, value]) => {
      if (value) params.set(`spec_${name}`, value);
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedModel("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedSpecs({});
    router.push("/products");
  };

  // Reusable "Link Style" Option Component
  const FilterOption = ({ 
    label, 
    isActive, 
    onClick 
  }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between group",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <span>{label}</span>
      {isActive && <Check className="h-3.5 w-3.5" />}
    </button>
  );

  return (
    <Card className="border-primary/20 shadow-sm sticky top-24 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5 text-primary" />
          Refine Search
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        
        <Accordion type="multiple" defaultValue={["category"]} className="w-full">
          
          {/* 1. CATEGORY */}
          <AccordionItem value="category" className="border-b">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
              <div className="text-left">
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">Part Type</div>
                <div className="text-sm font-medium text-primary truncate max-w-[180px]">
                  {getCategoryName()}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-2 pt-0">
              <div className="max-h-[250px] overflow-y-auto space-y-1 pt-1 pr-1">
                {categories.map((cat) => (
                  <FilterOption
                    key={cat._id}
                    label={cat.name}
                    isActive={selectedCategory === cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      // Reset dependencies
                      setSelectedBrand("");
                      setSelectedModel("");
                      setSelectedSpecs({});
                    }}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 2. MODEL (Conditional) */}
          {options.models.length > 0 && (
            <AccordionItem value="model" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="text-left">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">Model</div>
                  <div className="text-sm font-medium truncate max-w-[180px]">
                    {selectedModel || "Any Model"}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2 pt-0">
                <div className="max-h-[200px] overflow-y-auto space-y-1 pt-1 pr-1">
                  <FilterOption 
                    label="Any Model" 
                    isActive={selectedModel === ""} 
                    onClick={() => setSelectedModel("")} 
                  />
                  {options.models.map((m) => (
                    <FilterOption
                      key={m}
                      label={m}
                      isActive={selectedModel === m}
                      onClick={() => setSelectedModel(m)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* 3. BRAND */}
          {options.brands.length > 0 && (
            <AccordionItem value="brand" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="text-left">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">Brand</div>
                  <div className="text-sm font-medium truncate max-w-[180px]">
                    {selectedBrand || "Any Brand"}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2 pt-0">
                <div className="max-h-[200px] overflow-y-auto space-y-1 pt-1 pr-1">
                  <FilterOption 
                    label="Any Brand" 
                    isActive={selectedBrand === ""} 
                    onClick={() => setSelectedBrand("")} 
                  />
                  {options.brands.map((b) => (
                    <FilterOption
                      key={b}
                      label={b}
                      isActive={selectedBrand === b}
                      onClick={() => setSelectedBrand(b)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* 4. DYNAMIC SPECS */}
          {options.specs.map((spec) => (
            <AccordionItem key={spec.name} value={`spec-${spec.name}`} className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="text-left">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">{spec.name}</div>
                  <div className="text-sm font-medium truncate max-w-[180px]">
                    {selectedSpecs[spec.name] || "Any"}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2 pt-0">
                <div className="max-h-[200px] overflow-y-auto space-y-1 pt-1 pr-1">
                  <FilterOption 
                    label={`Any ${spec.name}`} 
                    isActive={!selectedSpecs[spec.name]} 
                    onClick={() => setSelectedSpecs(prev => ({ ...prev, [spec.name]: "" }))} 
                  />
                  {spec.options.map((opt) => (
                    <FilterOption
                      key={opt}
                      label={opt}
                      isActive={selectedSpecs[spec.name] === opt}
                      onClick={() => setSelectedSpecs(prev => ({ ...prev, [spec.name]: opt }))}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* 5. PRICE (Static) */}
        <div className="p-4 space-y-3 bg-muted/5 border-b">
           <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
             <DollarSign className="h-3 w-3" /> Price Range
           </Label>
           <div className="flex items-center gap-2">
             <Input 
                type="number" 
                placeholder="Min" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                className="h-9 bg-background"
             />
             <span className="text-muted-foreground">-</span>
             <Input 
                type="number" 
                placeholder="Max" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="h-9 bg-background"
             />
           </div>
        </div>

        {/* ACTIONS */}
        <div className="p-4 flex flex-col gap-2 bg-muted/10">
          <Button onClick={handleSearch} className="w-full font-bold shadow-sm" disabled={loading}>
             {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Apply Filters"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="w-full text-muted-foreground hover:text-red-500 hover:bg-red-50">
            <RotateCcw className="mr-2 h-3 w-3" /> Reset All
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
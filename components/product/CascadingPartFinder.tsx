// components/product/CascadingPartFinder.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; // Import Input
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
//   const [selectedModel, setSelectedModel] = useState<string>(searchParams.get("modelCompatibility") || "");
  
//   // Price State (Strings to allow empty inputs)
//   const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
//   const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");

//   // Specs State
//   const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  
//   const [loading, setLoading] = useState(false);
//   const [options, setOptions] = useState<FilterOptions>({ brands: [], models: [], specs: [] });

//   // --- EFFECT: Load Options ---
//   useEffect(() => {
//     if (!selectedCategory) {
//       setOptions({ brands: [], models: [], specs: [] });
//       return;
//     }

//     // Only fetch if we switched categories or initial load
//     const fetchOptions = async () => {
//       setLoading(true);
//       try {
//         const data = await getCategoryOptions(selectedCategory);
//         setOptions(data);
        
//         // Restore specs from URL if they exist for this category
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
//   }, [selectedCategory, searchParams]); // Depend on searchParams to sync URL changes

//   // --- HANDLERS ---
//   const handleSearch = () => {
//     const params = new URLSearchParams();
    
//     // Core Filters
//     if (selectedCategory) params.set("category", selectedCategory);
//     if (selectedBrand) params.set("brand", selectedBrand);
//     // Use 'q' for model search to piggyback on text search, or add specific model logic in page.tsx
//     // For this example, I'll use 'q' as it's the most reliable fallback without changing backend logic
//     if (selectedModel) params.set("q", selectedModel); 

//     // Price Filters
//     if (minPrice) params.set("minPrice", minPrice);
//     if (maxPrice) params.set("maxPrice", maxPrice);

//     // Spec Filters
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
//             <SelectContent>
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
//              <Select 
//                disabled={!selectedCategory || loading || options.models.length === 0} 
//                value={selectedModel} 
//                onValueChange={setSelectedModel}
//              >
//               <SelectTrigger>
//                 <SelectValue placeholder="Model" />
//               </SelectTrigger>
//               <SelectContent>
//                 {options.models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//               </SelectContent>
//             </Select>

//              <Select 
//                disabled={!selectedCategory || loading || options.brands.length === 0}
//                value={selectedBrand} 
//                onValueChange={setSelectedBrand}
//              >
//               <SelectTrigger>
//                 <SelectValue placeholder="Brand" />
//               </SelectTrigger>
//               <SelectContent>
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
//                    <SelectContent>
//                      {spec.options.map((opt) => (
//                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
//                      ))}
//                    </SelectContent>
//                  </Select>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 4. Price Range (Inputs) */}
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 
import { Search, Loader2, RotateCcw, DollarSign } from "lucide-react";
import { ICategory } from "@/types/category";
import { getCategoryOptions, FilterOptions } from "@/app/products/actions";

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

  return (
    <Card className="border-primary/20 shadow-sm sticky top-24">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-primary" />
          Advanced Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        
        {/* 1. Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Part Type</Label>
          <Select value={selectedCategory} onValueChange={(val) => {
             setSelectedCategory(val);
             setSelectedBrand("");
             setSelectedModel("");
             setSelectedSpecs({});
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Category..." />
            </SelectTrigger>
            
            {/* FIX: SCROLLABLE CATEGORY LIST */}
            <SelectContent className="max-h-[250px] overflow-y-auto">
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Vehicle / Brand */}
        <div className="space-y-1.5">
           <Label className="text-xs font-semibold text-muted-foreground uppercase">Vehicle / Brand</Label>
           <div className="grid grid-cols-2 gap-2">
             {/* Model Dropdown */}
             <Select 
               disabled={!selectedCategory || loading || options.models.length === 0} 
               value={selectedModel} 
               onValueChange={setSelectedModel}
             >
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              {/* FIX: SCROLLABLE MODEL LIST */}
              <SelectContent className="max-h-[250px] overflow-y-auto">
                {options.models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

             {/* Brand Dropdown */}
             <Select 
               disabled={!selectedCategory || loading || options.brands.length === 0}
               value={selectedBrand} 
               onValueChange={setSelectedBrand}
             >
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              {/* FIX: SCROLLABLE BRAND LIST */}
              <SelectContent className="max-h-[250px] overflow-y-auto">
                {options.brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
           </div>
        </div>

        {/* 3. Specs (Dynamic) */}
        {options.specs.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Specifications</Label>
            {options.specs.map((spec) => (
              <div key={spec.name}>
                 <Select 
                   value={selectedSpecs[spec.name] || ""} 
                   onValueChange={(val) => setSelectedSpecs(prev => ({ ...prev, [spec.name]: val }))}
                 >
                   <SelectTrigger className="h-9 text-sm">
                     <SelectValue placeholder={`Select ${spec.name}`} />
                   </SelectTrigger>
                   {/* FIX: SCROLLABLE SPECS LIST */}
                   <SelectContent className="max-h-[250px] overflow-y-auto">
                     {spec.options.map((opt) => (
                       <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>
            ))}
          </div>
        )}

        {/* 4. Price Range */}
        <div className="space-y-1.5 pt-2 border-t">
           <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
             <DollarSign className="h-3 w-3" /> Price Range
           </Label>
           <div className="flex items-center gap-2">
             <Input 
                type="number" 
                placeholder="Min" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                className="h-9"
             />
             <span className="text-muted-foreground">-</span>
             <Input 
                type="number" 
                placeholder="Max" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="h-9"
             />
           </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <Button onClick={handleSearch} className="w-full">
             {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Apply Filters"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="w-full text-muted-foreground">
            <RotateCcw className="mr-2 h-3 w-3" /> Reset
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
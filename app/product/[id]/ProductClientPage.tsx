// // src/app/product/[id]/ProductClientPage.tsx
// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useAppDispatch } from "@/redux/hooks";
// import { addItem } from "@/redux/slices/cartSlice";
// import { IProduct, IVariant } from "@/types/product";
// import { Button } from "@/components/ui/button";

// interface ProductClientPageProps {
//   product: IProduct;
// }

// export default function ProductClientPage({ product }: ProductClientPageProps) {
//   const dispatch = useAppDispatch();
//   // State to track the currently selected variant
//   const [selectedVariant, setSelectedVariant] = useState<IVariant | undefined>(
//     product.variants.length > 0 ? product.variants[0] : undefined
//   );

//   const handleAddToCart = () => {
//     if (selectedVariant) {
//       dispatch(addItem({ product, selectedVariant }));
//       // Add toast notification here
//     }
//   };

//   return (
//     <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//       <div>
//         <Image
//           src={product.images[0] || "/placeholder-product.png"}
//           alt={product.name}
//           width={800}
//           height={600}
//           className="rounded-lg object-cover w-full"
//           priority
//         />
//       </div>
//       <div className="flex flex-col gap-4">
//         <p className="font-semibold text-primary">{product.brand}</p>
//         <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
//         {/* Price and Stock now depend on the selected variant */}
//         <p className="text-3xl font-bold">
//           ${selectedVariant ? selectedVariant.price.toFixed(2) : product.displayPrice.toFixed(2)}
//         </p>
//         <div className="prose text-muted-foreground mt-4">
//           <p>{product.description}</p>
//         </div>
//         {/* TODO: Add Variant selection UI (e.g., dropdowns or swatches) here */}
//         <p className="text-muted-foreground text-sm">Variant selection UI will go here.</p>
//         <div className="mt-6 flex flex-col gap-4">
//           <p className="text-sm">
//             Stock: <span className="font-semibold">
//               {selectedVariant ? `${selectedVariant.stock} units available` : "Select a variant"}
//             </span>
//           </p>
//           <Button size="lg" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice";
import { IProduct, IVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  ShoppingCart,
  Check
} from "lucide-react";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import { cn } from "@/lib/utils";

interface ProductClientPageProps {
  product: IProduct;
}

export default function ProductClientPage({ product }: ProductClientPageProps) {
  const dispatch = useAppDispatch();
  
  // -- STATE --
  const [selectedVariant, setSelectedVariant] = useState<IVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  // -- LOGIC: VARIANT GROUPING --
  // We assume most variants share the same attribute structure (e.g. all have "Condition")
  // We grab the first attribute name to create a "Chip" selector.
  const primaryAttributeName = product.variants[0]?.attributes[0]?.name;

  // -- HANDLERS --
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newVal = prev + delta;
      if (newVal < 1) return 1;
      // Cap at stock if variant is selected
      if (selectedVariant && newVal > selectedVariant.stock) return selectedVariant.stock;
      return newVal;
    });
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(addItem({ 
        product, 
        selectedVariant, 
        quantity // Ensure your cartSlice handles an optional initial quantity, otherwise dispatch multiple times or update slice
      }));
      // In a real app, trigger a Toast here
    }
  };

  // Determine pricing display
  const currentPrice = selectedVariant ? selectedVariant.price : product.displayPrice;
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  return (
    <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
      
      {/* LEFT COLUMN: Gallery */}
      <ProductImageGallery 
        images={product.images} 
        productName={product.name} 
      />

      {/* RIGHT COLUMN: Info & Actions */}
      <div className="flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="border-b pb-6 space-y-2">
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="text-muted-foreground">{product.brand}</Badge>
             {product.yearRange?.start && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {product.yearRange.start} - {product.yearRange.end || "Present"}
                </span>
             )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 mt-4">
             <span className="text-3xl font-bold text-primary">
               ${currentPrice.toFixed(2)}
             </span>
             <span className="text-sm text-muted-foreground mb-1">/ unit</span>
             {isOutOfStock && (
               <Badge variant="destructive" className="mb-1 ml-2">Out of Stock</Badge>
             )}
          </div>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 1 && primaryAttributeName && (
          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground">
              {primaryAttributeName}: <span className="text-muted-foreground font-normal">{selectedVariant?.attributes[0]?.value}</span>
            </span>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => {
                const attrValue = variant.attributes[0]?.value || "Default";
                const isSelected = selectedVariant?._id === variant._id;
                
                return (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1); // Reset quantity on switch
                    }}
                    disabled={variant.stock === 0}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm font-medium transition-all relative overflow-hidden",
                      isSelected 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                        : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground",
                      variant.stock === 0 && "opacity-50 cursor-not-allowed decoration-slice line-through"
                    )}
                  >
                    {attrValue}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-primary transform translate-x-1.5 -translate-y-1.5 rotate-45" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity & Cart Actions */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Stepper */}
            <div className="flex items-center border rounded-md">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-3 hover:bg-muted disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={isOutOfStock || (selectedVariant && quantity >= selectedVariant.stock)}
                className="p-3 hover:bg-muted disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <span className="text-sm text-muted-foreground">
              {selectedVariant ? `${selectedVariant.stock} available` : "Select options"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              className="flex-1 h-12 text-base" 
              onClick={handleAddToCart} 
              disabled={isOutOfStock || !selectedVariant}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="h-12">
              Contact Supplier
            </Button>
          </div>
        </div>

        {/* Trust Badges (Alibaba Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y bg-muted/10 p-4 rounded-lg mt-2">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase">Trade Assurance</span>
                <span className="text-[10px] text-muted-foreground">Protects your order</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                <Truck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase">Fast Delivery</span>
                <span className="text-[10px] text-muted-foreground">Local warehouses</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase">7 Days Return</span>
                <span className="text-[10px] text-muted-foreground">If goods damaged</span>
              </div>
           </div>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="desc" className="w-full mt-4">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="desc" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
              Description
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
              Compatibility & Specs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="pt-4 animate-in fade-in slide-in-from-bottom-2">
             <div className="prose dark:prose-invert max-w-none text-muted-foreground">
               <p className="whitespace-pre-line">{product.description}</p>
             </div>
          </TabsContent>
          <TabsContent value="specs" className="pt-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Vehicle Compatibility</h4>
                {product.modelCompatibility && product.modelCompatibility.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.modelCompatibility.map((model, i) => (
                      <Badge key={i} variant="secondary">{model}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Universal fit or see description.</p>
                )}
              </div>
              <div className="border rounded-lg p-4">
                 <h4 className="font-semibold mb-2">Specifications</h4>
                 <ul className="text-sm space-y-2">
                   <li className="flex justify-between border-b pb-1">
                     <span className="text-muted-foreground">Brand</span>
                     <span>{product.brand}</span>
                   </li>
                   <li className="flex justify-between border-b pb-1">
                     <span className="text-muted-foreground">Part SKU</span>
                     <span>{selectedVariant?.sku || product.variants[0].sku}</span>
                   </li>
                   {selectedVariant?.attributes.map((attr, i) => (
                      <li key={i} className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">{attr.name}</span>
                        <span>{attr.value}</span>
                      </li>
                   ))}
                 </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
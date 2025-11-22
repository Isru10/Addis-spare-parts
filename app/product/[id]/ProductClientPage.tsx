// src/app/product/[id]/ProductClientPage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice";
import { IProduct, IVariant } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductClientPageProps {
  product: IProduct;
}

export default function ProductClientPage({ product }: ProductClientPageProps) {
  const dispatch = useAppDispatch();
  // State to track the currently selected variant
  const [selectedVariant, setSelectedVariant] = useState<IVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(addItem({ product, selectedVariant }));
      // Add toast notification here
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <Image
          src={product.images[0] || "/placeholder-product.png"}
          alt={product.name}
          width={800}
          height={600}
          className="rounded-lg object-cover w-full"
          priority
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-primary">{product.brand}</p>
        <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
        {/* Price and Stock now depend on the selected variant */}
        <p className="text-3xl font-bold">
          ${selectedVariant ? selectedVariant.price.toFixed(2) : product.displayPrice.toFixed(2)}
        </p>
        <div className="prose text-muted-foreground mt-4">
          <p>{product.description}</p>
        </div>
        {/* TODO: Add Variant selection UI (e.g., dropdowns or swatches) here */}
        <p className="text-muted-foreground text-sm">Variant selection UI will go here.</p>
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm">
            Stock: <span className="font-semibold">
              {selectedVariant ? `${selectedVariant.stock} units available` : "Select a variant"}
            </span>
          </p>
          <Button size="lg" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
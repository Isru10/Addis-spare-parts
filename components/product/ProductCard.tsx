// // src/components/product/ProductCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import { IProduct } from "@/types/product";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (product.variants.length > 0) {
      const selectedVariant = product.variants[0];
      dispatch(addItem({
        product: product,
        selectedVariant: selectedVariant
      }));
    }
  };

  return (
    <Card className="group h-full flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-card">
      
      {/* 1. Image Header */}
      <Link href={`/product/${product._id}`} className="block w-full">
        <CardHeader className="p-0 relative aspect-square bg-muted/5 border-b">
          <Image
            src={product.images[0] || "/placeholder-product.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </CardHeader>
      </Link>

      {/* 2. Content */}
      <CardContent className="p-2 flex flex-col gap-0.5 flex-grow">
        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider truncate leading-none mb-0.5">
          {product.brand}
        </p>
        
        <Link href={`/product/${product._id}`} className="block group/link space-y-0.5">
          <h3 
            className="text-xs sm:text-sm font-semibold text-foreground truncate h-5 leading-5 group-hover/link:text-primary transition-colors" 
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate h-4 leading-4 block">
            {product.description}
          </p>
        </Link>
      </CardContent>

      {/* 3. Footer */}
      <CardFooter className="p-2 pt-0 flex items-end justify-between gap-1 mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground leading-none mb-0.5">From</span>
          <span className="text-sm sm:text-base font-bold text-primary leading-none">
            ${product.displayPrice.toFixed(2)}
          </span>
        </div>

        {/* FIX: Icon Only Button */}
        <Button 
          onClick={handleAddToCart} 
          disabled={product.variants.length === 0}
          size="icon" // Using size="icon" base
          className={cn(
            "h-8 w-8 p-0 rounded-md shrink-0", // Fixed square size, no padding
            "bg-primary hover:bg-primary/90 shadow-sm"
          )}
          title="Add to Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button> 
      </CardFooter>
    </Card>
  );
}
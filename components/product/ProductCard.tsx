// src/components/product/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { IProduct } from "@/types/product";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice"; // This action now expects AddItemPayload

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (product.variants.length > 0) {
      // For a simple "Add to Cart" on the card, we'll add the first variant.
      const selectedVariant = product.variants[0];
      
      // THE FIX: Create the correct payload object that the addItem action expects
      const payload = {
        product: product,
        selectedVariant: selectedVariant
      };
      
      dispatch(addItem(payload));
      console.log(`${product.name} (${selectedVariant.sku}) added to cart`);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/product/${product._id}`}>
          <Image
            src={product.images[0] || "/placeholder-product.png"}
            alt={product.name}
            width={400}
            height={300}
            className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <CardTitle className="text-lg font-semibold mt-1 h-14">
          <Link href={`/product/${product._id}`}>{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold">
          <span className="text-sm font-normal text-muted-foreground">From </span>
          ${product.displayPrice.toFixed(2)}
        </p>
        <Button onClick={handleAddToCart} disabled={product.variants.length === 0}>
          Add to Cart
        </Button> 
      </CardFooter>
    </Card>
  );
}
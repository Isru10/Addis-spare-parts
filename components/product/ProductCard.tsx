// // src/components/product/ProductCard.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "../ui/button";
// import { IProduct } from "@/types/product";
// import { useAppDispatch } from "@/redux/hooks";
// import { addItem } from "@/redux/slices/cartSlice"; // This action now expects AddItemPayload

// interface ProductCardProps {
//   product: IProduct;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const dispatch = useAppDispatch();

//   const handleAddToCart = () => {
//     if (product.variants.length > 0) {
//       // For a simple "Add to Cart" on the card, we'll add the first variant.
//       const selectedVariant = product.variants[0];
      
//       // THE FIX: Create the correct payload object that the addItem action expects
//       const payload = {
//         product: product,
//         selectedVariant: selectedVariant
//       };
      
//       dispatch(addItem(payload));
//       console.log(`${product.name} (${selectedVariant.sku}) added to cart`);
//     }
//   };

//   return (
//     <Card className="overflow-hidden flex flex-col">
//       <CardHeader className="p-0">
//         <Link href={`/product/${product._id}`}>
//           <Image
//             src={product.images[0] || "/placeholder-product.png"}
//             alt={product.name}
//             width={400}
//             height={300}
//             className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
//             loading="lazy"
//           />
//         </Link>
//       </CardHeader>
//       <CardContent className="p-4 flex-grow">
//         <p className="text-sm text-muted-foreground">{product.brand}</p>
//         <CardTitle className="text-lg font-semibold mt-1 h-14">
//           <Link href={`/product/${product._id}`}>{product.name}</Link>
//         </CardTitle>
//       </CardContent>
//       <CardFooter className="p-4 flex justify-between items-center">
//         <p className="text-xl font-bold">
//           <span className="text-sm font-normal text-muted-foreground">From </span>
//           ${product.displayPrice.toFixed(2)}
//         </p>
//         <Button onClick={handleAddToCart} disabled={product.variants.length === 0}>
//           Add to Cart
//         </Button> 
//       </CardFooter>
//     </Card>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { IProduct } from "@/types/product";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (product.variants.length > 0) {
      // Add logic (default to first variant)
      const selectedVariant = product.variants[0];
      const payload = {
        product: product,
        selectedVariant: selectedVariant
      };
      dispatch(addItem(payload));
    }
  };

  return (
    <Card className="group h-full flex flex-col border shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* 1. Image Header - Tighter aspect ratio (Square) */}
      <CardHeader className="p-0 relative aspect-square bg-muted/10 border-b">
        <Link href={`/product/${product._id}`} className="block w-full h-full">
          <Image
            src={product.images[0] || "/placeholder-product.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </CardHeader>

      {/* 2. Content - Reduced Padding & Gaps */}
      <CardContent className="p-2 flex flex-col gap-1 flex-grow">
        
        {/* Brand (Tiny) */}
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          {product.brand}
        </p>
        
        <Link href={`/product/${product._id}`}>
          {/* Title - Clamped to 1 line to save vertical space */}
          <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-foreground">
            {product.name}
          </h3>
          
          {/* Description - Clamped to 2 lines as requested */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-snug mt-1">
            {product.description}
          </p>
        </Link>
      </CardContent>

      {/* 3. Footer - Compact */}
      <CardFooter className="p-2 pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-none">From</span>
          <span className="text-sm sm:text-base font-bold text-primary leading-tight">
            ${product.displayPrice.toFixed(2)}
          </span>
        </div>

        {/* Smaller Button */}
        <Button 
          onClick={handleAddToCart} 
          disabled={product.variants.length === 0}
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <ShoppingCart className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Add</span>
        </Button> 
      </CardFooter>
    </Card>
  );
}
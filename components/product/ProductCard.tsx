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
    e.preventDefault(); // Prevent navigation if clicked on the button
    
    if (product.variants.length > 0) {
      const selectedVariant = product.variants[0];
      
      const payload = {
        product: product,
        selectedVariant: selectedVariant
      };
      
      dispatch(addItem(payload));
    }
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full border shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header: Image - Aspect Square for Alibaba look */}
      <CardHeader className="p-0 relative aspect-square bg-muted/20">
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

      {/* Content: Title & Brand */}
      <CardContent className="p-2 sm:p-3 flex-grow flex flex-col gap-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {product.brand}
        </p>
        <Link href={`/product/${product._id}`} className="hover:underline">
          {/* line-clamp-2 ensures all cards stay roughly the same height even with long titles */}
          <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground/90 h-10">
            {product.name}
          </h3>
        </Link>
      </CardContent>

      {/* Footer: Price & Action */}
      <CardFooter className="p-2 sm:p-3 pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Price</span>
          <span className="text-base sm:text-lg font-bold text-primary">
            ${product.displayPrice.toFixed(2)}
          </span>
        </div>

        <Button 
          onClick={handleAddToCart} 
          disabled={product.variants.length === 0}
          size="sm"
          className="h-8 px-3 text-xs shadow-sm"
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
        </Button> 
      </CardFooter>
    </Card>
  );
}
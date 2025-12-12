"use client";

import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function FeaturedCarousel({ products }: { products: IProduct[] }) {
  if (products.length === 0) return null;

  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl">
      <h2 className="text-lg font-bold mb-3 tracking-tight px-1">Featured Deals</h2>
      
      {/* Scroll Container */}
      <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
        <div className="flex gap-3 w-max px-1">
          {products.map((product) => (
            <div 
              key={product._id} 
              // FIX: Mobile width is fixed 280px. Safe for all phones.
              // Desktop width is 600px.
              className="snap-center w-[280px] md:w-[600px] h-[200px] md:h-[300px] relative rounded-xl overflow-hidden group border bg-background shrink-0"
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
              
              <Image
                src={product.images[0] || "/placeholder-product.png"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 z-20 p-4 md:p-8 flex flex-col justify-center items-start text-white gap-2">
                <Badge className="bg-brand-orange text-white border-none mb-1 text-[10px] md:text-xs">Featured</Badge>
                
                <h2 className="text-lg md:text-2xl font-bold max-w-[200px] md:max-w-md line-clamp-2 leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-lg md:text-xl font-bold text-white">
                    ${product.displayPrice.toFixed(2)}
                  </div>
                  <Button asChild size="sm" className="rounded-full bg-white text-black hover:bg-white/90 h-7 text-[10px] md:text-xs px-3">
                    <Link href={`/product/${product._id}`}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
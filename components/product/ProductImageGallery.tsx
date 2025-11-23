// src/components/product/ProductImageGallery.tsx


"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder-product.png");
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    // FIX APPLIED HERE:
    // 1. Removed 'sticky top-24'
    // 2. Added 'relative' (for mobile)
    // 3. Added 'md:sticky md:top-24' (so it only sticks on desktop/tablet)
    // 4. Added 'h-fit' to ensure it doesn't stretch weirdly
    <div className="flex flex-col-reverse md:flex-row gap-4 relative md:sticky md:top-24 h-fit">
      
      {/* Thumbnails Strip */}
      {/* Mobile: Horizontal scroll | Desktop: Vertical column */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 rounded-md overflow-hidden transition-all",
              selectedImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/50"
            )}
          >
            <Image 
              src={img} 
              alt={`${productName} thumbnail ${index}`} 
              fill 
              className="object-cover" 
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative w-full aspect-square bg-white border rounded-lg overflow-hidden cursor-crosshair group z-10"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-contain p-2"
          priority
        />

        {/* Zoom Overlay - Only visible on Desktop hover */}
        {showZoom && (
          <div 
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat"
            }}
          />
        )}
      </div>
    </div>
  );
}
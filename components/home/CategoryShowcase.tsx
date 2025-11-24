// src/components/home/CategoryShowcase.tsx

import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

async function getTopCategories() {
  await dbConnect();
  // Fetch root categories (no parent), limit to 6
  const categories = await Category.find({ 
    parentCategory: null, 
    isActive: true 
  })
  .sort({ name: 1 })
  .limit(6)
  .lean();
  
  return JSON.parse(JSON.stringify(categories));
}

export default async function CategoryShowcase() {
  const categories = await getTopCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat: any) => (
        <Link key={cat._id} href={`/products?category=${cat._id}`} className="group block h-full">
          <Card className="h-full border-muted hover:border-primary transition-all hover:shadow-md bg-muted/20 hover:bg-background">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-3">
              <div className="relative w-16 h-16 rounded-full bg-background border flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground/30">
                    {cat.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ChevronRight className="h-3 w-3" />
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
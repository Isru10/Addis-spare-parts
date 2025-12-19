// src/components/home/FeaturedProducts.tsx
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/types/product";

async function getFeaturedProducts() {
  await dbConnect();
  // Fetch 10 featured items (sorted by price or specific 'featured' flag)
  const products = await Product.find({ isActive: true })
    .sort({ displayPrice: -1 }) // or createdAt: -1
    .limit(10) // Fetch 10 items
    .lean<IProduct[]>();
  
  return JSON.parse(JSON.stringify(products));
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">No featured products available.</p>;
  }

  return (
    // FIX: grid-cols-2 on mobile ensures 2 items per row
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
      {products.map((product: IProduct) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
// src/components/home/FeaturedProducts.tsx

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "../product/ProductCard";
import { IProduct } from "@/types/product"; // <-- IMPORT the new type

export default async function FeaturedProducts() {
  await dbConnect();

  // Tell lean() to return objects matching the IProduct shape
  const featuredProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .lean<IProduct[]>(); // <-- APPLY THE TYPE HERE

  return (
    <section className="container py-12 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          // The JSON hack is still important! It converts the MongoDB ObjectId (_id)
          // and dates into simple strings that can be passed from a Server Component to a Client Component.
          <ProductCard
            key={product._id.toString()}
            product={JSON.parse(JSON.stringify(product))}
          />
        ))}
      </div>
    </section>
  );
}
// // src/app/product/[id]/page.tsx

// import { notFound } from "next/navigation";
// import type { Metadata } from 'next';
// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import { IProduct } from "@/types/product";
// import ProductClientPage from "./ProductClientPage"; // This remains our client component

// // This data-fetching function is correct and does not need changes.
// async function getProduct(id: string): Promise<IProduct | null> {
//   await dbConnect(); 
//   const product = await Product.findById(id).lean<IProduct>();
//   return product;
// }

// // SEO: The generateMetadata function signature also needs to be updated.
// export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
//   const { id } = await params; // Await params here as well
//   const product = await getProduct(id);

//   if (!product) {
//     return { title: "Product Not Found" };
//   }

//   return {
//     title: `${product.name} | Addis Spare Parts`,
//     description: product.description,
//   };
// }

// // ==========================================================
// // THE FIX IS APPLIED HERE
// // ==========================================================
// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>; // <-- Fix 1: params is a Promise
// }) {
//   const { id } = await params; // <-- Fix 2: await params to get the value
//   const product = await getProduct(id);

//   if (!product) {
//     notFound();
//   }

//   // The server component's only job is to fetch data and pass it down.
//   // The JSON methods are crucial for serializing data for the client component.
//   return (
//     <div className="container py-12 md:py-24">
//       <ProductClientPage product={JSON.parse(JSON.stringify(product))} />
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { IProduct } from "@/types/product";
import ProductClientPage from "./ProductClientPage"; 
import ProductCard from "@/components/product/ProductCard"; // Reusing your Alibaba-style card

// 1. Fetch Main Product
async function getProduct(id: string): Promise<IProduct | null> {
  await dbConnect(); 
  const product = await Product.findById(id).lean<IProduct>();
  return product;
}

// 2. NEW: Fetch Related Products (Same Category, excluding current one)
async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<IProduct[]> {
  await dbConnect();
  
  // Find products with same category, excluding the current ID, limit to 4
  const products = await Product.find({
    category: categoryId,
    _id: { $ne: currentProductId }, // $ne means "Not Equal"
    isActive: true
  })
  .sort({ createdAt: -1 }) // Newest first
  .limit(4) // Show 4 related items
  .lean<IProduct[]>();

  return products;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Addis Parts`,
    description: product.description.substring(0, 160),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    }
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch main product
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Fetch related products based on the current product's category
  const relatedProducts = await getRelatedProducts(product.category, product._id);

  return (
    <div className="container py-8 md:py-12 space-y-16">
      
      {/* 1. Main Product Details (Client Component) */}
      <ProductClientPage product={JSON.parse(JSON.stringify(product))} />

      {/* 2. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          
          {/* Reusing the Grid Layout from the main products page */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related._id.toString()}
                product={JSON.parse(JSON.stringify(related))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
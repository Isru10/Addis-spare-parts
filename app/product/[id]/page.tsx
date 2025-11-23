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

async function getProduct(id: string): Promise<IProduct | null> {
  await dbConnect(); 
  const product = await Product.findById(id).lean<IProduct>();
  return product;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Addis Parts`, // Changed to Addis Parts
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
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <ProductClientPage product={JSON.parse(JSON.stringify(product))} />
    </div>
  );
}
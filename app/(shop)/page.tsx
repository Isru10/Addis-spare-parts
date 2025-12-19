// // src/app/page.tsx
// import { Suspense } from "react";
// import HeroSection from "@/components/home/HeroSection";
// import FeaturedProducts from "@/components/home/FeaturedProducts";

// // This is a loading skeleton component for the suspense fallback.
// // You could create this in a separate file too.
// function FeaturedProductsSkeleton() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <div key={i} className="bg-muted rounded-lg h-96 animate-pulse"></div>
//       ))}
//     </div>
//   );
// }

// // Set up Incremental Static Regeneration (ISR)
// // This page will be statically generated and re-validated every hour.
// export const revalidate = 3600; // 3600 seconds = 1 hour

// export default function HomePage() {
//   return (
//     <div>
//       <HeroSection />

//       <Suspense fallback={
//         <section className="container py-12 md:py-24">
//           <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
//             Featured Products
//           </h2>
//           <FeaturedProductsSkeleton />
//         </section>
//       }>
//         <FeaturedProducts />
//       </Suspense>

//       {/* Placeholder for Category Cards section */}
//       <section id="categories" className="container py-12 md:py-24 bg-muted">
//          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
//            Shop by Category
//          </h2>
//          <div className="text-center">
//             {/* Category logic will go here */}
//             <p>Category cards will be displayed here.</p>
//          </div>
//       </section>
//     </div>
//   );
// }

import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase"; // The new component
import { ShieldCheck, Truck, Clock, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PopularModels from "@/components/home/PopularModels";
/* eslint-disable @typescript-eslint/no-explicit-any */

// Loading Skeletons
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted/50 rounded-lg h-72 animate-pulse" />
      ))}
    </div>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
       {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-muted/50 rounded-lg h-32 animate-pulse" />
      ))}
    </div>
  )
}

export const revalidate = 3600; 

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      
      {/* 1. Hero Carousel */}
      <HeroSection />

       <PopularModels />
{/* insurance part */}




 <section className="container">
        <div className=" rounded-2xl p-8 md:p-12  flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 ">
              <Building2 className="h-6 w-6" />
              <span className="font-semibold tracking-wide uppercase text-xs">For Insurance Companies</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Streamline Your Claims Process
            </h2>
            <p className=" text-lg">
              Partner with us for verified market quotations, genuine parts supply, and digital proforma management. Reduce fraud and speed up settlements.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button asChild size="lg" className=" hover:bg-blue-50 hover:text-black font-bold h-12 px-8">
              <Link href="/insurer/register">
                Register as Partner
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-400 hover:bg-blue-800 hover:text-white h-12 px-8">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>






      {/* 3. Featured Products */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Products</h2>
           <a href="/products" className="text-sm font-semibold text-primary hover:underline">View All &rarr;</a>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* 4. Shop by Category */}
      <section id="categories" className="py-12 bg-muted/30 border-y">
         <div className="container">
           <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
             Shop by Category
           </h2>
           <Suspense fallback={<CategoryGridSkeleton />}>
             <CategoryShowcase />
           </Suspense>
         </div>
      </section>




 {/* 2. Trust Strip (Why Choose Us) */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-xl border bg-card shadow-sm">
          <FeatureItem icon={Truck} title="Fast Delivery" desc="Within Addis Ababa" />
          <FeatureItem icon={ShieldCheck} title="Genuine Parts" desc="Quality Guaranteed" />
          <FeatureItem icon={Clock} title="24/7 Support" desc="Expert Assistance" />
          <FeatureItem icon={CreditCard} title="Secure Payment" desc="Safe Transactions" />
        </div>
      </section>
    </div>
  );
}

// Helper for the Trust Strip
function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
      <div className="p-2.5 bg-primary/10 text-primary rounded-full">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
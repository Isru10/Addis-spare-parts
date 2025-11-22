// src/app/page.tsx
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

// This is a loading skeleton component for the suspense fallback.
// You could create this in a separate file too.
function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted rounded-lg h-96 animate-pulse"></div>
      ))}
    </div>
  );
}

// Set up Incremental Static Regeneration (ISR)
// This page will be statically generated and re-validated every hour.
export const revalidate = 3600; // 3600 seconds = 1 hour

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={
        <section className="container py-12 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <FeaturedProductsSkeleton />
        </section>
      }>
        <FeaturedProducts />
      </Suspense>

      {/* Placeholder for Category Cards section */}
      <section id="categories" className="container py-12 md:py-24 bg-muted">
         <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
           Shop by Category
         </h2>
         <div className="text-center">
            {/* Category logic will go here */}
            <p>Category cards will be displayed here.</p>
         </div>
      </section>
    </div>
  );
}
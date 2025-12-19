

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ChevronRight, ArrowRight } from "lucide-react";

// const SLIDES = [
//   {
//     id: 1,
//     title: "The Right Parts, Right Away",
//     description: "Your one-stop shop for reliable car spare parts in Addis Ababa. Genuine parts guaranteed.",
//     image: "/eng/eng1.jpg", // Placeholder: Engine
//     cta: "Find Parts",
//     link: "/products"
//   },
//   {
//     id: 2,
//     title: "Upgrade Your Ride",
//     description: "From performance brakes to suspension kits, find the upgrades that make a difference.",
//     image: "/eng/eng2.jpg", // Placeholder: Car Detail
//     cta: "Shop Upgrades",
//     link: "/"
//   },
//   {
//     id: 3,
//     title: "Keep It Running Smoothly",
//     description: "Essential maintenance parts—filters, oil, and belts—at unbeatable prices.",
//     image: "/eng/eng3.jpg", // Placeholder: Mechanic
//     cta: "Maintenance",
//     link: "/products"
//   }
// ];

// export default function HeroSection() {
//   const [current, setCurrent] = useState(0);

//   // Auto-play logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % SLIDES.length);
//     }, 5000); // Change every 5 seconds
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black text-white">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={current}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.7 }}
//           className="absolute inset-0 w-full h-full"
//         >
//           {/* Background Image */}
//           <Image
//             src={SLIDES[current].image}
//             alt={SLIDES[current].title}
//             fill
//             className="object-cover opacity-60" // Dimmed image for text readability
//             priority
//           />
          
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
//         </motion.div>
//       </AnimatePresence>

//       {/* Text Content */}
//       <div className="container relative h-full flex flex-col justify-center z-10">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={current} // Key change triggers animation
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="max-w-2xl space-y-6"
//           >
//             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
//               {SLIDES[current].title}
//             </h1>
//             <p className="text-lg md:text-xl text-gray-200">
//               {SLIDES[current].description}
//             </p>
//             <div className="flex gap-4 pt-2">
//               <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white border-0 font-semibold h-12 px-8">
//                 <Link href={SLIDES[current].link}>
//                   {SLIDES[current].cta} <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors">
//                 <Link href="/">About Us</Link>
//               </Button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//         {SLIDES.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               index === current ? "w-8 bg-brand-orange" : "w-2 bg-white/50 hover:bg-white"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Settings2, Globe, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// IMAGES FOR LEFT CARD (Dark Theme)
const INVENTORY_IMAGES = [
  "/eng/eng2.jpg", 
  "/eng/eng1.jpg", 
];

// IMAGES FOR RIGHT CARD (Light Theme)
// Use images that look good in grayscale/high-key
const IMPORT_IMAGES = [
  "/eng/eng1.jpg", // Example: Shipment / Cargo
  "/eng/eng2.jpg", // Example: Mechanic working
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  // Background Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % 2), 6000); // 6s interval
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?q=${query}`);
  };

  return (
    <section className="container py-6 md:py-8">
      <div className="grid lg:grid-cols-2 gap-6 h-auto md:h-[500px]">
        
        {/* 1. LEFT CARD: INVENTORY SEARCH (Black Theme) */}
        <div className="relative rounded-3xl overflow-hidden bg-black text-white border border-black/10 shadow-2xl flex flex-col justify-between p-8 md:p-12 min-h-[400px]">
          
          {/* Background Carousel */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <Image 
                src={INVENTORY_IMAGES[index]} 
                alt="Stock" 
                fill 
                className="object-cover grayscale"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-300 text-xs font-bold uppercase tracking-widest mb-4">
              <Box className="h-4 w-4" /> Ready Stock
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">
              Instant Parts<br />Lookup.
            </h1>
          </div>

          <div className="relative z-10 space-y-4">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                placeholder="Search by Part Name..." 
                className="h-16 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 text-lg focus-visible:ring-white/50 focus-visible:bg-white/20 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 h-12 w-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Or browse by vehicle:</span>
              <Button asChild variant="outline" size="sm" className="rounded-full border-white/30 text-white hover:bg-white hover:text-black h-8 text-xs bg-transparent">
                <Link href="/products">
                  <Settings2 className="mr-2 h-3 w-3" /> Advanced Filter
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 2. RIGHT CARD: REQUEST IMPORT (White Theme) */}
        <div className="relative rounded-3xl overflow-hidden bg-white text-black border border-gray-200 shadow-xl flex flex-col justify-between p-8 md:p-12 min-h-[400px]">
          
          {/* Background Carousel - SUBTLE */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.08, scale: 1 }} // Very low opacity (8%) to keep it subtle
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <Image 
                src={IMPORT_IMAGES[index]} 
                alt="Import" 
                fill 
                className="object-cover grayscale" // Grayscale prevents color clashes
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
              <Globe className="h-4 w-4" /> Global Sourcing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">
              Special<br />Imports.
            </h1>
            <p className="text-gray-600 text-lg max-w-xs font-medium leading-relaxed">
              We source hard-to-find parts directly from Dubai & China.
            </p>
          </div>

          <div className="relative z-10 pt-8">
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div className="text-sm font-semibold text-gray-400">
                0% Prepayment <br/> <span className="text-xs font-normal">for verified quotes</span>
              </div>
              <Button asChild className="h-14 rounded-full bg-black text-white hover:bg-gray-800 text-lg px-8 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-105 transition-all">
                <Link href="/request-part">
                  Start Request
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
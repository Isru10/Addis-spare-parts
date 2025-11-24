// // src/components/home/HeroSection.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";

// export default function HeroSection() {
//   return (
//     <section className="container grid lg:grid-cols-2 gap-8 items-center py-12 md:py-24">
//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col gap-4 items-start"
//       >
//         <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
//           The Right Parts, Right Away
//         </h1>
//         <p className="text-muted-foreground max-w-lg">
//           Your one-stop shop for reliable car spare parts in Addis Ababa.
//           Find exactly what you need with our powerful search and expert support.
//         </p>
//         <div className="flex gap-4">
//           <Button asChild size="lg">
//             <Link href="/products">Browse All Parts</Link>
//           </Button>
//           <Button asChild variant="outline" size="lg">
//             <Link href="#categories">Shop by Category</Link>
//           </Button>
//         </div>
//       </motion.div>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <Image
//           src="/part-1.jpg" // Replace with your actual hero image
//           alt="Car spare parts collage"
//           width={600}
//           height={400}
//           className="rounded-lg object-cover"
//           priority // <-- CRITICAL: Preloads the most important image on the page
//         />
//       </motion.div>
//     </section>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "The Right Parts, Right Away",
    description: "Your one-stop shop for reliable car spare parts in Addis Ababa. Genuine parts guaranteed.",
    image: "/eng/eng1.jpg", // Placeholder: Engine
    cta: "Find Parts",
    link: "/products"
  },
  {
    id: 2,
    title: "Upgrade Your Ride",
    description: "From performance brakes to suspension kits, find the upgrades that make a difference.",
    image: "/eng/eng2.jpg", // Placeholder: Car Detail
    cta: "Shop Upgrades",
    link: "/"
  },
  {
    id: 3,
    title: "Keep It Running Smoothly",
    description: "Essential maintenance parts—filters, oil, and belts—at unbeatable prices.",
    image: "/eng/eng3.jpg", // Placeholder: Mechanic
    cta: "Maintenance",
    link: "/products"
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            fill
            className="object-cover opacity-60" // Dimmed image for text readability
            priority
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="container relative h-full flex flex-col justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current} // Key change triggers animation
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {SLIDES[current].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {SLIDES[current].description}
            </p>
            <div className="flex gap-4 pt-2">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white border-0 font-semibold h-12 px-8">
                <Link href={SLIDES[current].link}>
                  {SLIDES[current].cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors">
                <Link href="/">About Us</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-brand-orange" : "w-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
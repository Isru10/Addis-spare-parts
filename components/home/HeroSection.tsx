// src/components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="container grid lg:grid-cols-2 gap-8 items-center py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 items-start"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          The Right Parts, Right Away
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Your one-stop shop for reliable car spare parts in Addis Ababa.
          Find exactly what you need with our powerful search and expert support.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/products">Browse All Parts</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#categories">Shop by Category</Link>
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/part-1.jpg" // Replace with your actual hero image
          alt="Car spare parts collage"
          width={600}
          height={400}
          className="rounded-lg object-cover"
          priority // <-- CRITICAL: Preloads the most important image on the page
        />
      </motion.div>
    </section>
  );
}
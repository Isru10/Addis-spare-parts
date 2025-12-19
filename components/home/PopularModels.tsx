"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const BRANDS = [
  { name: "Toyota", models: ["Vitz", "Yaris", "Corolla", "Hilux", "Land Cruiser"] },
  { name: "Hyundai", models: ["Atos", "Tucson", "Santa Fe", "Elantra"] },
  { name: "Honda", models: ["Fit", "Civic", "CR-V"] },
  { name: "Nissan", models: ["Patrol", "Sunny", "Qashqai"] },
  { name: "Ford", models: ["F-150", "Ranger", "Fusion"] },
  { name: "Mitsubishi", models: ["Lancer", "L200", "Pajero"] },
];

export default function PopularModels() {
  return (
    <section className="container py-8 border-t border-b bg-slate-50/50">
      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center md:text-left">
          Popular Makes & Models
        </h3>
        
        {/* Responsive Grid of Tags */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="contents">
              {/* Brand Tag (Darker) */}
              <Link href={`/products?brand=${brand.name}`}>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer">
                  {brand.name}
                </Badge>
              </Link>

              {/* Models Tags (Lighter) */}
              {brand.models.map((model) => (
                <Link key={model} href={`/products?brand=${brand.name}&q=${model}`}>
                  <Badge variant="outline" className="px-3 py-2 text-sm font-normal text-slate-600 hover:text-primary hover:border-primary cursor-pointer transition-colors bg-white">
                    {model}
                  </Badge>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
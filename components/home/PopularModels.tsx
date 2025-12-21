// "use client";

// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";

// const BRANDS = [
//   { name: "Toyota", models: ["Vitz", "Yaris", "Corolla", "Hilux", "Land Cruiser"] },
//   { name: "Hyundai", models: ["Atos", "Tucson", "Santa Fe", "Elantra"] },
//   { name: "Honda", models: ["Fit", "Civic", "CR-V"] },
//   { name: "Nissan", models: ["Patrol", "Sunny", "Qashqai"] },
//   { name: "Ford", models: ["F-150", "Ranger", "Fusion"] },
//   { name: "Mitsubishi", models: ["Lancer", "L200", "Pajero"] },
// ];

// export default function PopularModels() {
//   return (
//     <section className="container py-8 border-t border-b bg-slate-50/50">
//       <div className="flex flex-col gap-6">
//         <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center md:text-left">
//           Popular Makes & Models
//         </h3>
        
//         {/* Responsive Grid of Tags */}
//         <div className="flex flex-wrap justify-center md:justify-start gap-3">
//           {BRANDS.map((brand) => (
//             <div key={brand.name} className="contents">
//               {/* Brand Tag (Darker) */}
//               <Link href={`/products?brand=${brand.name}`}>
//                 <Badge variant="secondary" className="px-4 py-2 text-sm font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer">
//                   {brand.name}
//                 </Badge>
//               </Link>

//               {/* Models Tags (Lighter) */}
//               {brand.models.map((model) => (
//                 <Link key={model} href={`/products?brand=${brand.name}&q=${model}`}>
//                   <Badge variant="outline" className="px-3 py-2 text-sm font-normal text-slate-600 hover:text-primary hover:border-primary cursor-pointer transition-colors bg-white">
//                     {model}
//                   </Badge>
//                 </Link>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image"; // Import Image
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

// Real Logo URLs (Using Wikipedia/Wikimedia SVGs for clean look)
const BRANDS = [
  { name: "Toyota", logo: "/car/toyota.jpg" },
  { name: "Honda", logo: "/car/honda.jpg" },
  { name: "Ford", logo: "/car/ford.jpg" },
  { name: "Nissan", logo: "/car/nissan.jpg" },
  { name: "Hyundai", logo: "/car/hyundai.png" },
  { name: "Mitsubishi", logo: "/car/mitsu.jpg" },
  { name: "BMW", logo: "/car/bmw.jpg" },
  { name: "Mercedes", logo: "/car/mercedes.jpg" },
];

const POPULAR_MODELS = [
  "Corolla", "Vitz", "Hilux", "F-150", "Civic", "Tucson", "Patrol", "Land Cruiser", "Yaris", "Ranger"
];

export default function PopularModels() {
  return (
    <section className="py-10 bg-slate-50 border-y overflow-hidden">
      <div className="container space-y-8">
        
        {/* 1. BRAND LOGO MARQUEE */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          
          <div className="flex gap-12 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...BRANDS, ...BRANDS].map((brand, i) => ( 
              <Link key={`${brand.name}-${i}`} href={`/products?brand=${brand.name}`} className="group flex flex-col items-center gap-3 min-w-[80px]">
                
                {/* Logo Image */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 p-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="relative w-full h-full">
                    <Image 
                      src={brand.logo} 
                      alt={brand.name} 
                      fill 
                      className="object-contain" // Keeps aspect ratio perfect
                    />
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. MODEL CHIPS CAROUSEL */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-bold">
            <Car className="h-4 w-4" /> Trending Models
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_MODELS.map((model) => (
              <Link key={model} href={`/products?q=${model}`}>
                <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer shadow-sm">
                  {model}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
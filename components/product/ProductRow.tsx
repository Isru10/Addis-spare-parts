

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/types/product";
import { ArrowRight, Flame, Sparkles, Trophy } from "lucide-react"; // Import Icons

interface ProductRowProps {
  title: string;
  products: IProduct[];
  link?: string;
  type?: "recent" | "best-seller" | "default"; // New Prop
}

export default function ProductRow({ title, products, link, type = "default" }: ProductRowProps) {
  if (products.length === 0) return null;

  // Determine Icon & Color based on type
  const getHeaderStyle = () => {
    switch (type) {
      case "recent":
        return { icon: Sparkles, color: "text-blue-600", bg: "bg-blue-100" };
      case "best-seller":
        return { icon: Flame, color: "text-orange-600", bg: "bg-orange-100" };
      default:
        return { icon: Trophy, color: "text-slate-700", bg: "bg-slate-100" };
    }
  };

  const style = getHeaderStyle();
  const Icon = style.icon;

  return (
    <div className="space-y-4 py-6 border-b w-full max-w-full overflow-hidden">
      
      {/* Header with Icon */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${style.bg} ${style.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        </div>
        
        {link && (
          <Link href={link} className="text-xs font-semibold text-primary flex items-center hover:underline group">
            View All <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      
      {/* Scroll Container */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-none">
        <div className="flex gap-4 w-max px-1">
             {products.map((product) => (
          <div key={product._id} className="w-[145px] sm:w-[180px] flex-shrink-0 snap-start">
            <ProductCard 
              product={product} 
              // Pass badge based on row type
              badgeType={type === 'recent' ? 'new' : type === 'best-seller' ? 'hot' : undefined}
            />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/types/product";
import { ArrowRight } from "lucide-react";

interface ProductRowProps {
  title: string;
  products: IProduct[];
  link?: string;
}

export default function ProductRow({ title, products, link }: ProductRowProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-3 py-4 border-b w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {link && (
          <Link href={link} className="text-xs font-semibold text-primary flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        )}
      </div>
      
      {/* Scroll Container */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 w-max px-1">
          {products.map((product) => (
            // FIX: Mobile width 135px. Very compact, very safe.
            <div key={product._id} className="w-[135px] sm:w-[180px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
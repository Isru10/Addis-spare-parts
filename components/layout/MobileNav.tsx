// src/components/layout/MobileNav.tsx

"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { SearchInput } from "./SearchInput"; // <--- Import

// Helper component to close sheet programmatically
// We use a button that acts as a trigger to close the sheet if needed, 
// but for SearchInput we just rely on navigation changing the context.
// However, adding a specific prop to SearchInput is cleaner.

export function MobileNav() {
  const { categories, loading } = useCategories();

  return (
    <div className="flex flex-col gap-4 mt-4 h-full">
      
      {/* 1. SEARCH BAR (Mobile) */}
      <div className="pb-4 border-b">
        {/* We wrap this in a way that allows us to close the sheet. 
            Since SearchInput navigates, the sheet usually stays open unless we force it.
            For now, we rely on the navigation or the user clicking away, 
            but strictly speaking, SheetClose expects a child button. 
            We will pass a dummy function or handle it via a ref if strictly needed.
            For simplicity, the SearchInput navigation usually suffices. 
        */}
        <SheetClose asChild>
           {/* Wrapping in SheetClose ensures pressing Enter closes the menu */}
           <div className="w-full">
             <SearchInput />
           </div>
        </SheetClose>
      </div>

      <SheetClose asChild>
        <Link href="/" className="text-lg font-medium hover:text-primary">
          Home
        </Link>
      </SheetClose>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full border-b pb-4">
          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-2">
              Browse Categories
            </AccordionTrigger>
            <AccordionContent className="pl-4 border-l-2 ml-1">
              <div className="flex flex-col gap-4 pt-2">
                {categories.map((root) => (
                  <div key={root._id}>
                     <SheetClose asChild>
                        <Link 
                          href={`/products?category=${root._id}`} 
                          className="font-semibold block mb-2 hover:text-primary"
                        >
                          {root.name}
                        </Link>
                     </SheetClose>

                     {root.children && root.children.length > 0 && (
                       <div className="flex flex-col gap-2 pl-3 border-l">
                         {root.children.map((child) => (
                           <SheetClose key={child._id} asChild>
                              <Link 
                                href={`/products?category=${child._id}`}
                                className="text-sm text-muted-foreground hover:text-foreground"
                              >
                                {child.name}
                              </Link>
                           </SheetClose>
                         ))}
                       </div>
                     )}
                  </div>
                ))}
                
                <SheetClose asChild>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href="/products">View All Parts</Link>
                  </Button>
                </SheetClose>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <SheetClose asChild>
        <Link href="/about" className="text-lg font-medium hover:text-primary">
          About Us
        </Link>
      </SheetClose>
    </div>
  );
}
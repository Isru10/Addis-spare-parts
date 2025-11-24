// src/components/layout/CategoryNav.tsx


"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Layers } from "lucide-react";

export function CategoryNav() {
  const { categories } = useCategories();

  if (categories.length === 0) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50">
             Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* 1. Container: Fixed width, Vertical Scroll for the whole list if needed */}
            <div className="w-[300px] p-2 bg-background max-h-[80vh] overflow-y-auto">
              
              {/* Special Link: View All Parts */}
              <div className="mb-2">
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="flex items-center gap-2 w-full select-none rounded-md bg-muted/50 p-3 no-underline outline-none hover:bg-muted transition-colors"
                  >
                    <Layers className="h-4 w-4 text-primary" />
                    <div className="text-sm font-medium">Browse All Parts</div>
                  </Link>
                </NavigationMenuLink>
              </div>

              {/* 2. Accordion for Categories */}
              <Accordion type="single" collapsible className="w-full">
                {categories.map((root) => {
                  const hasChildren = root.children && root.children.length > 0;

                  // CASE A: It has subcategories -> Render Accordion
                  if (hasChildren) {
                    return (
                      <AccordionItem key={root._id} value={root._id} className="border-b-0">
                        <AccordionTrigger className="py-2 text-sm hover:no-underline hover:text-primary hover:bg-accent/50 px-2 rounded-sm">
                          {root.name}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          {/* Scrollable Sub-list */}
                          <ul className="flex flex-col gap-1 pl-2 max-h-[250px] overflow-y-auto pr-1">
                            {/* Link to the Root itself */}
                            <li>
                              <NavigationMenuLink asChild>
                                <Link 
                                  href={`/products?category=${root._id}`}
                                  className="block rounded-md p-2 text-xs font-bold text-primary hover:bg-accent"
                                >
                                  Shop All {root.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            
                            {/* Subcategories */}
                            {root.children!.map((child) => (
                              <li key={child._id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/products?category=${child._id}`}
                                    className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                                  >
                                    {/* <ChevronRight className="h-3 w-3 opacity-50" /> */}
                                    {child.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }

                  // CASE B: No subcategories -> Render Direct Link (No "No subcategories" text)
                  return (
                    <div key={root._id} className="py-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/products?category=${root._id}`}
                          className="flex flex-1 items-center justify-between py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 px-2 rounded-sm transition-all"
                        >
                          {root.name}
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  );
                })}
              </Accordion>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
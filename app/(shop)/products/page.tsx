
// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import Category from "@/models/Category"; 
// import { IProduct } from "@/types/product";
// import { ICategory } from "@/types/category";
// import ProductCard from "@/components/product/ProductCard";
// import CascadingPartFinder from "@/components/product/CascadingPartFinder"; // The new Finder Component
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Filter } from "lucide-react";
// import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";

// const PRODUCTS_PER_PAGE = 8;

// interface SearchParamsProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// export default async function ProductsPage({ searchParams }: SearchParamsProps) {
//   const resolvedSearchParams = await searchParams;
//   await dbConnect();

//   // ==============================
//   // 1. Parse Search Parameters
//   // ==============================
//   const page = Number(resolvedSearchParams.page) || 1;
//   const limit = Number(resolvedSearchParams.limit) || PRODUCTS_PER_PAGE;
//   const skip = (page - 1) * limit;

//   const searchQuery = resolvedSearchParams.q?.toString() || "";
//   const categoryFilter = resolvedSearchParams.category?.toString() || "";
//   const brandFilter = resolvedSearchParams.brand?.toString() || "";
//   const minPrice = Number(resolvedSearchParams.minPrice) || 0;
//   const maxPrice = Number(resolvedSearchParams.maxPrice) || 100000;

//   // ==============================
//   // 2. Build Mongoose Query
//   // ==============================
//   const query: any = { isActive: true };

//   // Text Search
//   if (searchQuery) {
//     query.$or = [
//       { name: { $regex: searchQuery, $options: "i" } },
//       { brand: { $regex: searchQuery, $options: "i" } },
//       { modelCompatibility: { $regex: searchQuery, $options: "i" } },
//     ];
//   }

//   // Categories & Brands
//   if (categoryFilter) query.category = categoryFilter;
//   if (brandFilter) query.brand = brandFilter;

//   // Price
//   if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
//     query.displayPrice = { $gte: minPrice, $lte: maxPrice };
//   }

//   // --- DYNAMIC SPECS FILTERING ---
//   // Look for any params starting with "spec_" (e.g. spec_Voltage=12V)
//   Object.keys(resolvedSearchParams).forEach((key) => {
//     if (key.startsWith("spec_")) {
//       const specName = key.replace("spec_", ""); // e.g., "Voltage"
//       const value = resolvedSearchParams[key]?.toString();
      
//       if (value) {
//         // Find products where 'specs' array contains an element with this name AND value
//         if (!query.$and) query.$and = [];
//         query.$and.push({
//           specs: {
//             $elemMatch: {
//               name: specName,
//               value: value // Exact match
//             }
//           }
//         });
//       }
//     }
//   });

//   // ==============================
//   // 3. Parallel Data Fetching
//   // ==============================
  
//   const productsPromise = Product.find(query)
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lean<IProduct[]>();

//   const countPromise = Product.countDocuments(query);
  
//   // Fetch Categories for the finder
//   const categoriesPromise = Category.find({ isActive: true }).sort({ name: 1 }).lean<ICategory[]>();

//   const [productsRaw, count, categoriesRaw] = await Promise.all([
//     productsPromise,
//     countPromise,
//     categoriesPromise
//   ]);

//   // ==============================
//   // 4. Data Normalization
//   // ==============================
//   // We MUST convert Mongoose objects (like ObjectIds) to plain strings/objects
//   // before passing them to Client Components.
  
//   const products = JSON.parse(JSON.stringify(productsRaw));
//   const categoriesCleaned = JSON.parse(JSON.stringify(categoriesRaw));
  
//   // Ensure strict typing for categories after parsing
//   const categories = categoriesCleaned.map((cat: any) => ({
//     ...cat,
//     _id: cat._id.toString(),
//     parentCategory: cat.parentCategory ? cat.parentCategory.toString() : undefined
//   }));

//   const totalPages = Math.ceil(count / limit);

//   const createPageUrl = (newPage: number) => {
//     const params = new URLSearchParams(resolvedSearchParams as any);
//     params.set("page", newPage.toString());
//     return `/products?${params.toString()}`;
//   };

//   return (
//     <div className="container py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center md:text-left">All Products</h1>

//       <div className="flex flex-col lg:flex-row gap-8">
        
//         {/* Sidebar (Desktop) - Uses the new Cascading Finder */}
//         <aside className="hidden lg:block w-72 flex-shrink-0">
//             <CascadingPartFinder categories={categories as unknown as ICategory[]} />
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1">
          
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <p className="text-muted-foreground text-sm">
//               Showing {products.length} of {count} results
//             </p>
            
//             {/* MOBILE FILTER TRIGGER */}
//             {/* The 'lg:hidden' class ensures it shows on Mobile/Tablet but hides on Large Desktop */}
            
//                        <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" className="lg:hidden w-full sm:w-auto">
//                   <Filter className="mr-2 h-4 w-4" /> Advanced Filter
//                 </Button>
//               </SheetTrigger>
              
//               {/* FIX STARTS HERE */}
//               <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
//                 {/* Header - Fixed at top */}
//                 <div className="p-4 border-b">
//                   <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
//                 </div>
                
//                 {/* Scrollable Area - Takes remaining height */}
//                 <div className="flex-1 overflow-y-auto p-4">
//                   <CascadingPartFinder categories={categories as unknown as ICategory[]} />
//                 </div>
//               </SheetContent>
//               {/* FIX ENDS HERE */}
//             </Sheet>
//           </div>


//           {/* Product Grid */}
//           {products.length > 0 ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
//               {products.map((product: IProduct) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product} // JSON.parse NOT needed here as 'products' array is already clean
//                 />
//               ))}
//             </div>

//           ) : (
//             <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-lg bg-muted/20">
//               <p className="text-xl font-semibold">No products found</p>
//               <p className="text-muted-foreground mt-2">Try adjusting your search in the Part Finder.</p>
//               <Button variant="link" className="mt-4" asChild>
//                 <a href="/products">Clear all filters</a>
//               </Button>
//             </div>
//           )}

//           {/* Pagination Controls */}
          
          
//           {/* Pagination Controls - UPDATED */}
//           {totalPages > 1 && (
//             <div className="mt-12 flex justify-center">
//               <Pagination>
//                 <PaginationContent className="flex-wrap gap-2 justify-center">
                  
//                   {/* PREVIOUS BUTTON */}
//                   {page > 1 ? (
//                     <PaginationItem>
//                       <PaginationPrevious 
//                         href={createPageUrl(page - 1)} 
//                         className="w-auto px-4 h-10 cursor-pointer" // Allow auto width
//                       />
//                     </PaginationItem>
//                   ) : (
//                     <PaginationItem>
//                       {/* Disabled state visual */}
//                       <span className="flex items-center justify-center px-4 h-10 border rounded opacity-50 cursor-not-allowed text-sm font-medium">
//                         Previous
//                       </span>
//                     </PaginationItem>
//                   )}
                  
//                   {/* PAGE COUNTER (Not a button, just text) */}
//                   <PaginationItem>
//                     <span className="flex h-10 items-center justify-center px-4 text-sm font-semibold">
//                       Page {page} of {totalPages}
//                     </span>
//                   </PaginationItem>

//                   {/* NEXT BUTTON */}
//                   {page < totalPages ? (
//                     <PaginationItem>
//                       <PaginationNext 
//                         href={createPageUrl(page + 1)} 
//                         className="w-auto px-4 h-10 cursor-pointer" // Allow auto width
//                       />
//                     </PaginationItem>
//                   ) : (
//                     <PaginationItem>
//                       <span className="flex items-center justify-center px-4 h-10 border rounded opacity-50 cursor-not-allowed text-sm font-medium">
//                         Next
//                       </span>
//                     </PaginationItem>
//                   )}

//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
          
//         </div>
//       </div>
//     </div>
//   );
// }
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; 
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import CascadingPartFinder from "@/components/product/CascadingPartFinder";
import FeaturedCarousel from "@/components/product/FeaturedCarousel";
import QuickTags from "@/components/product/QuickTags";
import ProductRow from "@/components/product/ProductRow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const PRODUCTS_PER_PAGE = 8;

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  await dbConnect();

  // 1. Parse Params
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || PRODUCTS_PER_PAGE;
  const skip = (page - 1) * limit;
  const searchQuery = resolvedSearchParams.q?.toString() || "";
  const categoryFilter = resolvedSearchParams.category?.toString() || "";
  const brandFilter = resolvedSearchParams.brand?.toString() || "";
  const minPrice = Number(resolvedSearchParams.minPrice) || 0;
  const maxPrice = Number(resolvedSearchParams.maxPrice) || 100000;

  // 2. Build Query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { isActive: true };
  
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { brand: { $regex: searchQuery, $options: "i" } },
      { modelCompatibility: { $regex: searchQuery, $options: "i" } },
    ];
  }
  if (categoryFilter) query.category = categoryFilter;
  if (brandFilter) query.brand = brandFilter;
  
  if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
    query.displayPrice = { $gte: minPrice, $lte: maxPrice };
  }

  Object.keys(resolvedSearchParams).forEach((key) => {
    if (key.startsWith("spec_")) {
      const specName = key.replace("spec_", "");
      const value = resolvedSearchParams[key]?.toString();
      if (value) {
        if (!query.$and) query.$and = [];
        query.$and.push({
          specs: { $elemMatch: { name: specName, value: value } }
        });
      }
    }
  });

  // 3. Parallel Fetching
  const productsPromise = Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();

  const countPromise = Product.countDocuments(query);
  const categoriesPromise = Category.find({ isActive: true }).sort({ name: 1 }).lean<ICategory[]>();

  // Extra Data for Rich UI
  const featuredPromise = Product.find({ isActive: true }).sort({ displayPrice: -1 }).limit(5).lean<IProduct[]>();
  const recentPromise = Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(8).lean<IProduct[]>();
  const topSoldPromise = Product.find({ isActive: true }).limit(8).lean<IProduct[]>();

  const [productsRaw, count, categoriesRaw, featuredRaw, recentRaw, topSoldRaw] = await Promise.all([
    productsPromise,
    countPromise,
    categoriesPromise,
    featuredPromise,
    recentPromise,
    topSoldPromise
  ]);

  // 4. Normalize Data
  const products = JSON.parse(JSON.stringify(productsRaw));
  const featuredProducts = JSON.parse(JSON.stringify(featuredRaw));
  const recentProducts = JSON.parse(JSON.stringify(recentRaw));
  const topSoldProducts = JSON.parse(JSON.stringify(topSoldRaw));
  
  const categoriesCleaned = JSON.parse(JSON.stringify(categoriesRaw));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = categoriesCleaned.map((cat: any) => ({
    ...cat,
    _id: cat._id.toString(),
    parentCategory: cat.parentCategory ? cat.parentCategory.toString() : undefined
  }));

  const totalPages = Math.ceil(count / limit);
  const createPageUrl = (newPage: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = new URLSearchParams(resolvedSearchParams as any);
    params.set("page", newPage.toString());
    return `/products?${params.toString()}`;
  };

  const isFiltering = searchQuery || categoryFilter || brandFilter;

  return (
    <div className="container py-4 md:py-8 px-4 md:px-8 space-y-8 w-full max-w-[100vw] overflow-x-hidden">
      
      {/* 1. TOP SECTION (Featured / Recent / Best Sellers) */}
      {!isFiltering && page === 1 && (
        <div className="space-y-8 w-full max-w-full">
          <section className="w-full overflow-hidden">
            <FeaturedCarousel products={featuredProducts} />
          </section>
          
          {/* <section className="w-full overflow-hidden">
            <ProductRow title="Just Arrived" products={recentProducts} />
          </section>

          <section className="w-full overflow-hidden">
            <ProductRow title="Best Sellers" products={topSoldProducts} />
          </section> */}


                    <section className="w-full overflow-hidden">
            <ProductRow title="Just Arrived" products={recentProducts} type="recent" />
          </section>

          <section className="w-full overflow-hidden">
            <ProductRow title="Best Sellers" products={topSoldProducts} type="best-seller" />
          </section>

        </div>
      )}

      {/* 2. MAIN LAYOUT (Filter Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
            <CascadingPartFinder categories={categories as unknown as ICategory[]} />
        </aside>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          
          <div className="w-full max-w-full overflow-hidden">
             <QuickTags />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Showing {products.length} of {count} results
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Advanced Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
                <div className="p-4 border-b">
                  <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <CascadingPartFinder categories={categories as unknown as ICategory[]} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {products.map((product: IProduct) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-lg bg-muted/20 text-center p-4">
              <p className="text-xl font-semibold">No products found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search.</p>
              <Button variant="link" className="mt-4" asChild>
                <a href="/products">Clear all filters</a>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 w-full overflow-hidden">
              <Pagination>
                <PaginationContent className="w-full flex justify-center gap-2">
                  
                  {/* PREV BUTTON */}
                  {page > 1 ? (
                    <PaginationItem>
                      <PaginationPrevious 
                        href={createPageUrl(page - 1)} 
                        className="h-9 px-3 text-xs sm:text-sm"
                      >
                        <span className="sr-only sm:not-sr-only sm:inline-block">Previous</span>
                      </PaginationPrevious>
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <span className="flex items-center justify-center h-9 px-3 border rounded opacity-50 cursor-not-allowed text-xs sm:text-sm">
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </span>
                    </PaginationItem>
                  )}
                  
                  {/* PAGE COUNTER */}
                  <PaginationItem>
                    <span className="flex h-9 items-center justify-center px-2 text-xs sm:text-sm font-semibold whitespace-nowrap">
                      <span className="sm:hidden">{page} / {totalPages}</span>
                      <span className="hidden sm:inline">Page {page} of {totalPages}</span>
                    </span>
                  </PaginationItem>

                  {/* NEXT BUTTON */}
                  {page < totalPages ? (
                    <PaginationItem>
                      <PaginationNext 
                        href={createPageUrl(page + 1)} 
                        className="h-9 px-3 text-xs sm:text-sm"
                      >
                        <span className="sr-only sm:not-sr-only sm:inline-block">Next</span>
                      </PaginationNext>
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <span className="flex items-center justify-center h-9 px-3 border rounded opacity-50 cursor-not-allowed text-xs sm:text-sm">
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </span>
                    </PaginationItem>
                  )}

                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
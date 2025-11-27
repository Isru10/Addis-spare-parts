// // src/app/products/page.tsx

// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import { IProduct } from "@/types/product";
// import ProductCard from "@/components/product/ProductCard";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// const PRODUCTS_PER_PAGE = 8;

// // ==========================================================
// // THE FIX IS APPLIED HERE
// // ==========================================================
// export default async function ProductsPage({
//   searchParams,
// }: {
//   // Fix 1: The searchParams object is now a Promise
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   // Fix 2: Await the promise to get the resolved search parameters
//   const resolvedSearchParams = await searchParams;

//   // The rest of the component logic now uses the resolved object
//   const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
//   const limit = typeof resolvedSearchParams.limit === 'string' ? Number(resolvedSearchParams.limit) : PRODUCTS_PER_PAGE;
//   const skip = (page - 1) * limit;

//   await dbConnect();

//   // Fetch products and count in parallel
//   const productsPromise = Product.find({})
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lean<IProduct[]>();

//   const countPromise = Product.countDocuments({});

//   const [products, count] = await Promise.all([productsPromise, countPromise]);

//   const totalPages = Math.ceil(count / limit);

//   return (
//     <div className="container py-12">
//       <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
      
//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <ProductCard
//             key={product._id.toString()}
//             product={JSON.parse(JSON.stringify(product))}
//           />
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="mt-12">
//         <Pagination>
//           <PaginationContent>
//             {page > 1 && (
//               <PaginationItem>
//                 <PaginationPrevious href={`/products?page=${page - 1}`} />
//               </PaginationItem>
//             )}
            
//             <PaginationItem>
//               <PaginationLink isActive>
//                 Page {page} of {totalPages}
//               </PaginationLink>
//             </PaginationItem>

//             {page < totalPages && (
//               <PaginationItem>
//                 <PaginationNext href={`/products?page=${page + 1}`} />
//               </PaginationItem>
//             )}
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; 
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import CascadingPartFinder from "@/components/product/CascadingPartFinder"; // The new Finder Component
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

  // ==============================
  // 1. Parse Search Parameters
  // ==============================
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || PRODUCTS_PER_PAGE;
  const skip = (page - 1) * limit;

  const searchQuery = resolvedSearchParams.q?.toString() || "";
  const categoryFilter = resolvedSearchParams.category?.toString() || "";
  const brandFilter = resolvedSearchParams.brand?.toString() || "";
  const minPrice = Number(resolvedSearchParams.minPrice) || 0;
  const maxPrice = Number(resolvedSearchParams.maxPrice) || 100000;

  // ==============================
  // 2. Build Mongoose Query
  // ==============================
  const query: any = { isActive: true };

  // Text Search
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { brand: { $regex: searchQuery, $options: "i" } },
      { modelCompatibility: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Categories & Brands
  if (categoryFilter) query.category = categoryFilter;
  if (brandFilter) query.brand = brandFilter;

  // Price
  if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
    query.displayPrice = { $gte: minPrice, $lte: maxPrice };
  }

  // --- DYNAMIC SPECS FILTERING ---
  // Look for any params starting with "spec_" (e.g. spec_Voltage=12V)
  Object.keys(resolvedSearchParams).forEach((key) => {
    if (key.startsWith("spec_")) {
      const specName = key.replace("spec_", ""); // e.g., "Voltage"
      const value = resolvedSearchParams[key]?.toString();
      
      if (value) {
        // Find products where 'specs' array contains an element with this name AND value
        if (!query.$and) query.$and = [];
        query.$and.push({
          specs: {
            $elemMatch: {
              name: specName,
              value: value // Exact match
            }
          }
        });
      }
    }
  });

  // ==============================
  // 3. Parallel Data Fetching
  // ==============================
  
  const productsPromise = Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();

  const countPromise = Product.countDocuments(query);
  
  // Fetch Categories for the finder
  const categoriesPromise = Category.find({ isActive: true }).sort({ name: 1 }).lean<ICategory[]>();

  const [productsRaw, count, categoriesRaw] = await Promise.all([
    productsPromise,
    countPromise,
    categoriesPromise
  ]);

  // ==============================
  // 4. Data Normalization
  // ==============================
  // We MUST convert Mongoose objects (like ObjectIds) to plain strings/objects
  // before passing them to Client Components.
  
  const products = JSON.parse(JSON.stringify(productsRaw));
  const categoriesCleaned = JSON.parse(JSON.stringify(categoriesRaw));
  
  // Ensure strict typing for categories after parsing
  const categories = categoriesCleaned.map((cat: any) => ({
    ...cat,
    _id: cat._id.toString(),
    parentCategory: cat.parentCategory ? cat.parentCategory.toString() : undefined
  }));

  const totalPages = Math.ceil(count / limit);

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(resolvedSearchParams as any);
    params.set("page", newPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop) - Uses the new Cascading Finder */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
            <CascadingPartFinder categories={categories as unknown as ICategory[]} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground text-sm">
              Showing {products.length} of {count} results
            </p>
            
            {/* MOBILE FILTER TRIGGER */}
            {/* The 'lg:hidden' class ensures it shows on Mobile/Tablet but hides on Large Desktop */}
            
                       <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Advanced Filter
                </Button>
              </SheetTrigger>
              
              {/* FIX STARTS HERE */}
              <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
                {/* Header - Fixed at top */}
                <div className="p-4 border-b">
                  <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                </div>
                
                {/* Scrollable Area - Takes remaining height */}
                <div className="flex-1 overflow-y-auto p-4">
                  <CascadingPartFinder categories={categories as unknown as ICategory[]} />
                </div>
              </SheetContent>
              {/* FIX ENDS HERE */}
            </Sheet>
          </div>


          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {products.map((product: IProduct) => (
                <ProductCard
                  key={product._id}
                  product={product} // JSON.parse NOT needed here as 'products' array is already clean
                />
              ))}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-lg bg-muted/20">
              <p className="text-xl font-semibold">No products found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search in the Part Finder.</p>
              <Button variant="link" className="mt-4" asChild>
                <a href="/products">Clear all filters</a>
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          
          
          {/* Pagination Controls - UPDATED */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent className="flex-wrap gap-2 justify-center">
                  
                  {/* PREVIOUS BUTTON */}
                  {page > 1 ? (
                    <PaginationItem>
                      <PaginationPrevious 
                        href={createPageUrl(page - 1)} 
                        className="w-auto px-4 h-10 cursor-pointer" // Allow auto width
                      />
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      {/* Disabled state visual */}
                      <span className="flex items-center justify-center px-4 h-10 border rounded opacity-50 cursor-not-allowed text-sm font-medium">
                        Previous
                      </span>
                    </PaginationItem>
                  )}
                  
                  {/* PAGE COUNTER (Not a button, just text) */}
                  <PaginationItem>
                    <span className="flex h-10 items-center justify-center px-4 text-sm font-semibold">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>

                  {/* NEXT BUTTON */}
                  {page < totalPages ? (
                    <PaginationItem>
                      <PaginationNext 
                        href={createPageUrl(page + 1)} 
                        className="w-auto px-4 h-10 cursor-pointer" // Allow auto width
                      />
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <span className="flex items-center justify-center px-4 h-10 border rounded opacity-50 cursor-not-allowed text-sm font-medium">
                        Next
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
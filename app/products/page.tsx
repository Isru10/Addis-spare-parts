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
import Category from "@/models/Category"; // Imported!
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger , SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  // We split by comma to allow multiple selections (e.g. ?brand=Toyota,Honda)
  const categoryFilter = resolvedSearchParams.category?.toString().split(",").filter(Boolean) || [];
  const brandFilter = resolvedSearchParams.brand?.toString().split(",").filter(Boolean) || [];
  const minPrice = Number(resolvedSearchParams.minPrice) || 0;
  const maxPrice = Number(resolvedSearchParams.maxPrice) || 100000;

  // ==============================
  // 2. Build Mongoose Query
  // ==============================
  const query: any = { isActive: true };

  // Text Search: Search in Name, Brand, or Model Compatibility
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { brand: { $regex: searchQuery, $options: "i" } },
      { modelCompatibility: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Category Filter (Matches ObjectId)
  if (categoryFilter.length > 0) {
    query.category = { $in: categoryFilter };
  }

  // Brand Filter
  if (brandFilter.length > 0) {
    query.brand = { $in: brandFilter };
  }

  // Price Filter (Using the displayPrice field we modeled)
  if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
    query.displayPrice = { $gte: minPrice, $lte: maxPrice };
  }

  // ==============================
  // 3. Parallel Data Fetching
  // ==============================
  
  // A. Fetch Products
  const productsPromise = Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();

  // B. Count Documents (for pagination)
  const countPromise = Product.countDocuments(query);

  // C. Fetch Filters Meta Data
  // Get all unique brands existing in active products
  const brandsPromise = Product.distinct("brand", { isActive: true });
  // Get max price for slider
  const maxPricePromise = Product.findOne({ isActive: true })
    .sort({ displayPrice: -1 })
    .select("displayPrice");
  // Get all categories
  const categoriesPromise = Category.find({}).sort({ name: 1 }).lean<ICategory[]>();

  const [products, count, brands, maxPriceDoc, categoriesRaw] = await Promise.all([
    productsPromise,
    countPromise,
    brandsPromise,
    maxPricePromise,
    categoriesPromise
  ]);

  // ==============================
  // 4. Data Normalization
  // ==============================
  
  const totalPages = Math.ceil(count / limit);
  const maxPriceData = maxPriceDoc?.displayPrice || 5000;

  // Mongoose ObjectIds must be converted to strings before passing to Client Components
  const categories = categoriesRaw.map(cat => ({
    ...cat,
    _id: cat._id.toString()
  }));

  // Helper function for pagination links to preserve current filters
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(resolvedSearchParams as any);
    params.set("page", newPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ==============================
             Sidebar Filters (Desktop) 
           ============================== */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 border rounded-lg p-4 bg-card">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <ProductFilters 
              brands={brands as string[]} 
              categories={categories} 
              maxPriceData={maxPriceData}
            />
          </div>
        </aside>

        {/* ==============================
             Main Content Area
           ============================== */}
        <div className="flex-1">
          
          {/* Mobile Controls */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground text-sm">
              Showing {products.length} of {count} results
            </p>
            
            {/* Mobile Filter Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetTitle className="font-semibold text-lg pt-4">Filters</SheetTitle>

                <div className="py-6">
                  <h2 className="font-semibold text-lg mb-4">Filters</h2>
                  <ProductFilters 
                    brands={brands as string[]} 
                    categories={categories} 
                    maxPriceData={maxPriceData}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id.toString()}
                  product={JSON.parse(JSON.stringify(product))}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-lg bg-muted/20">
              <p className="text-xl font-semibold">No products found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              
              {/* FIX IS HERE: Removed the onClick and used Link component */}
              <Button 
                variant="link" 
                className="mt-4"
                asChild
              >
                <Link href="/products">Clear all filters</Link>
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={createPageUrl(page - 1)} />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink isActive>
                      Page {page} of {totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={createPageUrl(page + 1)} />
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
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
import ProductFilters, { DynamicFilterOption } from "@/components/product/ProductFilters";
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
  const categoryFilter = resolvedSearchParams.category?.toString().split(",").filter(Boolean) || [];
  const brandFilter = resolvedSearchParams.brand?.toString().split(",").filter(Boolean) || [];
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
  if (categoryFilter.length > 0) query.category = { $in: categoryFilter };
  if (brandFilter.length > 0) query.brand = { $in: brandFilter };

  // Price
  if (resolvedSearchParams.minPrice || resolvedSearchParams.maxPrice) {
    query.displayPrice = { $gte: minPrice, $lte: maxPrice };
  }

  // --- DYNAMIC SPECS FILTERING ---
  // Look for any params starting with "spec_" (e.g. spec_Voltage=12V)
  Object.keys(resolvedSearchParams).forEach((key) => {
    if (key.startsWith("spec_")) {
      const specName = key.replace("spec_", ""); // "Voltage"
      const values = resolvedSearchParams[key]?.toString().split(",") || [];
      
      if (values.length > 0) {
        // Find products where 'specs' array contains an element with this name AND one of the values
        if (!query.$and) query.$and = [];
        query.$and.push({
          specs: {
            $elemMatch: {
              name: specName,
              value: { $in: values }
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
  const brandsPromise = Product.distinct("brand", { isActive: true });
  
  const maxPricePromise = Product.findOne({ isActive: true })
    .sort({ displayPrice: -1 })
    .select("displayPrice");

  // Fetch Categories for sidebar
  const categoriesPromise = Category.find({ isActive: true }).sort({ name: 1 }).lean<ICategory[]>();

  const [products, count, brands, maxPriceDoc, categoriesRaw] = await Promise.all([
    productsPromise,
    countPromise,
    brandsPromise,
    maxPricePromise,
    categoriesPromise
  ]);

  // ==============================
  // 4. GENERATE DYNAMIC FILTER OPTIONS
  // ==============================
  // Only generate specific filters if EXACTLY ONE category is selected.
  // This prevents UI clutter when viewing "All Products".
  let dynamicFilters: DynamicFilterOption[] = [];
  
  if (categoryFilter.length === 1) {
    const selectedCatId = categoryFilter[0];
    const selectedCat = categoriesRaw.find(c => c._id.toString() === selectedCatId);
    
    if (selectedCat && selectedCat.attributes && selectedCat.attributes.length > 0) {
      
      // For each attribute defined in the category (e.g. "Voltage"),
      // Find all distinct values currently available in products of this category
      const filterPromises = selectedCat.attributes.map(async (attr) => {
        // MongoDB Aggregation to find distinct spec values
        const distinctValues = await Product.distinct("specs.value", { 
          category: selectedCatId,
          isActive: true,
          "specs.name": attr.name
        });
        
        return {
          name: attr.name,
          options: distinctValues.filter(Boolean).sort() // e.g. ["12V", "24V"]
        };
      });

      const results = await Promise.all(filterPromises);
      dynamicFilters = results.filter(f => f.options.length > 0);
    }
  }

  // ==============================
  // 5. Normalization & Render
  // ==============================
  const totalPages = Math.ceil(count / limit);
  const maxPriceData = maxPriceDoc?.displayPrice || 5000;
  
  const categoriesCleaned = JSON.parse(JSON.stringify(categoriesRaw));
  
  const categories = categoriesCleaned.map((cat: any) => ({
    ...cat,
    // Ensure parentCategory is handled correctly if it exists
    parentCategory: cat.parentCategory ? cat.parentCategory.toString() : undefined
  }));

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(resolvedSearchParams as any);
    params.set("page", newPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 border rounded-lg p-4 bg-card">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <ProductFilters 
              brands={brands as string[]} 
              categories={categories as unknown as ICategory[]} // Cast to match interface
              maxPriceData={maxPriceData}
              dynamicFilters={dynamicFilters} // <--- Passing the magic
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground text-sm">
              Showing {products.length} of {count} results
            </p>
            
            {/* Mobile Sidebar */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetTitle className="font-semibold text-lg pt-4">Filters</SheetTitle>
                <div className="py-6">
                  <ProductFilters 
                    brands={brands as string[]} 
                    categories={categories as unknown as ICategory[]} 
                    maxPriceData={maxPriceData}
                    dynamicFilters={dynamicFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
              <Button variant="link" className="mt-4" asChild>
                <a href="/products">Clear all filters</a>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {page > 1 && <PaginationItem><PaginationPrevious href={createPageUrl(page - 1)} /></PaginationItem>}
                  <PaginationItem><PaginationLink isActive>Page {page} of {totalPages}</PaginationLink></PaginationItem>
                  {page < totalPages && <PaginationItem><PaginationNext href={createPageUrl(page + 1)} /></PaginationItem>}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
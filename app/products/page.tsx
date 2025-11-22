// src/app/products/page.tsx

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { IProduct } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 8;

// ==========================================================
// THE FIX IS APPLIED HERE
// ==========================================================
export default async function ProductsPage({
  searchParams,
}: {
  // Fix 1: The searchParams object is now a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Fix 2: Await the promise to get the resolved search parameters
  const resolvedSearchParams = await searchParams;

  // The rest of the component logic now uses the resolved object
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === 'string' ? Number(resolvedSearchParams.limit) : PRODUCTS_PER_PAGE;
  const skip = (page - 1) * limit;

  await dbConnect();

  // Fetch products and count in parallel
  const productsPromise = Product.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();

  const countPromise = Product.countDocuments({});

  const [products, count] = await Promise.all([productsPromise, countPromise]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id.toString()}
            product={JSON.parse(JSON.stringify(product))}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-12">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/products?page=${page - 1}`} />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationLink isActive>
                Page {page} of {totalPages}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/products?page=${page + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
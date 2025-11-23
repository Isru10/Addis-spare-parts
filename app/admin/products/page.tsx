// // src/app/admin/products/page.tsx



// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";
// import Link from "next/link";
// import { PlusCircle } from "lucide-react";
// import { IProduct } from "@/types/product";
// import { ICategory } from "@/types/category";

// // Define a more specific type for the populated product
// interface PopulatedProduct extends Omit<IProduct, 'category'> {
//   // Making category optional for robustness, in case of broken references
//   category?: Pick<ICategory, '_id' | 'name'>;
// }

// async function getProducts() {
//   await dbConnect();
//   const products = await Product.find({})
//     .populate('category', 'name')
//     .sort({ createdAt: -1 })
//     .lean<PopulatedProduct[]>();
//   return products;
// }

// export default async function ProductsPage() {
//   const products = await getProducts();

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>All Products</CardTitle>
//         <Button asChild>
//           <Link href="/admin/products/new">
//             <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
//           </Link>
//         </Button>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Brand</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Total Stock</TableHead>
//               <TableHead></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {products.map((product) => (
//               // THE FIX: The key is ensuring no extra characters or newlines exist
//               // between the <TableRow> and the first <TableCell>.
//               <TableRow key={product._id.toString()}>
//                 <TableCell className="font-medium">{product.name}</TableCell>
//                 <TableCell>{product.brand}</TableCell>
//                 <TableCell>{product.category?.name || 'N/A'}</TableCell>
//                 <TableCell>
//                   {product.variants.reduce((acc, v) => acc + v.stock, 0)}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Button variant="outline" asChild>
//                     <Link href={`/admin/products/${product._id.toString()}/edit`}>
//                       Edit
//                     </Link>
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { IProduct, IVariant } from "@/types/product"; // Added IVariant
import { ICategory } from "@/types/category";
import ProductRowActions from "@/components/admin/ProductRowActions"; 

// Extended interface for populated data
interface PopulatedProduct extends Omit<IProduct, 'category'> {
  category?: Pick<ICategory, '_id' | 'name'>;
}

async function getProducts(): Promise<PopulatedProduct[]> {
  await dbConnect();
  const products = await Product.find({})
    .populate('category', 'name')
    .sort({ createdAt: -1 }) 
    .lean<PopulatedProduct[]>();
  
  // THE FIX: We explicitly tell TypeScript that this JSON is a list of PopulatedProducts
  return JSON.parse(JSON.stringify(products)) as PopulatedProduct[];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
         </div>
         <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            You have {products.length} total products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Inventory</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                // Now TypeScript knows that 'v' is a variant because 'product' is typed
                const totalStock = product.variants.reduce((acc: number, v: IVariant) => acc + v.stock, 0);
                
                return (
                  <TableRow key={product._id}>
                    {/* 1. Image Thumbnail */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative aspect-square w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.images[0] || '/placeholder-product.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* 2. Product Name & Brand */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                         <span>{product.name}</span>
                         <span className="text-xs text-muted-foreground">{product.brand}</span>
                      </div>
                    </TableCell>

                    {/* 3. Category */}
                    <TableCell className="hidden md:table-cell">
                      {product.category?.name || <span className="text-muted-foreground italic">Uncategorized</span>}
                    </TableCell>
                    
                    {/* 4. Status Badge */}
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>

                    {/* 5. Price */}
                    <TableCell>
                      ${product.displayPrice.toFixed(2)}
                    </TableCell>

                    {/* 6. Stock Count */}
                    <TableCell className="hidden sm:table-cell">
                       {totalStock > 0 ? (
                         <span>{totalStock} in stock</span>
                       ) : (
                         <span className="text-red-500 font-medium">Out of Stock</span>
                       )}
                    </TableCell>

                    {/* 7. Client Actions Component (Edit/Delete) */}
                    <TableCell className="text-right">
                       <ProductRowActions productId={product._id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
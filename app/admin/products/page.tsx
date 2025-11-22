// src/app/admin/products/page.tsx



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";

// Define a more specific type for the populated product
interface PopulatedProduct extends Omit<IProduct, 'category'> {
  // Making category optional for robustness, in case of broken references
  category?: Pick<ICategory, '_id' | 'name'>;
}

async function getProducts() {
  await dbConnect();
  const products = await Product.find({})
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean<PopulatedProduct[]>();
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Products</CardTitle>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              // THE FIX: The key is ensuring no extra characters or newlines exist
              // between the <TableRow> and the first <TableCell>.
              <TableRow key={product._id.toString()}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                <TableCell>
                  {product.variants.reduce((acc, v) => acc + v.stock, 0)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/products/${product._id.toString()}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
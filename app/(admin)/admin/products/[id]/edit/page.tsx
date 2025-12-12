import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import { notFound } from "next/navigation";

// This function fetches both the specific product and all categories in parallel.
async function getProductAndCategories(id: string) {
  await dbConnect();
  
  const productPromise = Product.findById(id).lean<IProduct>();
  const categoriesPromise = Category.find({}).sort({ name: 1 }).lean<ICategory[]>();
  
  const [product, categories] = await Promise.all([productPromise, categoriesPromise]);
  
  if (!product) {
    notFound();
  }
  
  return { 
    product: JSON.parse(JSON.stringify(product)),
    categories: JSON.parse(JSON.stringify(categories))
  };
}

// CORRECTED: The 'params' object is now correctly typed as a Promise.
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // CORRECTED: We must 'await' the promise to resolve the 'id'.
  const { id } = await params;
  const { product, categories } = await getProductAndCategories(id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update the details for {product.name}.
        </p>
      </div>

      <ProductForm 
        product={product}
        categories={categories}
      />
    </div>
  );
}
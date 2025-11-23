// // src/app/admin/products/new/page.tsx
// import ProductForm from "@/components/admin/ProductForm";
// import dbConnect from "@/lib/mongodb";
// import Category from "@/models/Category";
// import { ICategory } from "@/types/category";

// // This is a Server Component, so we can fetch data directly.
// async function getCategories(): Promise<ICategory[]> {
//   await dbConnect();
  
//   // Fetch categories and sort them alphabetically for the dropdown
//   const categories = await Category.find({})
//     .sort({ name: 1 })
//     .lean<ICategory[]>();
  
//   // We must serialize the data before passing it from a Server Component to a Client Component.
//   return JSON.parse(JSON.stringify(categories));
// }

// export default async function NewProductPage() {
//   // Fetch the data on the server
//   const categories = await getCategories();

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Create New Product</h1>
//         <p className="text-muted-foreground">
//           Fill out the details below to add a new item to your inventory.
//         </p>
//       </div>

//       {/* 
//         Render the client component ProductForm.
//         We do not pass a 'product' prop, so the form knows it's in "create" mode.
//         We only need to provide the list of categories for the dropdown menu.
//       */}
//       <ProductForm categories={categories} />
//     </div>
//   );
// }



import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { ICategory } from "@/types/category";

async function getCategories(): Promise<ICategory[]> {
  await dbConnect();
  
  // Populate parentCategory so we can show "Engine > Pistons" in the dropdown
  const categories = await Category.find({ isActive: true })
    .populate("parentCategory", "name") 
    .sort({ name: 1 })
    .lean<ICategory[]>();
  
  return JSON.parse(JSON.stringify(categories));
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
        <p className="text-muted-foreground mt-2">
          Select a category to unlock specific technical attributes.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
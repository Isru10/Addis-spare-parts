// // src/app/admin/categories/CategoriesClientPage.tsx
// "use client";

// import { useActionState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Textarea } from "@/components/ui/textarea";
// import { Trash2 } from "lucide-react";
// import { createCategory, deleteCategory } from "./actions";
// import { ICategory } from "@/types/category";
// import { useEffect, useRef } from "react";

// interface CategoriesPageProps {
//   categories: ICategory[];
// }

// export default function CategoriesPageClient({ categories }: CategoriesPageProps) {
//   const initialState = { success: false, message: "" };
//   const [state, formAction] = useActionState(createCategory, initialState);
//   const formRef = useRef<HTMLFormElement>(null);

//   // Effect to reset the form after successful submission
//   useEffect(() => {
//     if (state.success) {
//       formRef.current?.reset();
//     }
//   }, [state]);

//   return (
//     <div className="grid md:grid-cols-3 gap-6">
//       <div className="md:col-span-1">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create New Category</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form ref={formRef} action={formAction} className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Category Name</Label>
//                 <Input id="name" name="name" required />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea id="description" name="description" />
//               </div>
//               <Button type="submit">Create Category</Button>
//               {state.message && (
//                 <p className={`text-sm mt-2 ${state.success ? "text-green-600" : "text-red-600"}`}>
//                   {state.message}
//                 </p>
//               )}
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="md:col-span-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Existing Categories</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {categories.map((cat) => (
//                   <TableRow key={cat._id}>
//                     <TableCell className="font-medium">{cat.name}</TableCell>
//                     <TableCell>{cat.description}</TableCell>
//                     <TableCell className="text-right">
//                       <form action={deleteCategory.bind(null, cat._id)}>
//                         <Button variant="ghost" size="icon" type="submit">
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </form>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import Image from "next/image";
import { ICategory } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { deleteCategory } from "./actions";

interface CategoriesPageProps {
  categories: ICategory[];
}

export default function CategoriesClientPage({ categories }: CategoriesPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure? This will delete the category.")) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
           <p className="text-muted-foreground">Define attributes and hierarchy.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} width={32} height={32} className="rounded object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>
                  {/* Handle populated parent or string ID */}
                  {typeof cat.parentCategory === 'object' && cat.parentCategory 
                    ? (cat.parentCategory as ICategory).name 
                    : <span className="text-muted-foreground text-xs">Root</span>}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cat.attributes.map(attr => (
                      <Badge key={attr.name} variant="outline" className="text-[10px]">
                        {attr.name}
                      </Badge>
                    ))}
                    {cat.attributes.length === 0 && <span className="text-xs text-muted-foreground">-</span>}
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant={cat.isActive ? "default" : "secondary"}>{cat.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(cat._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Sheet for Form */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedCategory ? "Edit Category" : "New Category"}</SheetTitle>
            <SheetDescription>
              Configure category details and custom attributes.
            </SheetDescription>
          </SheetHeader>
          
          <CategoryForm 
            category={selectedCategory} 
            allCategories={categories}
            closeSheet={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
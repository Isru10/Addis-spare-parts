// src/app/admin/categories/CategoriesClientPage.tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { createCategory, deleteCategory } from "./actions";
import { ICategory } from "@/types/category";
import { useEffect, useRef } from "react";

interface CategoriesPageProps {
  categories: ICategory[];
}

export default function CategoriesPageClient({ categories }: CategoriesPageProps) {
  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to reset the form after successful submission
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <Button type="submit">Create Category</Button>
              {state.message && (
                <p className={`text-sm mt-2 ${state.success ? "text-green-600" : "text-red-600"}`}>
                  {state.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteCategory.bind(null, cat._id)}>
                        <Button variant="ghost" size="icon" type="submit">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
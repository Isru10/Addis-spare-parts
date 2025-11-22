/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// CORRECTED: Import 'useActionState' from 'react'
import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IProduct, IVariant } from "@/types/product";
import { ICategory } from "@/types/category";
import { PlusCircle, Trash2, X } from "lucide-react";
import { createOrUpdateProduct } from "@/app/admin/products/actions";

// Type for our form's state, returned by the server action
interface FormState {
  success: boolean;
  message: string;
}

// Helper component to show a pending state on the submit button
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (isEditMode ? "Saving Changes..." : "Creating Product...") : (isEditMode ? "Save Changes" : "Create Product")}
    </Button>
  );
}

interface ProductFormProps {
  product?: IProduct | null;
  categories: ICategory[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const isEditMode = !!product;
  
  const [variants, setVariants] = useState<Partial<IVariant>[]>(
    product?.variants && product.variants.length > 0 ? product.variants : [{ sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]
  );
  
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);

  const initialState: FormState = { success: false, message: "" };
  // CORRECTED: The hook is now named useActionState
  const [state, formAction] = useActionState(createOrUpdateProduct, initialState);

  // --- IMAGE HANDLERS ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setNewImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveImage = (indexToRemove: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    } else {
      const fileIndexToRemove = indexToRemove - existingImages.length;
      setNewImageFiles(prev => prev.filter((_, index) => index !== fileIndexToRemove));
    }
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- VARIANT HANDLERS ---
  const handleAddVariant = () => {
    setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };
  
  const handleVariantChange = (index: number, field: keyof IVariant, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  const handleAttributeChange = (variantIndex: number, attrIndex: number, field: 'name' | 'value', value: string) => {
    const newVariants = [...variants];
    if (newVariants[variantIndex] && newVariants[variantIndex].attributes) {
      (newVariants[variantIndex].attributes as any)[attrIndex][field] = value;
      setVariants(newVariants);
    }
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <input type="hidden" name="productId" value={product?._id || ''} />
      <input type="hidden" name="existingImages" value={existingImages.join(',')} />

      <div className="lg:col-span-2 grid gap-6">
        <Card>
          <CardHeader><CardTitle>Core Product Details</CardTitle><CardDescription>Provide the main information about the product.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" defaultValue={product?.name || ""} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={product?.description || ""} required rows={5} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" defaultValue={product?.brand || ""} required /></div>
              <div><Label htmlFor="category">Category</Label><Select name="category" defaultValue={product?.category?.toString() || ""}><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Variants</CardTitle><CardDescription>Define different versions of this product, like condition or color.</CardDescription></CardHeader>
          <CardContent className="grid gap-6">
            {variants.map((variant, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <p className="font-semibold mb-2">Variant {index + 1}</p>
                <input type="hidden" name={`variant-${index}-id`} value={variant._id || ''} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label>SKU</Label><Input name={`variant-${index}-sku`} value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="e.g., TY-BRK-001" required /></div>
                  <div><Label>Price</Label><Input name={`variant-${index}-price`} type="number" step="0.01" value={variant.price} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value))} required /></div>
                  <div><Label>Stock</Label><Input name={`variant-${index}-stock`} type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value))} required /></div>
                </div>
                <div className="mt-4"><Label>Attributes</Label><div className="flex gap-2"><Input name={`variant-${index}-attr-0-name`} value={variant.attributes?.[0]?.name || 'Condition'} onChange={e => handleAttributeChange(index, 0, 'name', e.target.value)} className="w-1/3" /><Input name={`variant-${index}-attr-0-value`} value={variant.attributes?.[0]?.value || 'New'} onChange={e => handleAttributeChange(index, 0, 'value', e.target.value)} /></div></div>
                {variants.length > 1 && (<Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveVariant(index)}><Trash2 className="h-4 w-4" /></Button>)}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddVariant}><PlusCircle className="mr-2 h-4 w-4" /> Add Another Variant</Button>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 grid gap-6 content-start">
        <Card>
          <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2"><Label htmlFor="isActive">Active</Label><Switch id="isActive" name="isActive" defaultChecked={product?.isActive ?? true} /></div>
            <p className="text-sm text-muted-foreground mt-2">Inactive products will be hidden from the storefront.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Media</CardTitle><CardDescription>Upload at least two images.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label htmlFor="image-uploads" className="cursor-pointer">Upload Images</Label><Input id="image-uploads" name="image-uploads" type="file" multiple onChange={handleImageChange} className="mt-1" /></div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image src={previewUrl} alt={`Image preview ${index + 1}`} fill className="rounded-md object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveImage(index, index < existingImages.length)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2">
          <SubmitButton isEditMode={isEditMode} />
          {state.message && (<p className={`text-sm text-right ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>)}
        </div>
      </div>
    </form>
  );
}
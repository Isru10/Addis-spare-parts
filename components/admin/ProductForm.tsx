/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// // CORRECTED: Import 'useActionState' from 'react'
// import { useState, useActionState } from "react";
// import { useFormStatus } from "react-dom";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { IProduct, IVariant } from "@/types/product";
// import { ICategory } from "@/types/category";
// import { PlusCircle, Trash2, X } from "lucide-react";
// import { createOrUpdateProduct } from "@/app/admin/products/actions";

// // Type for our form's state, returned by the server action
// interface FormState {
//   success: boolean;
//   message: string;
// }

// // Helper component to show a pending state on the submit button
// function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
//   const { pending } = useFormStatus();
//   return (
//     <Button type="submit" disabled={pending} size="lg">
//       {pending ? (isEditMode ? "Saving Changes..." : "Creating Product...") : (isEditMode ? "Save Changes" : "Create Product")}
//     </Button>
//   );
// }

// interface ProductFormProps {
//   product?: IProduct | null;
//   categories: ICategory[];
// }

// export default function ProductForm({ product, categories }: ProductFormProps) {
//   const isEditMode = !!product;
  
//   const [variants, setVariants] = useState<Partial<IVariant>[]>(
//     product?.variants && product.variants.length > 0 ? product.variants : [{ sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]
//   );
  
//   const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
//   const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);

//   const initialState: FormState = { success: false, message: "" };
//   // CORRECTED: The hook is now named useActionState
//   const [state, formAction] = useActionState(createOrUpdateProduct, initialState);

//   // --- IMAGE HANDLERS ---
//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(event.target.files || []);
//     if (files.length > 0) {
//       setNewImageFiles(prev => [...prev, ...files]);
//       const newPreviews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews(prev => [...prev, ...newPreviews]);
//     }
//   };
  
//   const handleRemoveImage = (indexToRemove: number, isExisting: boolean) => {
//     if (isExisting) {
//       setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
//     } else {
//       const fileIndexToRemove = indexToRemove - existingImages.length;
//       setNewImageFiles(prev => prev.filter((_, index) => index !== fileIndexToRemove));
//     }
//     setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
//   };

//   // --- VARIANT HANDLERS ---
//   const handleAddVariant = () => {
//     setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]);
//   };

//   const handleRemoveVariant = (index: number) => {
//     const newVariants = variants.filter((_, i) => i !== index);
//     setVariants(newVariants);
//   };
  
//   const handleVariantChange = (index: number, field: keyof IVariant, value: any) => {
//     const newVariants = [...variants];
//     (newVariants[index] as any)[field] = value;
//     setVariants(newVariants);
//   };
  
//   const handleAttributeChange = (variantIndex: number, attrIndex: number, field: 'name' | 'value', value: string) => {
//     const newVariants = [...variants];
//     if (newVariants[variantIndex] && newVariants[variantIndex].attributes) {
//       (newVariants[variantIndex].attributes as any)[attrIndex][field] = value;
//       setVariants(newVariants);
//     }
//   };

//   return (
//     <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <input type="hidden" name="productId" value={product?._id || ''} />
//       <input type="hidden" name="existingImages" value={existingImages.join(',')} />

//       <div className="lg:col-span-2 grid gap-6">
//         <Card>
//           <CardHeader><CardTitle>Core Product Details</CardTitle><CardDescription>Provide the main information about the product.</CardDescription></CardHeader>
//           <CardContent className="grid gap-4">
//             <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" defaultValue={product?.name || ""} required /></div>
//             <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={product?.description || ""} required rows={5} /></div>
//             <div className="grid grid-cols-2 gap-4">
//               <div><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" defaultValue={product?.brand || ""} required /></div>
//               <div><Label htmlFor="category">Category</Label><Select name="category" defaultValue={product?.category?.toString() || ""}><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle>Variants</CardTitle><CardDescription>Define different versions of this product, like condition or color.</CardDescription></CardHeader>
//           <CardContent className="grid gap-6">
//             {variants.map((variant, index) => (
//               <div key={index} className="p-4 border rounded-lg relative">
//                 <p className="font-semibold mb-2">Variant {index + 1}</p>
//                 <input type="hidden" name={`variant-${index}-id`} value={variant._id || ''} />
//                 <div className="grid sm:grid-cols-3 gap-4">
//                   <div><Label>SKU</Label><Input name={`variant-${index}-sku`} value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="e.g., TY-BRK-001" required /></div>
//                   <div><Label>Price</Label><Input name={`variant-${index}-price`} type="number" step="0.01" value={variant.price} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value))} required /></div>
//                   <div><Label>Stock</Label><Input name={`variant-${index}-stock`} type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value))} required /></div>
//                 </div>
//                 <div className="mt-4"><Label>Attributes</Label><div className="flex gap-2"><Input name={`variant-${index}-attr-0-name`} value={variant.attributes?.[0]?.name || 'Condition'} onChange={e => handleAttributeChange(index, 0, 'name', e.target.value)} className="w-1/3" /><Input name={`variant-${index}-attr-0-value`} value={variant.attributes?.[0]?.value || 'New'} onChange={e => handleAttributeChange(index, 0, 'value', e.target.value)} /></div></div>
//                 {variants.length > 1 && (<Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveVariant(index)}><Trash2 className="h-4 w-4" /></Button>)}
//               </div>
//             ))}
//             <Button type="button" variant="outline" onClick={handleAddVariant}><PlusCircle className="mr-2 h-4 w-4" /> Add Another Variant</Button>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="lg:col-span-1 grid gap-6 content-start">
//         <Card>
//           <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
//           <CardContent>
//             <div className="flex items-center space-x-2"><Label htmlFor="isActive">Active</Label><Switch id="isActive" name="isActive" defaultChecked={product?.isActive ?? true} /></div>
//             <p className="text-sm text-muted-foreground mt-2">Inactive products will be hidden from the storefront.</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle>Media</CardTitle><CardDescription>Upload at least two images.</CardDescription></CardHeader>
//           <CardContent className="grid gap-4">
//             <div><Label htmlFor="image-uploads" className="cursor-pointer">Upload Images</Label><Input id="image-uploads" name="image-uploads" type="file" multiple onChange={handleImageChange} className="mt-1" /></div>
//             {imagePreviews.length > 0 && (
//               <div className="grid grid-cols-3 gap-2">
//                 {imagePreviews.map((previewUrl, index) => (
//                   <div key={index} className="relative aspect-square group">
//                     <Image src={previewUrl} alt={`Image preview ${index + 1}`} fill className="rounded-md object-cover" />
//                     <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveImage(index, index < existingImages.length)}><X className="h-4 w-4" /></Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//         <div className="flex flex-col gap-2">
//           <SubmitButton isEditMode={isEditMode} />
//           {state.message && (<p className={`text-sm text-right ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>)}
//         </div>
//       </div>
//     </form>
//   );
// }



"use client";

import { useState, useActionState, useRef } from "react";
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
import { PlusCircle, Trash2, X, Upload, Badge } from "lucide-react";
import { createOrUpdateProduct } from "@/app/admin/products/actions";

interface FormState {
  success: boolean;
  message: string;
}

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending 
        ? (isEditMode ? "Saving Changes..." : "Creating Product...") 
        : (isEditMode ? "Save Changes" : "Create Product")
      }
    </Button>
  );
}

interface ProductFormProps {
  product?: IProduct | null;
  categories: ICategory[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const isEditMode = !!product;
  
  // State
  const [variants, setVariants] = useState<Partial<IVariant>[]>(
    product?.variants && product.variants.length > 0 
      ? product.variants 
      : [{ sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]
  );
  
  // Model Compatibility Tag State
  const [modelTags, setModelTags] = useState<string[]>(product?.modelCompatibility || []);
  const [currentTag, setCurrentTag] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);
  
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useActionState(createOrUpdateProduct, initialState);

  // --- MODEL COMPATIBILITY HANDLERS ---
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!modelTags.includes(currentTag.trim())) {
        setModelTags([...modelTags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setModelTags(modelTags.filter(tag => tag !== tagToRemove));
  };

  // --- IMAGE HANDLERS ---
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveImage = (indexToRemove: number, isExisting: boolean) => {
    // If it's an existing image (string URL), we update the hidden input list
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    } 
    // We always update the preview list
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- VARIANT HANDLERS ---
  const handleAddVariant = () => {
    setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };
  
  const handleVariantChange = (index: number, field: keyof IVariant, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  // Dynamic Attributes Logic
  const handleAddAttribute = (variantIndex: number) => {
    const newVariants = [...variants];
    if (!newVariants[variantIndex].attributes) newVariants[variantIndex].attributes = [];
    newVariants[variantIndex].attributes?.push({ name: '', value: '' });
    setVariants(newVariants);
  };

  const handleRemoveAttribute = (variantIndex: number, attrIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].attributes = newVariants[variantIndex].attributes?.filter((_, i) => i !== attrIndex);
    setVariants(newVariants);
  };

  const handleAttributeChange = (variantIndex: number, attrIndex: number, field: 'name' | 'value', value: string) => {
    const newVariants = [...variants];
    if (newVariants[variantIndex].attributes?.[attrIndex]) {
      newVariants[variantIndex].attributes![attrIndex][field] = value;
      setVariants(newVariants);
    }
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <input type="hidden" name="productId" value={product?._id || ''} />
      <input type="hidden" name="existingImages" value={existingImages.join(',')} />
      {/* Crucial: Pass complex arrays as JSON strings */}
      <input type="hidden" name="variantsJSON" value={JSON.stringify(variants)} />
      <input type="hidden" name="modelCompatibility" value={modelTags.join(',')} />

      <div className="lg:col-span-2 space-y-8">
        {/* 1. Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Basic details about the auto part.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" defaultValue={product?.name || ""} placeholder="e.g. Brake Pad Set" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={product?.description || ""} placeholder="Describe the part..." required rows={5} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand / Manufacturer</Label>
                <Input id="brand" name="brand" defaultValue={product?.brand || ""} placeholder="e.g. Bosch" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={product?.category?.toString() || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Compatibility & Specs */}
        <Card>
          <CardHeader>
            <CardTitle>Compatibility & Specs</CardTitle>
            <CardDescription>Define which vehicles this part fits.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
             {/* Year Range */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearStart">Start Year</Label>
                  <Input type="number" id="yearStart" name="yearStart" defaultValue={product?.yearRange?.start || ""} placeholder="e.g. 2015" />
                </div>
                <div>
                  <Label htmlFor="yearEnd">End Year</Label>
                  <Input type="number" id="yearEnd" name="yearEnd" defaultValue={product?.yearRange?.end || ""} placeholder="e.g. 2023" />
                </div>
             </div>

             {/* Tag Input for Models */}
             <div className="grid gap-2">
                <Label>Model Compatibility (Press Enter to add)</Label>
                <Input 
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type model and press Enter (e.g. Toyota Camry)" 
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {modelTags.map((tag, idx) => (
                    <div key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {modelTags.length === 0 && <span className="text-sm text-muted-foreground italic">No models added yet.</span>}
                </div>
             </div>
          </CardContent>
        </Card>

        {/* 3. Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Variants</CardTitle>
            <CardDescription>Manage different versions (Condition, Specs) of this product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {variants.map((variant, index) => (
              <div key={index} className="p-4 border rounded-lg relative bg-card/50">
                <div className="absolute top-4 right-4 flex gap-2">
                  {variants.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveVariant(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Variant #{index + 1}</h4>
                
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-xs">SKU</Label>
                    <Input value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} placeholder="SKU-123" required />
                  </div>
                  <div>
                    <Label className="text-xs">Price ($)</Label>
                    <Input type="number" step="0.01" value={variant.price} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value))} required />
                  </div>
                  <div>
                    <Label className="text-xs">Stock Qty</Label>
                    <Input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value))} required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs">Attributes (e.g. Condition: New, Color: Red)</Label>
                  {variant.attributes?.map((attr, attrIndex) => (
                    <div key={attrIndex} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Name (e.g. Condition)" 
                        value={attr.name} 
                        onChange={e => handleAttributeChange(index, attrIndex, 'name', e.target.value)} 
                        className="w-1/3 h-8 text-sm"
                      />
                      <Input 
                        placeholder="Value (e.g. New)" 
                        value={attr.value} 
                        onChange={e => handleAttributeChange(index, attrIndex, 'value', e.target.value)}
                        className="flex-1 h-8 text-sm" 
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveAttribute(index, attrIndex)}
                        disabled={variant.attributes!.length <= 1}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddAttribute(index)} className="h-7 text-xs">
                    + Add Attribute
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" className="w-full border-dashed border-2" onClick={handleAddVariant}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Another Variant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between border p-3 rounded-md">
              <Label htmlFor="isActive" className="cursor-pointer">Active Status</Label>
              <Switch id="isActive" name="isActive" defaultChecked={product?.isActive ?? true} />
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Upload clear images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-muted group">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleRemoveImage(index, index < existingImages.length)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer bg-muted/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-2">Upload</span>
                <input 
                  type="file" 
                  name="image-uploads" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Recommended: 1:1 Square images.
            </p>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="sticky top-6">
           <SubmitButton isEditMode={isEditMode} />
           {state.message && (
             <div className={`mt-4 p-3 rounded-md text-sm text-center font-medium ${state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
               {state.message}
             </div>
           )}
        </div>
      </div>
    </form>
  );
}
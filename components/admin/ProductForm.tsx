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

import { useState, useActionState, useEffect } from "react";
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
import { PlusCircle, Trash2, X, Upload, Loader2, Sparkles } from "lucide-react"; // Added Sparkles icon
import { createOrUpdateProduct } from "@/app/admin/products/actions";

// Types
interface FormState { success: boolean; message: string; }
interface SpecValue { name: string; value: string; }

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
      ) : (isEditMode ? "Save Changes" : "Create Product")}
    </Button>
  );
}

interface ProductFormProps {
  product?: IProduct | null;
  categories: ICategory[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const isEditMode = !!product;
  
  // --- STATE ---
  const [variants, setVariants] = useState<Partial<IVariant>[]>(
    product?.variants && product.variants.length > 0 ? product.variants : [{ sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]
  );
  const [modelTags, setModelTags] = useState<string[]>(product?.modelCompatibility || []);
  const [currentTag, setCurrentTag] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);
  
  // NEW: Category & Dynamic Specs State
  // We initialize specs from the product if editing, or empty array
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(product?.category?.toString() || "");
  const [specs, setSpecs] = useState<SpecValue[]>(
    product && (product as any).specs ? (product as any).specs : []
  );

  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useActionState(createOrUpdateProduct, initialState);

  // --- DYNAMIC SPECS LOGIC ---
  // When category changes, we need to rebuild the available fields
  const selectedCategoryData = categories.find(c => c._id === selectedCategoryId);

  useEffect(() => {
    if (!selectedCategoryData) return;
    
    // If we switched categories, we want to initialize empty values for the NEW attributes
    // But keep existing values if the attribute name matches (helpful if switching to sub-category)
    const newSpecs = selectedCategoryData.attributes.map(attr => {
      const existing = specs.find(s => s.name === attr.name);
      return {
        name: attr.name,
        value: existing ? existing.value : ""
      };
    });

    // Only update if the structure actually changed significantly to avoid loops, 
    // or if we are just starting fresh
    if (specs.length === 0 || specs[0]?.name !== newSpecs[0]?.name) {
       setSpecs(newSpecs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]); 

  const handleSpecChange = (name: string, value: string) => {
    setSpecs(prev => prev.map(s => s.name === name ? { ...s, value } : s));
  };


  // --- HELPERS (Images, Variants, Tags) ---
  // ... (These handlers are largely the same as before, condensed for brevity)
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!modelTags.includes(currentTag.trim())) setModelTags([...modelTags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  const removeTag = (t: string) => setModelTags(modelTags.filter(tag => tag !== t));
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const handleRemoveImage = (idx: number, isExisting: boolean) => {
    if (isExisting) setExistingImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx: number, field: string, val: any) => {
    const v = [...variants]; (v[idx] as any)[field] = val; setVariants(v);
  };
  const handleAddVariant = () => setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: [{ name: 'Condition', value: 'New' }] }]);
  const handleRemoveVariant = (idx: number) => setVariants(variants.filter((_, i) => i !== idx));

  // --- RENDER ---
  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Hidden Fields for JSON Data */}
      <input type="hidden" name="productId" value={product?._id || ''} />
      <input type="hidden" name="existingImages" value={existingImages.join(',')} />
      <input type="hidden" name="variantsJSON" value={JSON.stringify(variants)} />
      <input type="hidden" name="modelCompatibility" value={modelTags.join(',')} />
      {/* NEW: Serialize Specs */}
      <input type="hidden" name="specsJSON" value={JSON.stringify(specs)} />

      <div className="lg:col-span-2 space-y-8">
        
        {/* 1. Category Selection (Moved up as it drives the form) */}
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-muted/10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> 
              Category & Specs
            </CardTitle>
            <CardDescription>Selecting a category determines the technical fields.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="grid gap-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select name="category" value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {/* Show Hierarchy: "Engine > Pistons" */}
                        {typeof cat.parentCategory === 'object' && cat.parentCategory 
                          ? `${(cat.parentCategory as ICategory).name} > ${cat.name}` 
                          : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            {/* DYNAMIC SPECS INPUTS */}
            {selectedCategoryData && selectedCategoryData.attributes.length > 0 && (
              <div className="bg-secondary/20 p-4 rounded-lg border space-y-4 animate-in fade-in">
                <h3 className="font-semibold text-sm text-foreground mb-2">
                  Technical Specifications for {selectedCategoryData.name}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedCategoryData.attributes.map((attr) => {
                    const currentValue = specs.find(s => s.name === attr.name)?.value || "";
                    
                    return (
                      <div key={attr.name} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{attr.name}</Label>
                        
                        {/* Render based on attribute TYPE */}
                        {attr.type === "select" ? (
                          <Select 
                            value={currentValue} 
                            onValueChange={(val) => handleSpecChange(attr.name, val)}
                          >
                            <SelectTrigger className="bg-background"><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                              {attr.options?.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            type={attr.type === "number" ? "number" : "text"}
                            value={currentValue}
                            onChange={(e) => handleSpecChange(attr.name, e.target.value)}
                            className="bg-background"
                            placeholder={attr.type === "number" ? "0.00" : "Value..."}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedCategoryId && (!selectedCategoryData?.attributes || selectedCategoryData.attributes.length === 0) && (
              <p className="text-sm text-muted-foreground italic">
                This category has no specific technical attributes defined.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 2. Basic Info */}
        <Card>
          <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label>Product Name</Label><Input name="name" defaultValue={product?.name || ""} required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Brand</Label><Input name="brand" defaultValue={product?.brand || ""} required /></div>
            </div>
            <div><Label>Description</Label><Textarea name="description" defaultValue={product?.description || ""} rows={4} required /></div>
          </CardContent>
        </Card>

        {/* 3. Variants (Prices/Stock) */}
        <Card>
          <CardHeader><CardTitle>Inventory & Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             {variants.map((v, i) => (
               <div key={i} className="p-4 border rounded-lg bg-card/50 relative">
                 <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500" onClick={() => handleRemoveVariant(i)}><X className="h-4 w-4"/></Button>
                 <div className="grid sm:grid-cols-3 gap-3 mb-3">
                   <div><Label className="text-xs">SKU</Label><Input value={v.sku} onChange={e => handleVariantChange(i, 'sku', e.target.value)} required /></div>
                   <div><Label className="text-xs">Price</Label><Input type="number" step="0.01" value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} required /></div>
                   <div><Label className="text-xs">Stock</Label><Input type="number" value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} required /></div>
                 </div>
                 {/* Basic Variant Attribute (Condition) */}
                 <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Variant Type</Label>
                      <Input value={v.attributes?.[0].value} onChange={(e) => {
                         const newV = [...variants];
                         if(newV[i].attributes) newV[i].attributes![0].value = e.target.value;
                         setVariants(newV);
                      }} placeholder="e.g. New / Used / Refurbished" />
                    </div>
                 </div>
               </div>
             ))}
             <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}><PlusCircle className="mr-2 h-4 w-4"/> Add Variant</Button>
          </CardContent>
        </Card>

        {/* 4. Compatibility */}
        <Card>
           <CardHeader><CardTitle>Vehicle Compatibility</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>Year Start</Label><Input name="yearStart" type="number" defaultValue={product?.yearRange?.start} /></div>
                 <div><Label>Year End</Label><Input name="yearEnd" type="number" defaultValue={product?.yearRange?.end} /></div>
              </div>
              <div>
                <Label>Models (Type & Enter)</Label>
                <Input value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={handleAddTag} placeholder="Toyota Camry..." />
                <div className="flex flex-wrap gap-2 mt-2">
                  {modelTags.map(t => (
                    <span key={t} className="bg-secondary px-2 py-1 rounded text-xs flex items-center gap-1">{t} <button type="button" onClick={() => removeTag(t)}><X className="h-3 w-3"/></button></span>
                  ))}
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
           <CardHeader><CardTitle>Visibility</CardTitle></CardHeader>
           <CardContent>
             <div className="flex items-center gap-2 p-2 border rounded">
                <Switch name="isActive" defaultChecked={product?.isActive ?? true} /> <span className="text-sm">Active</span>
             </div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader><CardTitle>Images</CardTitle></CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-3 gap-2">
               {imagePreviews.map((src, i) => (
                 <div key={i} className="relative aspect-square border rounded overflow-hidden group">
                   <Image src={src} alt="Preview" fill className="object-cover" />
                   <button type="button" onClick={() => handleRemoveImage(i, i < existingImages.length)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Trash2 className="h-5 w-5"/></button>
                 </div>
               ))}
               <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded cursor-pointer hover:bg-muted">
                 <Upload className="h-6 w-6 text-muted-foreground" />
                 <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} name="image-uploads" />
               </label>
             </div>
           </CardContent>
        </Card>
        
        <div className="sticky top-6">
           <SubmitButton isEditMode={isEditMode} />
           {state.message && <p className={`mt-2 text-sm text-center ${state.success ? 'text-green-600':'text-red-500'}`}>{state.message}</p>}
        </div>
      </div>
    </form>
  );
}
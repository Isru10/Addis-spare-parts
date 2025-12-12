
// src/components/admin/CategoryForm.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom"; // IMPORT THIS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ICategory, ICategoryAttribute } from "@/types/category";
import { createOrUpdateCategory } from "@/app/(admin)/admin/categories/actions";
import { Plus, Trash2, X, Loader2 } from "lucide-react"; // Import Loader2
import Image from "next/image";

// New component for the button to access form status
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        isEditing ? "Update Category" : "Create Category"
      )}
    </Button>
  );
}

interface CategoryFormProps {
  category?: ICategory | null;
  allCategories: ICategory[]; 
  closeSheet: () => void;
}

export default function CategoryForm({ category, allCategories, closeSheet }: CategoryFormProps) {
  const [attributes, setAttributes] = useState<ICategoryAttribute[]>(category?.attributes || []);
  const [imagePreview, setImagePreview] = useState<string>(category?.image || "");
  const [clientError, setClientError] = useState(""); // For local validation errors

  const initialState = { success: false, message: "" };
  const [state, formAction] = useActionState(createOrUpdateCategory, initialState);

  // Close sheet on success
  useEffect(() => {
    if (state.success) {
      closeSheet();
    }
  }, [state.success, closeSheet]);

  const getParentValue = () => {
    if (!category?.parentCategory) return "root";
    return typeof category.parentCategory === 'object' 
      ? category.parentCategory._id 
      : category.parentCategory.toString();
  };

  // --- Attributes ---
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", type: "text", options: [] }]);
  };
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };
  const updateAttribute = (index: number, field: keyof ICategoryAttribute, value: any) => {
    const newAttrs = [...attributes];
    (newAttrs[index] as any)[field] = value;
    setAttributes(newAttrs);
  };
  const handleOptionsChange = (index: number, value: string) => {
    const optionsArray = value.split(",").map(s => s.trim()).filter(Boolean);
    updateAttribute(index, "options", optionsArray);
  };

  // --- Image Validation ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientError(""); // Reset error
    const file = e.target.files?.[0];
    
    if (file) {
      // 2MB Limit Check
      if (file.size > 2 * 1024 * 1024) {
        setClientError("File is too large. Maximum size is 2MB.");
        e.target.value = ""; // Clear input
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formAction} className="space-y-6 pt-4">
      <input type="hidden" name="categoryId" value={category?._id || ""} />
      <input type="hidden" name="existingImage" value={category?.image || ""} />
      <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Category Name <span className="text-red-500">*</span></Label>
          <Input 
            name="name" 
            defaultValue={category?.name} 
            required 
            minLength={2}
            placeholder="e.g. Engine Parts" 
          />
        </div>

        <div className="grid gap-2">
          <Label>Parent Category</Label>
          <Select name="parentCategory" defaultValue={getParentValue()}>
            <SelectTrigger>
              <SelectValue placeholder="Select Parent" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="root">None (Root Category)</SelectItem>
                {allCategories
                  .filter(c => c._id !== category?._id) 
                  .map(c => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
           <Label>Description</Label>
           <Textarea name="description" defaultValue={category?.description} rows={3} placeholder="Optional description..." />
        </div>
      </div>

      {/* Attributes Builder */}
      <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="font-semibold text-sm">Dynamic Attributes</h3>
           <Button type="button" size="sm" variant="outline" onClick={addAttribute}>
             <Plus className="h-3 w-3 mr-1" /> Add
           </Button>
        </div>
        <div className="space-y-3">
          {attributes.map((attr, index) => (
            <div key={index} className="flex flex-col gap-2 p-3 bg-background border rounded-md relative group animate-in fade-in">
               <button 
                 type="button" 
                 onClick={() => removeAttribute(index)}
                 className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
               >
                 <X className="h-4 w-4" />
               </button>
               <div className="flex gap-2">
                 <div className="flex-1">
                   <Label className="text-xs">Name</Label>
                   <Input 
                     value={attr.name} 
                     onChange={(e) => updateAttribute(index, "name", e.target.value)} 
                     placeholder="Name" 
                     className="h-8 text-sm"
                     required // Make attribute name required if row exists
                   />
                 </div>
                 <div className="w-1/3">
                   <Label className="text-xs">Type</Label>
                   <Select 
                     value={attr.type} 
                     onValueChange={(val) => updateAttribute(index, "type", val)}
                   >
                     <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="text">Text</SelectItem>
                       <SelectItem value="number">Number</SelectItem>
                       <SelectItem value="select">Dropdown</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               {attr.type === "select" && (
                 <div>
                   <Label className="text-xs">Options</Label>
                   <Input 
                     defaultValue={attr.options?.join(", ")}
                     onChange={(e) => handleOptionsChange(index, e.target.value)}
                     placeholder="Comma separated (Red, Blue)"
                     className="h-8 text-sm"
                   />
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Image & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <Label>Icon (Max 2MB)</Label>
           <div className="flex items-center gap-3">
             {imagePreview && (
               <div className="relative w-12 h-12 rounded border overflow-hidden">
                 <Image src={imagePreview} alt="Preview" fill className="object-cover" />
               </div>
             )}
             <Input 
                name="image" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange} 
                className="text-xs" 
              />
           </div>
           {clientError && <p className="text-xs text-red-500 font-medium">{clientError}</p>}
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center gap-2 border p-2 rounded-md h-[40px]">
             <Switch name="isActive" defaultChecked={category?.isActive ?? true} />
             <span className="text-sm">Active</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
         <SubmitButton isEditing={!!category} />
      </div>
      
      {/* Server Side Errors */}
      {state.message && !state.success && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200">
          {state.message}
        </div>
      )}
    </form>
  );
}
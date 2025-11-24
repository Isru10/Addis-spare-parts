// src/app/products/actions.ts
"use server";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ICategory } from "@/types/category"; // 1. Import the type

export interface FilterOptions {
  brands: string[];
  models: string[]; 
  specs: { name: string; options: string[] }[];
}

export async function getCategoryOptions(categoryId: string): Promise<FilterOptions> {
  await dbConnect();

  // 2. THE FIX: Add <ICategory> to .lean()
  // This tells TypeScript: "Trust me, the result has 'attributes', 'name', etc."
  const categoryDef = await Category.findById(categoryId).lean<ICategory>();
  
  if (!categoryDef) return { brands: [], models: [], specs: [] };

  // 3. Aggregate available data for products in this category
  // We use 'any' here for the product mapping because Mongoose's lean product type 
  // can be verbose to define perfectly for partial selects.
  const products = await Product.find({ 
    category: categoryId, 
    isActive: true 
  }).select("brand modelCompatibility specs").lean();

  // 4. Extract Unique Brands
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brands = Array.from(new Set(products.map((p: any) => p.brand))).sort();

  // 5. Extract Unique Models (Compatibility)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models = Array.from(new Set(products.flatMap((p: any) => p.modelCompatibility || []))).sort();

  // 6. Extract Unique Spec Values
  // Since we typed categoryDef as ICategory, .attributes is now accessible without error
  const specs = (categoryDef.attributes || []).map((attr) => {
    const values = new Set<string>();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products.forEach((p: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spec = p.specs?.find((s: any) => s.name === attr.name);
      if (spec && spec.value) {
        values.add(spec.value.toString());
      }
    });

    return {
      name: attr.name,
      options: Array.from(values).sort() 
    };
  }).filter((s) => s.options.length > 0); 

  return { brands, models, specs };
}
"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/actions/get-categories.ts
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { ICategory } from "@/types/category";

export interface CategoryTree extends ICategory {
  children?: ICategory[];
}

export async function getCategoryTree(): Promise<CategoryTree[]> {
  await dbConnect();

  // 1. Fetch all active categories
  // We populate parentCategory just to get the ID string easily
  const allCategories = await Category.find({ isActive: true })
    .lean<ICategory[]>();

  const cleanedCategories = JSON.parse(JSON.stringify(allCategories));

  // 2. Separate Roots (No Parent) from Children (Has Parent)
  const roots = cleanedCategories.filter((c: any) => !c.parentCategory || c.parentCategory === "root");
  const children = cleanedCategories.filter((c: any) => c.parentCategory && c.parentCategory !== "root");

  // 3. Map children to their parents
  const tree = roots.map((root: any) => {
    // Find all immediate children of this root
    const myChildren = children.filter((child: any) => 
      // Handle both populated object or string ID
      (typeof child.parentCategory === 'string' ? child.parentCategory : child.parentCategory._id) === root._id
    );

    return {
      ...root,
      children: myChildren
    };
  });

  return tree;
}

// src/app/admin/categories/page.tsx (New Server Component Wrapper)
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { ICategory } from "@/types/category";
import CategoriesPageClient from "./CategoriesClientPage";


async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 }).lean<ICategory[]>();
  return JSON.parse(JSON.stringify(categories));
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoriesPageClient categories={categories} />;
}
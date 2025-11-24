// src/hooks/use-categories.ts



"use client";

import { useState, useEffect } from "react";
import { CategoryTree, getCategoryTree } from "@/app/actions/get-categories";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryTree()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}
// src/types/product.d.ts

// 1. Define the shape of a single product variant
export interface IVariant {
  _id?: string; // Mongoose adds an _id to sub-documents
  attributes: {
    name: string;
    value: string;
  }[];
  sku: string;
  price: number;
  stock: number;
}

// 2. This is the FINAL, official IProduct interface
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string; // This will be the ObjectId string
  brand: string;
  modelCompatibility?: string[];
  yearRange?: {
    start?: number;
    end?: number;
  };
  
  // This is the correct field to use for display purposes
  displayPrice: number;
  
  variants: IVariant[];
  images: string[];
  relatedProducts?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
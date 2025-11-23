// src/types/product.d.ts

export interface IVariant {
  _id?: string;
  attributes: {
    name: string;
    value: string;
  }[];
  sku: string;
  price: number;
  stock: number;
}

// NEW: Define the shape of a Spec
export interface IProductSpec {
  name: string;
  value: string | number;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string; // ObjectId string
  brand: string;
  modelCompatibility?: string[];
  yearRange?: {
    start?: number;
    end?: number;
  };
  
  // NEW: Add the specs field here
  specs?: IProductSpec[];

  displayPrice: number;
  variants: IVariant[];
  images: string[];
  relatedProducts?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
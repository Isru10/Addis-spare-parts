// src/types/order.d.ts

import { IUser } from "./next-auth";
import { IProduct } from "./product";

// Define the shape of the activity log entry
interface IActivityLog {
  adminId: string;
  adminName: string;
  action: string;
  timestamp: string;
}

// Define the shape of the products within an order
interface IOrderProduct {
  product: IProduct; // We can use our existing product type
  variantSku: string;
  quantity: number;
  priceAtPurchase: number;
}

// This is the main interface for our Order object
export interface IOrder {
  _id: string;
  user: Pick<IUser, 'name' | 'email'>; // Populate user with just name and email
  products: IOrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  customerPhone: string;
  paymentScreenshotUrl: string;
  status: 'Pending Verification' | 'Processing' | 'On Route' | 'Delivered' | 'Cancelled';
  activityLog: IActivityLog[];
  createdAt: string;
  updatedAt: string;
}
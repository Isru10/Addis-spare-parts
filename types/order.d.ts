// // src/types/order.d.ts

// export interface IOrderItem {
//   product: string; // Product ID
//   name: string;
//   quantity: number;
//   price: number;
//   variantSku?: string;
// }

// export interface IOrderActivity {
//   adminId?: string;
//   action: string;
//   timestamp: Date;
// }

// export interface IShippingAddress {
//   fullName: string;
//   phone: string;
//   city: string;
//   subCity: string;
//   woreda?: string;
//   houseNumber?: string;
// }

// export interface IOrder {
//   _id: string;
//   userId: string; // User ID
//   items: IOrderItem[];
//   totalAmount: number;
  
//   // New Payment Fields
//   paymentMethod: 'Chapa' | 'Bank Transfer';
//   transactionReference?: string;
//   paymentScreenshotUrl?: string;
  
//   // Lifecycle
//   status: 'Pending Verification' | 'Processing' | 'On Route' | 'Delivered' | 'Cancelled';
  
//   shippingAddress: IShippingAddress;
//   activityLog: IOrderActivity[];
  
//   createdAt: string;
//   updatedAt: string;
// }


// src/types/order.d.ts

export interface IOrderItem {
  product: string; // Product ID
  name: string;
  quantity: number;
  price: number;
  variantSku?: string;
}

export interface IOrderActivity {
  adminId?: string;
  action: string;
  timestamp: Date;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  subCity: string;
  woreda?: string;
  houseNumber?: string;
}

// 1. Helper interface for populated User
export interface IOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface IOrder {
  _id: string;
  
  // 2. userId can be a string OR a populated User object
  userId: string | IOrderUser; 
  
  items: IOrderItem[];
  totalAmount: number;
  
  paymentMethod: 'Chapa' | 'Bank Transfer';
  transactionReference?: string;
  paymentScreenshotUrl?: string;
  
  status: 'Pending Verification' | 'Processing' | 'On Route' | 'Delivered' | 'Cancelled';
  
  shippingAddress: IShippingAddress;
  activityLog: IOrderActivity[];
  
  createdAt: string;
  updatedAt: string;
}
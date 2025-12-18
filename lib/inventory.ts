import Product from "@/models/Product";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function deductStock(items: any[]) {
  // Loop through items and decrement stock
  for (const item of items) {
    if (item.product && item.variantSku) {
      await Product.updateOne(
        { 
          _id: item.product, 
          "variants.sku": item.variantSku 
        },
        { 
          $inc: { "variants.$.stock": -item.quantity } 
        }
      );
    }
  }
}

// Optional: Restore stock if order is cancelled
export async function restoreStock(items: any[]) {
  for (const item of items) {
    if (item.product && item.variantSku) {
      await Product.updateOne(
        { _id: item.product, "variants.sku": item.variantSku },
        { $inc: { "variants.$.stock": item.quantity } }
      );
    }
  }
}
// // src/redux/slices/cartSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IProduct, IVariant } from '@/types/product';
// import { loadCartState } from '@/utils/localStorage';

// // =================================================================
// // ONE SINGLE SOURCE OF TRUTH FOR THE CART ITEM TYPE
// // =================================================================
// export interface CartItem {
//   productId: string;
//   name: string;
//   image: string;
//   sku: string;
//   attributes: { name: string; value: string }[];
//   price: number; // This is the VARIANT'S price
//   quantity: number;
//   stock: number; // Keep track of stock for validation
// }
// // =================================================================

// // This is the payload shape when adding an item from a component
// export interface AddItemPayload {
//   product: IProduct;
//   selectedVariant: IVariant;
// }

// interface CartState {
//   items: CartItem[];
// }

// // Pass the correct type to the loader utility
// const initialState: CartState = {
//   items: typeof window !== 'undefined' ? loadCartState() : [],
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addItem: (state, action: PayloadAction<AddItemPayload>) => {
//       const { product, selectedVariant } = action.payload;
//       const existingItem = state.items.find(item => item.sku === selectedVariant.sku);

//       if (existingItem) {
//         existingItem.quantity++;
//       } else {
//         const newItem: CartItem = {
//           productId: product._id,
//           name: product.name,
//           image: product.images[0] || '',
//           sku: selectedVariant.sku,
//           attributes: selectedVariant.attributes,
//           price: selectedVariant.price,
//           quantity: 1,
//           stock: selectedVariant.stock, // Store the variant's stock
//         };
//         state.items.push(newItem);
//       }
//     },
//     removeItem: (state, action: PayloadAction<{ sku: string }>) => {
//       state.items = state.items.filter(item => item.sku !== action.payload.sku);
//     },
//     incrementQuantity: (state, action: PayloadAction<{ sku: string }>) => {
//       const item = state.items.find(item => item.sku === action.payload.sku);
//       if (item && item.quantity < item.stock) { // Add stock check
//         item.quantity++;
//       }
//     },
//     decrementQuantity: (state, action: PayloadAction<{ sku: string }>) => {
//       const item = state.items.find(item => item.sku === action.payload.sku);
//       if (item && item.quantity > 1) {
//         item.quantity--;
//       }
//     },
//   },
// });

// export const { addItem, removeItem, incrementQuantity, decrementQuantity } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct, IVariant } from '@/types/product';
import { loadCartState } from '@/utils/localStorage';

// =================================================================
// ONE SINGLE SOURCE OF TRUTH FOR THE CART ITEM TYPE
// =================================================================
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  sku: string;
  attributes: { name: string; value: string }[];
  price: number; 
  quantity: number;
  stock: number; 
}
// =================================================================

// UPDATE: Add optional quantity to the payload
export interface AddItemPayload {
  product: IProduct;
  selectedVariant: IVariant;
  quantity?: number; // Optional, defaults to 1 if not sent
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: typeof window !== 'undefined' ? loadCartState() : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AddItemPayload>) => {
      const { product, selectedVariant, quantity } = action.payload;
      
      // Determine how many to add (default to 1 if not specified)
      const quantityToAdd = quantity && quantity > 0 ? quantity : 1;
      
      const existingItem = state.items.find(item => item.sku === selectedVariant.sku);

      if (existingItem) {
        // Check if adding this amount exceeds stock
        if (existingItem.quantity + quantityToAdd <= existingItem.stock) {
            existingItem.quantity += quantityToAdd;
        } else {
            // Cap at max stock if they try to add more than available
            existingItem.quantity = existingItem.stock;
        }
      } else {
        const newItem: CartItem = {
          productId: product._id,
          name: product.name,
          image: product.images[0] || '',
          sku: selectedVariant.sku,
          attributes: selectedVariant.attributes,
          price: selectedVariant.price,
          quantity: quantityToAdd, // Use the passed quantity
          stock: selectedVariant.stock, 
        };
        state.items.push(newItem);
      }
    },
    removeItem: (state, action: PayloadAction<{ sku: string }>) => {
      state.items = state.items.filter(item => item.sku !== action.payload.sku);
    },

    clearCart: (state) => {
      state.items = [];
    },
    incrementQuantity: (state, action: PayloadAction<{ sku: string }>) => {
      const item = state.items.find(item => item.sku === action.payload.sku);
      if (item && item.quantity < item.stock) { 
        item.quantity++;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ sku: string }>) => {
      const item = state.items.find(item => item.sku === action.payload.sku);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
  },
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity,clearCart } = cartSlice.actions;
export default cartSlice.reducer;
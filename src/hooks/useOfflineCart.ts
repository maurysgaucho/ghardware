import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, SaleItem } from '../types';
import { db } from '@/lib/dexie';

interface CartState {
  items: SaleItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.productId === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.unitPrice }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: crypto.randomUUID(),
                saleId: '', // Assigned on checkout
                productId: product.id,
                quantity,
                unitPrice: product.sellingPrice,
                subtotal: product.sellingPrice * quantity,
              },
            ],
          });
        }
      },
      removeItem: (productId) => set({
        items: get().items.filter(item => item.productId !== productId),
      }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.productId === productId
              ? { ...item, quantity, subtotal: quantity * item.unitPrice }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
    }),
    {
      name: 'gamur-cart-storage',
    }
  )
);

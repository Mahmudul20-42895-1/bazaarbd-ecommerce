import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/types"

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items
        if (!currentItems.find((item) => item.id === product.id)) {
          set({ items: [...currentItems, product] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },
      hasItem: (productId) => {
        return !!get().items.find((item) => item.id === productId)
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
)

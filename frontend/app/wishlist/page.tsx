"use client"

import { useWishlistStore } from "@/store/wishlist.store"
import { useCartStore } from "@/store/cart.store"
import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/Button"
import { Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const handleMoveToCart = (product: any) => {
    addToCart(product)
    removeItem(product.id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-bg-card rounded-xl border border-white/10">
          <p className="text-xl text-gray-400 mb-6">Your wishlist is currently empty.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors backdrop-blur-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="p-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-full shadow-lg transition-colors backdrop-blur-sm"
                  title="Move to cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

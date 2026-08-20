"use client"

import { useState } from "react"
import { Star, Minus, Plus, Heart, ShoppingCart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCartStore } from "@/store/cart.store"
import { useWishlistStore } from "@/store/wishlist.store"
import { ReviewCard } from "./ReviewCard"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

interface ProductDetailProps {
  product: any
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem } = useWishlistStore()
  
  const isWishlisted = hasItem(product.id)

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product)
    }
  }

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-bg-card rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-8 relative">
            {product.stock < 5 && product.stock > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="warning">Low Stock</Badge>
              </div>
            )}
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-bg-card p-2",
                  activeImage === idx ? "border-emerald-500" : "border-white/10 hover:border-white/30"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-emerald-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">124 Reviews</span>
              <span className="text-gray-500">|</span>
              <span className={product.stock > 0 ? "text-emerald-500" : "text-red-500"}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-100 mb-6">
            ৳{product.price}
          </div>

          <p className="text-gray-300 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Variants (Example) */}
          <div className="mb-8">
            <h3 className="font-medium text-slate-100 mb-3">Select Color</h3>
            <div className="flex gap-3">
              {["Black", "White", "Blue"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedVariant(color)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm transition-colors",
                    selectedVariant === color 
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" 
                      : "border-white/10 bg-bg-card text-gray-300 hover:border-white/30"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-white/10 rounded-lg bg-bg-card h-12">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium text-slate-100">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="flex-1 h-12 flex items-center justify-center gap-2 text-lg"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" /> 
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            
            <button 
              onClick={toggleWishlist}
              className={cn(
                "w-12 h-12 rounded-lg border flex items-center justify-center transition-all",
                isWishlisted 
                  ? "border-red-500 bg-red-500/10 text-red-500" 
                  : "border-white/10 bg-bg-card text-gray-400 hover:text-white hover:border-white/30"
              )}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4 text-sm text-gray-400">
            <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
              <Share2 className="h-4 w-4" /> Share Product
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-white/10 mb-8">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-4 font-medium text-lg capitalize transition-colors relative",
                activeTab === tab ? "text-emerald-500" : "text-gray-400 hover:text-slate-200"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === "description" && (
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>Experience the next generation of our product line with enhanced features and premium build quality. Designed for the modern user who demands both style and functionality.</p>
              <ul>
                <li>Premium materials for long-lasting durability</li>
                <li>Advanced ergonomic design for comfort</li>
                <li>Industry-leading warranty and support</li>
                <li>Eco-friendly packaging</li>
              </ul>
            </div>
          )}
          
          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Brand</span>
                  <span className="text-slate-100">BazaarBD</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Model Year</span>
                  <span className="text-slate-100">2023</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Weight</span>
                  <span className="text-slate-100">250g</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-100">Customer Reviews</h3>
                <Button variant="outline">Write a Review</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReviewCard 
                  reviewerName="Rahim Uddin" 
                  rating={5} 
                  date="Oct 15, 2023" 
                  text="Excellent product! Exactly as described and fast delivery." 
                />
                <ReviewCard 
                  reviewerName="Sarah Begum" 
                  rating={4} 
                  date="Sep 28, 2023" 
                  text="Good quality for the price. Would buy again." 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

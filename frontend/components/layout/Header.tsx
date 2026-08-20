"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

export function Header() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">
              Bangla<span className="text-emerald-500">Shop</span>
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500 transition-colors text-sm text-white placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/wishlist" className="p-2 text-gray-300 hover:text-emerald-400 transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="p-2 text-gray-300 hover:text-emerald-400 transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="p-2 text-gray-300 hover:text-emerald-400 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

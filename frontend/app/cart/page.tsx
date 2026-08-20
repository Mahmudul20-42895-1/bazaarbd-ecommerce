"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="container mx-auto px-4 py-12 flex-1">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="glass p-12 text-center rounded-xl max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.cartItemId || item.id} className="glass p-4 rounded-xl flex gap-4 items-center">
                <div className="h-24 w-24 rounded-lg bg-white/5 overflow-hidden relative shrink-0">
                  <Image 
                    src={item.images[0] || 'https://via.placeholder.com/150'} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Price: ৳{item.salePrice || item.price}</p>
                </div>
                <div className="flex items-center gap-3 bg-bg-card rounded-md px-3 py-1 border border-white/5">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="text-gray-400 hover:text-white"
                  >-</button>
                  <span className="text-white min-w-[20px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-white"
                  >+</button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-white">৳{(item.salePrice || item.price) * item.quantity}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-400 hover:text-red-300 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="glass p-6 rounded-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>৳{getTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>৳{getTotal()}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-12 text-lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

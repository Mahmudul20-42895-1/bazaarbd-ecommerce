"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      ...product,
      cartItemId: Math.random().toString(36).substr(2, 9),
      quantity: 1,
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="glass rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10">
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img 
          src={product.images[0] || "https://via.placeholder.com/400"} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur text-white text-xs px-2 py-1 rounded-md font-medium">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Link href={`/products/${product.slug}`} className="hover:text-emerald-400 transition-colors">
          <h3 className="font-medium truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">{formatPrice(product.salePrice || product.price)}</span>
          {product.salePrice && (
            <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
          )}
        </div>
        <Button className="w-full mt-2" disabled={!product.inStock} onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

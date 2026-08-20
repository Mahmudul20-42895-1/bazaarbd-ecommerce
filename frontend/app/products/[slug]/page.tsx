"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, Check } from "lucide-react";
import api from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Emerald Green");
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, hasItem } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data?.success && res.data.data) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex-1">
        <p className="text-gray-400">Loading product specifications from database...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex-1">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-6">The product you are looking for does not exist in the database.</p>
        <Link href="/shop">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  const inWish = hasItem(product.id);
  const currentPrice = product.salePrice || product.price;

  const handleAddToCart = () => {
    addItem({
      ...product,
      cartItemId: `${product.id}-${selectedSize}-${selectedColor}`,
      price: currentPrice,
      images: product.images || ["https://via.placeholder.com/200"],
      quantity: quantity,
      selectedVariantId: `${selectedSize}-${selectedColor}`,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-1 max-w-6xl">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-white">{product.category || "Catalog"}</Link>
        <span>/</span>
        <span className="text-emerald-400 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10 bg-bg-card">
            <img
              src={product.images?.[selectedImage] || product.images?.[0] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-emerald-500 scale-105" : "border-white/10 opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {product.brand || "BazaarBD Certified"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">{product.name}</h1>
            {product.name_bn && (
              <p className="text-sm text-gray-400 mt-1">{product.name_bn}</p>
            )}
            
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating || 5) ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount || 24} customer reviews)</span>
              <span className="text-xs text-emerald-400 font-medium">SKU: {product.sku || "BZ-001"}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4 py-4 border-y border-white/10">
            <span className="text-4xl font-bold text-white">৳{currentPrice.toLocaleString()}</span>
            {product.salePrice && (
              <span className="text-xl text-gray-500 line-through">৳{product.price.toLocaleString()}</span>
            )}
            {product.salePrice && (
              <span className="text-xs font-semibold bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">
                SAVE {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            {product.description || "Premium handcrafted product made from finest quality materials in Bangladesh."}
          </p>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Select Size</label>
            <div className="flex gap-3">
              {["M", "L", "XL", "XXL"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`h-10 w-12 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === sz
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : "border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-lg bg-bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 h-12 text-base flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>

              <button
                onClick={() => addToWishlist({ ...product, images: product.images || [] })}
                className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-colors ${
                  inWish ? "border-rose-500 bg-rose-500/20 text-rose-500" : "border-white/10 text-gray-400 hover:text-rose-400"
                }`}
              >
                <Heart className={`h-5 w-5 ${inWish ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-400" />
              <span>Fast 24-48h Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>SSLCOMMERZ Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-emerald-400" />
              <span>7-Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

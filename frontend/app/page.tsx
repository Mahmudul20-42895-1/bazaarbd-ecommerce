"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        if (prodRes.data?.success) setProducts(prodRes.data.data);
        if (catRes.data?.success) setCategories(catRes.data.data);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const testimonials = [
    { name: "Farhan Ahmed", location: "Dhaka", text: "The quality of the Panjabi I ordered was absolutely incredible. Delivery was fast and packaging was premium. Highly recommend!", rating: 5 },
    { name: "Nadia Islam", location: "Chittagong", text: "BazaarBD is now my go-to for traditional wear. The Jamdani saree is exactly as described — stunning craftsmanship!", rating: 5 },
    { name: "Karim Hossain", location: "Sylhet", text: "Smooth checkout experience, great variety of products, and excellent customer support. Will definitely shop again.", rating: 4 },
  ];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero_banner.jpg"
            alt="BazaarBD Hero"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Free Delivery Above ৳1000 Across Bangladesh
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
              Discover Authentic{' '}
              <span className="bg-gradient-emerald bg-clip-text text-transparent">
                Bangladesh
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Handcrafted Jamdani textiles, embroidered Panjabis, leather goods, and modern electronics — delivered directly to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="text-base px-8 h-12 shadow-glow">
                  Shop Now →
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white/20 text-white hover:bg-white/10">
                  View Collections
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 mt-14">
              {[
                { value: '50k+', label: 'Happy Customers' },
                { value: '100% Authentic', label: 'Artisan Crafted' },
                { value: '4.9★', label: 'Customer Rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-white/10 bg-bg-card/50 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ৳1000' },
              { icon: '🔒', title: 'SSLCOMMERZ', sub: 'bKash, Nagad & Cards' },
              { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
              { icon: '💬', title: '24/7 Support', sub: 'Always here for you' },
            ].map(badge => (
              <div key={badge.title} className="flex items-center gap-3 p-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories from Database */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Shop by Category</h2>
          <p className="text-gray-400">Explore our wide selection of curated product lines</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} href={`/shop?category=${cat.name || cat.slug}`}
              className="group bg-bg-card border border-white/10 rounded-xl p-5 text-center hover:scale-105 hover:border-emerald-500/50 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-3 rounded-full overflow-hidden border border-white/10 group-hover:border-emerald-500 transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-1">{cat.count || 'Browse'} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products from Database */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-gray-400">Real-time database catalog</p>
          </div>
          <Link href="/shop" className="text-emerald-500 hover:text-emerald-400 font-medium text-sm transition-colors">
            View All Catalog →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading catalog from database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="py-6 container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-10 md:p-16 text-center border border-emerald-500/20">
          <div className="relative">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-emerald-500/30">
              SPECIAL PROMOTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Eid Special Sale 🎉
            </h2>
            <p className="text-emerald-100/80 mb-8 text-lg">Use promo code <strong>EID2026</strong> for 20% discount on clothing & handicrafts</p>
            <Link href="/shop">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8">
                Shop the Sale
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Customer Testimonials</h2>
          <p className="text-gray-400">Trusted by thousands across all 64 districts in Bangladesh</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="glass p-6 rounded-xl border border-white/10">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

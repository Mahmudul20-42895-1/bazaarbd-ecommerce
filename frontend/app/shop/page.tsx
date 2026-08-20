"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "all";
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<string>("featured");
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
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  const filteredProducts = products.filter((product) => {
    const sel = (selectedCategory || "").toLowerCase().trim();
    const prodCat = (product.category || "").toLowerCase().trim();
    const prodCatId = (product.categoryId || "").toString().toLowerCase().trim();

    let matchesCategory = sel === "all" || prodCat === sel || prodCatId === sel;
    if (!matchesCategory) {
      if (sel.includes("home") && (prodCat.includes("home") || prodCatId === "6")) matchesCategory = true;
      else if (sel.includes("jewel") && (prodCat.includes("jewel") || prodCatId === "5")) matchesCategory = true;
      else if (sel.includes("leather") && (prodCat.includes("leather") || prodCat.includes("footwear") || prodCatId === "4")) matchesCategory = true;
      else if (sel.includes("decor") && (prodCat.includes("decor") || prodCat.includes("handicraft") || prodCatId === "3")) matchesCategory = true;
      else if (sel.includes("electr") && (prodCat.includes("electr") || prodCatId === "2")) matchesCategory = true;
      else if (sel.includes("cloth") && (prodCat.includes("cloth") || prodCat.includes("apparel") || prodCatId === "1")) matchesCategory = true;
    }

    const currentPrice = product.salePrice || product.price;
    const matchesPrice = currentPrice <= priceRange;
    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="glass p-6 rounded-xl space-y-6 border border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name || cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory.toLowerCase() === (cat.name || cat.slug).toLowerCase()
                        ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-white">Max Price</h3>
                <span className="text-emerald-400 font-bold text-sm">৳{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-sm">
              Showing <strong className="text-white">{filteredProducts.length}</strong> products
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-card border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="featured">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading catalog from database...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-xl border border-white/10">
              <p className="text-lg text-gray-300 font-semibold mb-2">No products found</p>
              <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or price slider</p>
              <Button onClick={() => { setSelectedCategory("all"); setPriceRange(25000); }} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

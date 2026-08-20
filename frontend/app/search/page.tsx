"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/Button"

function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get("q") || ""
  const [query, setQuery] = useState(initialQuery)

  const results = [
    { id: "1", name: "Wireless Earbuds", slug: "wireless-earbuds", description: "High quality wireless earbuds.", price: 4500, salePrice: 3800, images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"], rating: 4.5, reviewCount: 32, inStock: true, categoryId: "2", createdAt: new Date().toISOString() },
    { id: "2", name: "Smart Watch", slug: "smart-watch", description: "Feature-packed smartwatch.", price: 3200, images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"], rating: 4.8, reviewCount: 56, inStock: true, categoryId: "2", createdAt: new Date().toISOString() },
    { id: "3", name: "Premium Panjabi", slug: "premium-panjabi-emerald", description: "Premium panjabi", price: 3500, salePrice: 2800, images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400"], rating: 4.8, reviewCount: 124, inStock: true, categoryId: "1", createdAt: new Date().toISOString() },
  ]

  const filteredResults = query
    ? results.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : results

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-card border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
              placeholder="Search products, categories..."
            />
          </div>
          <Button type="submit" className="px-8">Search</Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-bg-card rounded-xl border border-white/10 p-6 sticky top-24">
            <div className="font-semibold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Price Range (৳)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-bg-primary border border-white/10 rounded text-sm text-white focus:outline-none focus:border-emerald-500" />
                  <span className="text-gray-500">-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-bg-primary border border-white/10 rounded text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
                <div className="space-y-2">
                  {["Electronics", "Clothing", "Handicrafts", "Jewelry", "Home"].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-emerald-500 w-4 h-4" />
                      <span className="text-sm text-gray-400">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="rating" className="accent-emerald-500 w-4 h-4" />
                      <span className="text-sm text-gray-400">{"★".repeat(rating)} & Up</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full mt-6" variant="outline">Apply Filters</Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6 text-gray-400 text-sm">
            {query ? `Found ${filteredResults.length} results for "${query}"` : `Showing ${filteredResults.length} products`}
          </div>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map(product => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-xl">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl text-gray-300 font-semibold mb-2">No products found</p>
              <p className="text-gray-400">Try a different keyword or browse our categories</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 flex-1 text-center text-gray-400">
        Loading search...
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}

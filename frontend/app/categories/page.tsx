"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const res = await api.get('/categories')
        if (res.data?.success) {
          setCategories(res.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
          EXPLORE COLLECTIONS
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Product Categories</h1>
        <p className="text-gray-400 text-sm">
          Browse through our curated departments crafted with authentic Bangladeshi heritage
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading categories from database...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.name || category.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden glass border border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <img
                src={category.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{category.count || 'Explore'} items in collection</p>
                </div>
                <span className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform shadow-glow">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

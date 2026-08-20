"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2, RefreshCw, Upload, Plus, Sparkles, Tag } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [currentInputUrl, setCurrentInputUrl] = useState("")
  const [categoriesList, setCategoriesList] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: "",
    name_bn: "",
    sku: "",
    basePrice: "",
    salePrice: "",
    category: "Home & Living",
    customCategory: "",
    brand: "",
    stock: "",
    description: "",
    images: [] as string[],
    status: "active"
  })

  const standardCategories = [
    "Home & Living",
    "Jewelry",
    "Leather & Footwear",
    "Handicrafts & Decor",
    "Electronics",
    "Clothing & Apparel"
  ]

  const brandSuggestions = [
    "Aarong", "Yellow", "Apex", "Walton", "Sailor", "Bata", "Samsung", "Sony", "Apple", "Otobi", "Hatil", "Regal", "Arong Earth", "Handmade"
  ]

  const presets = [
    { label: "Home Decor / Furniture", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600" },
    { label: "Jewelry / Gold Ornament", url: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600" },
    { label: "Leather Shoes / Wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600" },
    { label: "Handicrafts & Tapestry", url: "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?w=600" },
    { label: "Electronics & Audio", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600" },
    { label: "Silk Panjabi", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCategoriesList(res.data.data)
        }
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    fetchCategories()
  }, [])

  const allCategoryNames = Array.from(
    new Set([
      ...standardCategories,
      ...categoriesList.map(c => c.name).filter(Boolean)
    ])
  )

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setFetching(true)
        const id = Array.isArray(params?.id) ? params.id[0] : params?.id
        const res = await api.get(`/products/${id}`)
        if (res.data && res.data.data) {
          const p = res.data.data
          setFormData({
            name: p.name || "",
            name_bn: p.name_bn || "",
            sku: p.sku || "",
            basePrice: String(p.price || ""),
            salePrice: p.salePrice ? String(p.salePrice) : "",
            category: p.category || "Home & Living",
            customCategory: "",
            brand: p.brand || "BazaarBD Certified",
            stock: String(p.stock ?? 0),
            description: p.description || "",
            images: p.images || [],
            status: p.status || "active"
          })
        }
      } catch (err) {
        console.error("Failed to load product for editing:", err)
      } finally {
        setFetching(false)
      }
    }
    if (params?.id) {
      loadProduct()
    }
  }, [params?.id])

  const handleAddImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || currentInputUrl).trim()
    if (!url) return
    if (!formData.images.includes(url)) {
      setFormData({ ...formData, images: [...formData.images, url] })
    }
    if (!urlToAdd) setCurrentInputUrl("")
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, idx) => idx !== indexToRemove)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const data = new FormData()
    data.append('image', file)
    try {
      const res = await api.post('/admin/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data && res.data.url) {
        setFormData({ ...formData, images: [...formData.images, res.data.url] })
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, images: [...formData.images, event.target.result as string] })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      const finalCategory = formData.category === "custom" 
        ? (formData.customCategory.trim() || "General") 
        : formData.category

      const finalImages = formData.images.length > 0 ? formData.images : (currentInputUrl ? [currentInputUrl] : ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600"])

      const payload = {
        name: formData.name,
        name_bn: formData.name_bn,
        sku: formData.sku,
        price: Number(formData.basePrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        category: finalCategory,
        brand: formData.brand.trim() || "BazaarBD Certified",
        stock: Number(formData.stock),
        description: formData.description,
        images: finalImages,
        status: formData.status
      }
      const res = await api.put(`/admin/products/${id}`, payload)
      if (res.data && res.data.success) {
        alert(`Product "${formData.name}" updated successfully!`)
        router.push("/products")
      }
    } catch (err) {
      alert("Error updating product.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product from the database?")) return
    try {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      await api.delete(`/admin/products/${id}`)
      router.push("/products")
    } catch (err) {
      alert("Error deleting product.")
    }
  }

  if (fetching) {
    return (
      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <p>Loading product details from database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product & Details</h1>
            <p className="text-sm text-muted-foreground">Editing SKU: {formData.sku}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete Product
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product title, bilingual names, category, and brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name (English) *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_bn">Product Name (বাংলা)</Label>
                <Input 
                  id="name_bn" 
                  value={formData.name_bn}
                  onChange={e => setFormData({ ...formData, name_bn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU Code *</Label>
                <Input 
                  id="sku" 
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  required 
                />
              </div>

              {/* Dynamic Category Selector */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={allCategoryNames.includes(formData.category) ? formData.category : "custom"} 
                  onValueChange={v => {
                    if (v === "custom") {
                      setFormData({ ...formData, category: "custom", customCategory: formData.category })
                    } else {
                      setFormData({ ...formData, category: v, customCategory: "" })
                    }
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategoryNames.map((catName) => (
                      <SelectItem key={catName} value={catName}>
                        {catName}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">+ Other / Custom Category</SelectItem>
                  </SelectContent>
                </Select>
                {formData.category === "custom" && (
                  <Input 
                    placeholder="Enter custom category name"
                    value={formData.customCategory}
                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* Free-form Brand Name Input */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand Name (Type Any Brand) *</Label>
                <Input 
                  id="brand" 
                  placeholder="e.g. Aarong, Walton, Apex, or custom brand" 
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Brand suggestions chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" /> Quick Brand Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {brandSuggestions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, brand: b })}
                    className={`text-[11px] border px-2 py-0.5 rounded-md transition-colors ${
                      formData.brand === b ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="status">Listing Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active / Visible</SelectItem>
                    <SelectItem value="draft">Draft / Hidden</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea 
                id="description" 
                rows={4} 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Configure pricing in Bangladeshi Taka (৳) and stock limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Regular Price (৳) *</Label>
                <Input 
                  id="basePrice" 
                  type="number" 
                  value={formData.basePrice}
                  onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale / Special Price (৳)</Label>
                <Input 
                  id="salePrice" 
                  type="number" 
                  value={formData.salePrice}
                  onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock Quantity *</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Image URLs Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images & Photo URLs</CardTitle>
            <CardDescription>Change, add, or replace image URLs for this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-image-url">Add New Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="edit-image-url"
                  placeholder="Paste direct image link (e.g. https://images.unsplash.com/... or CDN link)" 
                  value={currentInputUrl}
                  onChange={e => setCurrentInputUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddImageUrl()
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddImageUrl()} className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> Add URL
                </Button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Quick Sample Photos:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddImageUrl(p.url)}
                    className="text-xs border px-2.5 py-1 rounded-md hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                  >
                    <span>+ {p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Box */}
            <div className="relative border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/30 cursor-pointer transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-xs">Or click to select an image from your computer</p>
              <p className="text-[10px] text-muted-foreground mt-1">Supports PNG, JPG, WebP</p>
            </div>

            {/* Current Product Photos Gallery */}
            {formData.images.length > 0 ? (
              <div className="space-y-2 pt-2 border-t">
                <Label>Current Product Photos ({formData.images.length})</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                      <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-500 font-medium">No images attached. Add an image URL above.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
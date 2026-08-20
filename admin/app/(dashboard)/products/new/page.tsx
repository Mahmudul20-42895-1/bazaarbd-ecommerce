"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Plus, Trash2, Sparkles, Tag } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentInputUrl, setCurrentInputUrl] = useState("")
  const [images, setImages] = useState<string[]>([])
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
    stock: "50",
    description: "",
    status: "active"
  })

  // Standard predefined categories
  const standardCategories = [
    "Home & Living",
    "Jewelry",
    "Leather & Footwear",
    "Handicrafts & Decor",
    "Electronics",
    "Clothing & Apparel"
  ]

  // Suggested popular brands
  const brandSuggestions = [
    "Aarong", "Yellow", "Apex", "Walton", "Sailor", "Bata", "Samsung", "Sony", "Apple", "Otobi", "Hatil", "Regal", "Arong Earth", "Handmade"
  ]

  // Sample photo presets for quick testing
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

  // Combine fetched categories with standard ones to ensure none are missing
  const allCategoryNames = Array.from(
    new Set([
      ...standardCategories,
      ...categoriesList.map(c => c.name).filter(Boolean)
    ])
  )

  const handleAddImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || currentInputUrl).trim()
    if (!url) return
    if (!images.includes(url)) {
      setImages([...images, url])
    }
    if (!urlToAdd) setCurrentInputUrl("")
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove))
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
        setImages([...images, res.data.url])
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages([...images, event.target.result as string])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const finalCategory = formData.category === "custom" 
        ? (formData.customCategory.trim() || "General") 
        : formData.category

      const finalImages = images.length > 0 ? images : (currentInputUrl ? [currentInputUrl] : ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600"])
      
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
      const res = await api.post('/admin/products', payload)
      if (res.data && res.data.success) {
        alert(`Product "${formData.name}" saved under category "${finalCategory}" successfully!`)
        router.push("/products")
      }
    } catch (err) {
      console.error("Failed to create product:", err)
      alert("Error saving product to database.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Product</h1>
          <p className="text-sm text-muted-foreground">Add a new item to your e-commerce catalog database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product title, bilingual names, and identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name (English) *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Modern Wooden Table Lamp" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_bn">Product Name (বাংলা)</Label>
                <Input 
                  id="name_bn" 
                  placeholder="যেমন: আধুনিক কাঠের টেবিল ল্যাম্প" 
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
                  placeholder="e.g. BZ-HML-001" 
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  required 
                />
              </div>

              {/* Dynamic Category Selector */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={v => setFormData({ ...formData, category: v })}
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
                  placeholder="e.g. Aarong, Walton, Otobi, or custom brand" 
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

            <div className="space-y-2 pt-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea 
                id="description" 
                rows={4} 
                placeholder="Detailed information about materials, dimensions, origin, and warranty..." 
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
                  placeholder="3500" 
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
                  placeholder="2800" 
                  value={formData.salePrice}
                  onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock Quantity *</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  placeholder="50" 
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Image URLs & Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images & Photo URLs</CardTitle>
            <CardDescription>Add web image URLs or upload photos directly for the product gallery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="image-url"
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

            {/* Added Images Gallery */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <Label>Added Product Photos ({images.length})</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, index) => (
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
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving to Database..." : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
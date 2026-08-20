"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, RefreshCw, Image as ImageIcon, Sparkles, Filter } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Quick image edit modal state
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [savingImage, setSavingImage] = useState(false)

  const standardCategories = [
    "All Categories",
    "Home & Living",
    "Jewelry",
    "Leather & Footwear",
    "Handicrafts & Decor",
    "Electronics",
    "Clothing & Apparel"
  ]

  const presets = [
    { label: "Home Decor / Furniture", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600" },
    { label: "Jewelry / Gold Ornament", url: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600" },
    { label: "Leather Shoes / Wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600" },
    { label: "Handicrafts & Tapestry", url: "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?w=600" },
    { label: "Electronics & Audio", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600" },
    { label: "Silk Panjabi", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
  ]

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products')
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setProducts(res.data.data)
      }
    } catch (err) {
      console.error("Failed to load products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This change will immediately remove it from the database and user storefront.`)) return
    try {
      await api.delete(`/admin/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert("Failed to delete product")
    }
  }

  const openImageModal = (product: any) => {
    setSelectedProduct(product)
    setNewImageUrl(product.images && product.images[0] ? product.images[0] : "")
    setImageModalOpen(true)
  }

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !newImageUrl.trim()) return
    setSavingImage(true)
    try {
      const res = await api.put(`/admin/products/${selectedProduct.id}`, {
        images: [newImageUrl.trim()]
      })
      if (res.data && res.data.success) {
        setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, images: [newImageUrl.trim()] } : p))
        setImageModalOpen(false)
        alert("Image URL updated in database successfully!")
      }
    } catch (err) {
      alert("Failed to update image URL")
    } finally {
      setSavingImage(false)
    }
  }

  // Filter products by search and category
  const filteredProducts = products.filter(product => {
    const s = search.toLowerCase().trim()
    const matchesSearch = !s ||
      (product.name && product.name.toLowerCase().includes(s)) ||
      (product.name_bn && product.name_bn.toLowerCase().includes(s)) ||
      (product.sku && product.sku.toLowerCase().includes(s)) ||
      (product.category && product.category.toLowerCase().includes(s)) ||
      (product.brand && product.brand.toLowerCase().includes(s)) ||
      (product.description && product.description.toLowerCase().includes(s))

    const pCat = (product.category || "").toLowerCase().trim()
    const pCatId = (product.categoryId || "").toString().toLowerCase().trim()
    const sel = selectedCategory.toLowerCase().trim()

    let matchesCategory = sel === "all" || sel === "all categories" || pCat === sel || pCatId === sel
    if (!matchesCategory) {
      if (sel.includes("home") && (pCat.includes("home") || pCatId === "6")) matchesCategory = true
      else if (sel.includes("jewel") && (pCat.includes("jewel") || pCatId === "5")) matchesCategory = true
      else if (sel.includes("leather") && (pCat.includes("leather") || pCat.includes("footwear") || pCatId === "4")) matchesCategory = true
      else if (sel.includes("decor") && (pCat.includes("decor") || pCat.includes("handicraft") || pCatId === "3")) matchesCategory = true
      else if (sel.includes("electr") && (pCat.includes("electr") || pCatId === "2")) matchesCategory = true
      else if (sel.includes("cloth") && (pCat.includes("cloth") || pCat.includes("apparel") || pCatId === "1")) matchesCategory = true
    }

    return matchesSearch && matchesCategory
  })

  const getCategoryBadgeClass = (categoryName: string) => {
    const cat = (categoryName || "").toLowerCase()
    if (cat.includes("home")) return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    if (cat.includes("jewel")) return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    if (cat.includes("leather")) return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    if (cat.includes("decor") || cat.includes("handicraft")) return "bg-teal-500/20 text-teal-400 border-teal-500/30"
    if (cat.includes("electr")) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage product listings, pricing, brand, and inventory in real time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadProducts} className="flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Link href="/products/new">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, SKU, brand, category..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter Select */}
        <div className="w-full sm:w-56">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {standardCategories.map((cat) => (
                <SelectItem key={cat} value={cat === "All Categories" ? "all" : cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground flex items-center self-center sm:ml-auto">
          Showing <strong className="text-foreground mx-1">{filteredProducts.length}</strong> of {products.length} products
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price (BDT)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  Loading database records...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  <div className="space-y-2">
                    <p className="text-sm">No products found matching your filter criteria.</p>
                    <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("all"); }}>
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div 
                      onClick={() => openImageModal(product)}
                      className="relative group h-12 w-12 rounded-lg overflow-hidden border cursor-pointer hover:border-primary transition-all"
                      title="Click to change image URL"
                    >
                      <img
                        src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/60"}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{product.name}</div>
                    {product.name_bn && (
                      <div className="text-xs text-muted-foreground">{product.name_bn}</div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.sku || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-medium ${getCategoryBadgeClass(product.category)}`}>
                      {product.category || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-xs text-foreground">
                      {product.brand || "BazaarBD"}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {product.salePrice ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳{product.salePrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span>৳{product.price.toLocaleString()}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-amber-500 font-bold text-xs" : "font-medium text-xs"}>
                      {product.stock} units
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        onClick={() => openImageModal(product)}
                        title="Change Photo URL"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Full Edit">
                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(product.id, product.name)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quick Image URL Change Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveImage}>
            <DialogHeader>
              <DialogTitle>Change Product Image URL</DialogTitle>
              <DialogDescription>
                Update the photo for <strong className="text-foreground">{selectedProduct?.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quick-image-url">Image URL</Label>
                <Input
                  id="quick-image-url"
                  placeholder="https://images.unsplash.com/... or any direct photo link"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
                />
              </div>

              {/* Sample Presets */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Sample photos you can click:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewImageUrl(p.url)}
                      className="text-xs border px-2 py-0.5 rounded hover:bg-muted transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              {newImageUrl && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Live Preview</Label>
                  <div className="h-36 w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    <img 
                      src={newImageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setImageModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingImage}>
                {savingImage ? "Saving..." : "Update Image URL"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
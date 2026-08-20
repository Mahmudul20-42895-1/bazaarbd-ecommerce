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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react"
import api from "@/lib/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCat, setNewCat] = useState({ name: "", slug: "", image: "" })

  // Edit category modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editCat, setEditCat] = useState<{ id: string; name: string; slug: string; image: string }>({ id: "", name: "", slug: "", image: "" })
  const [savingEdit, setSavingEdit] = useState(false)

  const sampleImages = [
    { label: "Home & Living", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500" },
    { label: "Jewelry", url: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500" },
    { label: "Leather & Footwear", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500" },
    { label: "Handicrafts & Decor", url: "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?w=500" },
    { label: "Electronics", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500" },
    { label: "Clothing & Apparel", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500" },
  ]

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/categories')
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setCategories(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.name) return
    try {
      const res = await api.post('/admin/categories', {
        name: newCat.name.trim(),
        slug: newCat.slug.trim() || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: newCat.image.trim() || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500"
      })
      if (res.data && res.data.success) {
        setCategories([...categories, res.data.data])
        setNewCat({ name: "", slug: "", image: "" })
        setIsAddOpen(false)
        alert(`Category "${res.data.data.name}" added successfully!`)
      }
    } catch (err) {
      alert("Error adding category to database.")
    }
  }

  const openEditDialog = (cat: any) => {
    setEditCat({
      id: cat.id,
      name: cat.name || "",
      slug: cat.slug || "",
      image: cat.image || ""
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCat.name || !editCat.id) return
    setSavingEdit(true)
    try {
      const res = await api.put(`/admin/categories/${editCat.id}`, {
        name: editCat.name.trim(),
        slug: editCat.slug.trim() || editCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: editCat.image.trim()
      })
      if (res.data && res.data.success) {
        setCategories(categories.map(c => c.id === editCat.id ? { ...c, ...res.data.data } : c))
        setIsEditOpen(false)
        alert(`Category updated to "${res.data.data.name}" successfully!`)
      }
    } catch (err) {
      alert("Error updating category.")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return
    try {
      await api.delete(`/admin/categories/${id}`)
      setCategories(categories.filter(c => c.id !== id))
    } catch (err) {
      alert("Error deleting category.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-sm text-muted-foreground">Manage e-commerce product categories, taxonomy, and cover photos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCategories}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a category to organize products</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Category Name *</Label>
                    <Input 
                      id="cat-name" 
                      placeholder="e.g. Home & Living, Jewelry, Leather..." 
                      value={newCat.name} 
                      onChange={e => setNewCat({ ...newCat, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-slug">Slug Code</Label>
                    <Input 
                      id="cat-slug" 
                      placeholder="e.g. home, jewelry, leather" 
                      value={newCat.slug} 
                      onChange={e => setNewCat({ ...newCat, slug: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-image">Cover Image URL</Label>
                    <Input 
                      id="cat-image" 
                      placeholder="https://..." 
                      value={newCat.image} 
                      onChange={e => setNewCat({ ...newCat, image: e.target.value })} 
                    />
                  </div>
                  {/* Sample image presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Sample Cover Photos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewCat({ ...newCat, image: s.url })}
                          className="text-xs border px-2 py-0.5 rounded hover:bg-muted"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Category</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Live Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Loading categories...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No categories found in database.</TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={c.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500"}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">{c.count || 0} items</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        onClick={() => openEditDialog(c)}
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete Category"
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

      {/* Edit Category Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleSaveEdit}>
            <DialogHeader>
              <DialogTitle>Edit Category Details</DialogTitle>
              <DialogDescription>Update category name, slug, or cover image</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name">Category Name *</Label>
                <Input 
                  id="edit-cat-name" 
                  value={editCat.name} 
                  onChange={e => setEditCat({ ...editCat, name: e.target.value })} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-slug">Slug Code</Label>
                <Input 
                  id="edit-cat-slug" 
                  value={editCat.slug} 
                  onChange={e => setEditCat({ ...editCat, slug: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-image">Cover Image URL</Label>
                <Input 
                  id="edit-cat-image" 
                  value={editCat.image} 
                  onChange={e => setEditCat({ ...editCat, image: e.target.value })} 
                />
              </div>

              {/* Live Preview */}
              {editCat.image && (
                <div className="space-y-1">
                  <Label className="text-xs">Image Preview</Label>
                  <div className="h-28 w-full rounded-lg overflow-hidden border bg-muted">
                    <img src={editCat.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
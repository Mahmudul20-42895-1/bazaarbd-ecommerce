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
import { Plus, Trash2, ExternalLink, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newBrand, setNewBrand] = useState({ name: "", slug: "", website: "" })

  const loadBrands = async () => {
    try {
      setLoading(true)
      const res = await api.get('/brands')
      if (res.data && res.data.success) {
        setBrands(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBrand.name) return
    try {
      const res = await api.post('/admin/brands', newBrand)
      if (res.data && res.data.success) {
        setBrands([...brands, res.data.data])
        setNewBrand({ name: "", slug: "", website: "" })
        setIsAddOpen(false)
      }
    } catch (err) {
      alert("Error adding brand to database.")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return
    setBrands(brands.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brands Directory</h1>
          <p className="text-sm text-muted-foreground">Manage partner brands, verified manufacturers, and official stores</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadBrands}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>Add Partner Brand</DialogTitle>
                  <DialogDescription>Add a certified brand to the marketplace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-name">Brand Name</Label>
                    <Input 
                      id="b-name" 
                      placeholder="e.g. Yellow, Apex" 
                      value={newBrand.name} 
                      onChange={e => setNewBrand({ ...newBrand, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-slug">Slug</Label>
                    <Input 
                      id="b-slug" 
                      placeholder="e.g. yellow" 
                      value={newBrand.slug} 
                      onChange={e => setNewBrand({ ...newBrand, slug: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-web">Official Website</Label>
                    <Input 
                      id="b-web" 
                      placeholder="https://brand.com" 
                      value={newBrand.website} 
                      onChange={e => setNewBrand({ ...newBrand, website: e.target.value })} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Brand</Button>
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
              <TableHead>Brand Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Official Website</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Loading brands...</TableCell>
              </TableRow>
            ) : brands.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-semibold">{b.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{b.slug}</TableCell>
                <TableCell className="text-xs">
                  {b.website ? (
                    <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                      {b.website.replace('https://', '')} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{b.productsCount || 0} items</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="success">{b.status || 'Active'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(b.id, b.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
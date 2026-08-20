"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", image: "", link: "/shop" })

  const loadBanners = async () => {
    try {
      setLoading(true)
      const res = await api.get('/banners')
      if (res.data && res.data.success) {
        setBanners(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBanner.title || !newBanner.image) return
    try {
      const res = await api.post('/admin/banners', newBanner)
      if (res.data && res.data.success) {
        setBanners([...banners, res.data.data])
        setNewBanner({ title: "", subtitle: "", image: "", link: "/shop" })
        setIsAddOpen(false)
      }
    } catch (err) {
      alert("Error adding banner to database.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return
    setBanners(banners.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotional Banners</h1>
          <p className="text-sm text-muted-foreground">Manage homepage hero carousels and promotional graphics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadBanners}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>Add Promotional Banner</DialogTitle>
                  <DialogDescription>New hero graphic for the customer homepage</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-title">Banner Title</Label>
                    <Input 
                      id="b-title" 
                      placeholder="e.g. Eid Mega Sale" 
                      value={newBanner.title} 
                      onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-sub">Subtitle</Label>
                    <Input 
                      id="b-sub" 
                      placeholder="e.g. Up to 40% discount on clothing" 
                      value={newBanner.subtitle} 
                      onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-img">Image URL</Label>
                    <Input 
                      id="b-img" 
                      placeholder="https://images.unsplash.com/..." 
                      value={newBanner.image} 
                      onChange={e => setNewBanner({ ...newBanner, image: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-link">Target Link</Label>
                    <Input 
                      id="b-link" 
                      placeholder="/shop?sale=1" 
                      value={newBanner.link} 
                      onChange={e => setNewBanner({ ...newBanner, link: e.target.value })} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Banner</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <p className="text-muted-foreground col-span-2 text-center py-10">Loading banners...</p>
        ) : banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="aspect-[21/9] relative bg-muted">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <Badge variant="success">Live on Homepage</Badge>
              </div>
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">{banner.title}</h3>
                <p className="text-xs text-muted-foreground">{banner.subtitle || banner.link}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(banner.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
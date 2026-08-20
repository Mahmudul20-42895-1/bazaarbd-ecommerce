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
import { AlertTriangle, Plus, RefreshCw, Check } from "lucide-react"
import api from "@/lib/api"

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [restockAmounts, setRestockAmounts] = useState<{ [id: string]: number }>({})

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products')
      if (res.data && res.data.success) {
        setProducts(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleRestock = async (id: string) => {
    const amount = restockAmounts[id] || 20
    try {
      const res = await api.patch(`/admin/products/${id}/restock`, { stock: amount })
      if (res.data && res.data.success) {
        alert(`Successfully added +${amount} units to inventory!`)
        loadProducts()
      }
    } catch (err) {
      alert("Error updating inventory.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory & Stock Alerts</h1>
          <p className="text-sm text-muted-foreground">Monitor stock levels and restock items directly to database</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadProducts} className="flex items-center gap-1">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quick Restock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Loading database inventory...</TableCell>
              </TableRow>
            ) : products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold">{p.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                <TableCell className="text-xs">{p.category}</TableCell>
                <TableCell>
                  <span className={`font-bold ${p.stock < 10 ? 'text-amber-500 flex items-center gap-1' : 'text-foreground'}`}>
                    {p.stock < 10 && <AlertTriangle className="h-3.5 w-3.5" />}
                    {p.stock} units
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.stock > 10 ? "success" : (p.stock > 0 ? "warning" : "destructive")}>
                    {p.stock > 10 ? "Healthy" : (p.stock > 0 ? "Low Stock" : "Out of Stock")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Input 
                      type="number" 
                      className="w-20 h-8 text-xs text-center" 
                      defaultValue={20}
                      onChange={e => setRestockAmounts({ ...restockAmounts, [p.id]: Number(e.target.value) })}
                    />
                    <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => handleRestock(p.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
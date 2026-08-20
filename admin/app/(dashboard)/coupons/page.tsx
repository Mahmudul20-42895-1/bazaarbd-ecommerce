"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Plus, Trash2, RefreshCw, Ticket } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/coupons')
      if (res.data && res.data.success) {
        setCoupons(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    try {
      await api.delete(`/admin/coupons/${id}`)
      setCoupons(coupons.filter(c => c.id !== id))
    } catch (err) {
      alert("Error deleting coupon.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes and promotional campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCoupons}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Link href="/coupons/new">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Create Coupon
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promo Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-bold text-primary flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> {c.code}
                </TableCell>
                <TableCell className="font-semibold">
                  {c.value}{c.type === 'percentage' ? '%' : '৳'} OFF
                </TableCell>
                <TableCell className="text-xs">৳{c.minOrderAmount || 0}</TableCell>
                <TableCell className="text-xs">{c.usedCount || 0} / {c.usageLimit || '∞'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.expiresAt || 'No expiry'}</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(c.id, c.code)}
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
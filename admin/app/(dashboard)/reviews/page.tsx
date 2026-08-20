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
import { Star, Check, X, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadReviews = async () => {
    try {
      setLoading(true)
      const res = await api.get('/reviews')
      if (res.data && res.data.success) {
        setReviews(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await api.patch(`/admin/reviews/${id}/status`, { status })
      if (res.data && res.data.success) {
        setReviews(reviews.map(r => r.id === id ? res.data.data : r))
      }
    } catch (err) {
      alert("Error updating review moderation.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Reviews Moderation</h1>
          <p className="text-sm text-muted-foreground">Approve or reject verified customer product reviews</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadReviews}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Moderation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Loading reviews...</TableCell>
              </TableRow>
            ) : reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-semibold text-xs">{r.productName || "Product"}</TableCell>
                <TableCell className="text-xs">{r.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center text-amber-500 text-xs">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="ml-1 font-bold">{r.rating}.0</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-sm">
                  "{r.text}"
                </TableCell>
                <TableCell>
                  <Badge variant={r.status === 'approved' ? 'success' : (r.status === 'rejected' ? 'destructive' : 'warning')}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-xs text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => updateStatus(r.id, "approved")}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => updateStatus(r.id, "rejected")}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
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
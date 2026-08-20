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
import { Search, Eye, RefreshCw, Ban, CheckCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/customers')
      if (res.data && res.data.success) {
        setCustomers(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const toggleStatus = async (id: string) => {
    try {
      const res = await api.patch(`/admin/customers/${id}/status`, {})
      if (res.data && res.data.success) {
        setCustomers(customers.map(c => c.id === id ? res.data.data : c))
      }
    } catch (err) {
      alert("Error updating customer status")
    }
  }

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registered Customers</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and customer lifetime statistics</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadCustomers}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, phone, email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Lifetime Spend</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Loading customers...</TableCell>
              </TableRow>
            ) : filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </TableCell>
                <TableCell className="font-mono text-xs">{c.phone}</TableCell>
                <TableCell>{c.totalOrders || 0} orders</TableCell>
                <TableCell className="font-bold text-primary">৳{(c.totalSpent || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'active' ? 'success' : 'destructive'}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleStatus(c.id)}
                      className={c.status === 'active' ? "text-destructive hover:bg-destructive/10 text-xs" : "text-emerald-500 text-xs"}
                    >
                      {c.status === 'active' ? "Suspend" : "Activate"}
                    </Button>
                    <Link href={`/customers/${c.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
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
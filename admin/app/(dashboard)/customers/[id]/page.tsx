"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, User, Phone, Mail, MapPin, Ban, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      const res = await api.get(`/admin/customers/${id}`)
      if (res.data && res.data.data) {
        setCustomer(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params?.id) loadCustomer()
  }, [params?.id])

  const toggleStatus = async () => {
    try {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      const res = await api.patch(`/admin/customers/${id}/status`, {})
      if (res.data && res.data.success) {
        setCustomer({ ...customer, status: res.data.data.status })
      }
    } catch (err) {
      alert("Error updating status")
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <p>Loading customer profile from database...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold mb-4">Customer not found.</p>
        <Link href="/customers"><Button>Back to Customers</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">Customer Profile ID: #{customer.id}</p>
          </div>
        </div>
        <Button 
          variant={customer.status === "active" ? "destructive" : "default"} 
          size="sm"
          onClick={toggleStatus}
        >
          {customer.status === "active" ? (
            <>
              <Ban className="h-4 w-4 mr-1" /> Suspend Customer
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-1" /> Activate Customer
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {customer.name?.charAt(0) || "U"}
              </div>
              <div>
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <div className="mt-1">
                  <Badge variant={customer.status === "active" ? "success" : "destructive"}>
                    {customer.status === "active" ? "Active Member" : "Suspended"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="pt-4 border-t text-xs text-muted-foreground">
              Joined on {customer.joinedDate || "N/A"}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">৳{(customer.totalSpent || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime Value (BDT)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{customer.orders?.length || customer.totalOrders || 0} Orders</div>
                <p className="text-xs text-muted-foreground mt-1">All-time Orders Placed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Recent purchases made by this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total (৳)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No orders recorded yet.</TableCell>
                    </TableRow>
                  ) : (
                    customer.orders?.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-semibold">
                          <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                            {order.orderNumber || order.id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">{order.items?.length || 1} items</TableCell>
                        <TableCell className="font-bold text-xs">৳{order.total?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="success">{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
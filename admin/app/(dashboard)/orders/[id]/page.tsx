"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ArrowLeft, User, Phone, MapPin, CheckCircle, Clock, Truck, Save, RefreshCw } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")

  const loadOrder = async () => {
    try {
      setLoading(true)
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      const res = await api.get(`/orders/${id}`)
      if (res.data && res.data.data) {
        setOrder(res.data.data)
        setStatus(res.data.data.status)
      }
    } catch (err) {
      console.error("Failed to load order:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params?.id) {
      loadOrder()
    }
  }, [params?.id])

  const handleUpdateStatus = async () => {
    try {
      setSaving(true)
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id
      const res = await api.patch(`/admin/orders/${id}/status`, { status })
      if (res.data && res.data.success) {
        alert("Order status updated in database successfully!")
        loadOrder()
      }
    } catch (err) {
      alert("Failed to update order status")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <p>Loading order details from database...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold mb-4">Order not found.</p>
        <Link href="/orders"><Button>Back to Orders</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
              <Badge variant={order.status === 'delivered' ? 'success' : 'default'} className="capitalize">
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateStatus} disabled={saving || status === order.status} size="sm">
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Update"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" className="h-10 w-10 rounded object-cover border" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>৳{item.price?.toLocaleString()}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right font-bold">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Charge</span>
                  <span>৳{order.shippingCharge?.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span>Discount</span>
                    <span>-৳{order.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">৳{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.customerPhone || order.shippingAddress?.phone || "N/A"}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  {order.shippingAddress?.address || "Delivery Address"}, {order.shippingAddress?.upazila || ""}, {order.shippingAddress?.district || order.shippingAddress?.division || "Bangladesh"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway:</span>
                <span className="font-semibold uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
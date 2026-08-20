"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, ExternalLink, RefreshCw, Package } from "lucide-react"
import api from "@/lib/api"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setLoading(true)
      let email = "rahim@gmail.com"
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const u = JSON.parse(stored)
          if (u.email) email = u.email
        }
      } catch (e) {}

      const res = await api.get(`/orders?email=${encodeURIComponent(email)}`)
      if (res.data?.success && Array.isArray(res.data.data)) {
        setOrders(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const getStatusVariant = (status: string) => {
    switch(status?.toLowerCase()) {
      case "delivered": return "success"
      case "processing": return "info"
      case "shipped": return "info"
      case "pending": return "warning"
      case "cancelled": return "danger"
      default: return "default"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-gray-400 hover:text-emerald-500 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">My Order History</h1>
            <p className="text-xs text-gray-400 mt-0.5">View and track all your previous purchases</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders} className="flex items-center gap-1">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">Loading order records from database...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders found for this account.</p>
                    <Link href="/shop" className="mt-3 inline-block">
                      <Button size="sm">Start Shopping</Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{order.orderNumber || order.id}</td>
                    <td className="p-4 text-gray-400">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-300">{order.items?.length || 1} item(s)</td>
                    <td className="p-4 uppercase text-gray-300 font-semibold">{order.paymentMethod || 'COD'}</td>
                    <td className="p-4 text-emerald-400 font-bold text-sm">৳{order.total?.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(order.status) as any}>
                        {(order.status || 'pending').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/orders/track?order=${order.orderNumber || order.id}`}>
                        <Button variant="outline" size="sm" className="inline-flex items-center gap-1 h-8 text-xs font-semibold">
                          Track Shipment <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

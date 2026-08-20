"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  AlertCircle, 
  CreditCard, 
  Phone, 
  Receipt,
  RotateCcw,
  Sparkles,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialOrder = searchParams?.get("order") || ""
  const [query, setQuery] = useState(initialOrder)
  const [order, setOrder] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch recent orders for 1-click tracking
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/orders/recent')
        if (res.data?.success && Array.isArray(res.data.data)) {
          setRecentOrders(res.data.data)
          // If no initialOrder in URL, auto-load the most recent order so user sees active tracking
          if (!initialOrder && res.data.data.length > 0) {
            setOrder(res.data.data[0])
            setQuery(res.data.data[0].orderNumber)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchRecent()
  }, [initialOrder])

  const handleTrack = async (searchVal?: string) => {
    const q = (searchVal !== undefined ? searchVal : query).trim()
    if (!q) return
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(q)}`)
      if (res.data?.success && res.data.data) {
        setOrder(res.data.data)
        setQuery(res.data.data.orderNumber)
      } else {
        setError(`No order found matching "${q}". Please check your order ID or phone number.`)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Unable to find order matching "${q}".`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrder) {
      handleTrack(initialOrder)
    }
  }, [initialOrder])

  return (
    <div className="container mx-auto px-4 py-12 flex-1 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-500/20 mb-3">
          BANGLADESH PARCEL & SHIPMENT TRACKER
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Live Order Procedure & Tracking</h1>
        <p className="text-gray-400 text-xs md:text-sm">
          Track your package across all 64 districts in real time with Steadfast & Pathao courier updates
        </p>
      </div>

      {/* Search Box */}
      <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 mb-8 shadow-2xl">
        <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              required
              placeholder="Search by Order #, Phone, Email, or Name (e.g. ORD-... or 01711...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-bg-primary border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
            />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="h-12 px-8 font-bold shadow-glow">
            {loading ? "Searching..." : "Track Order"}
          </Button>
        </form>

        {/* 1-Click Recent Order Chips */}
        {recentOrders.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quick 1-Click Track Recent Orders:
            </span>
            <div className="flex flex-wrap gap-2">
              {recentOrders.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setQuery(r.orderNumber); handleTrack(r.orderNumber); }}
                  className={`text-xs border px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    order?.orderNumber === r.orderNumber 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 font-semibold" 
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-mono">{r.orderNumber}</span>
                  <span className="text-[10px] text-gray-400">({r.customerName})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Main Order Details & Procedure Card */}
      {order && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 space-y-8 shadow-2xl">
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">Tracking Identifier</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-mono mt-0.5">{order.orderNumber}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1.5">
                  <span>Customer: <strong className="text-white">{order.customerName}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong className="text-white">{order.customerPhone}</strong></span>
                  <span>•</span>
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  order.status === 'processing' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  Fulfillment: {order.status}
                </span>
                <p className="text-xs text-gray-400 mt-1.5">
                  Payment: <strong className="text-emerald-400 uppercase">{order.paymentMethod} ({order.paymentStatus})</strong>
                </p>
              </div>
            </div>

            {/* Stepper Timeline Procedure */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" /> Real-Time Delivery Procedure
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">Courier: Steadfast Express</span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                {order.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      step.done 
                        ? 'bg-emerald-500 text-white shadow-glow ring-4 ring-emerald-500/20' 
                        : 'bg-bg-card border border-white/20 text-gray-500'
                    }`}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs md:text-sm font-bold ${step.done ? 'text-white' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${step.done ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-gray-500'}`}>
                          {step.done ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Payment Breakdown */}
            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" /> Delivery Address
                </h4>
                <div className="text-xs text-gray-300 space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="font-semibold text-white">{order.shippingAddress?.name || order.customerName}</p>
                  <p>{order.shippingAddress?.address || "Street address"}</p>
                  <p>{order.shippingAddress?.upazila}, {order.shippingAddress?.district}, {order.shippingAddress?.division}</p>
                  <p className="text-emerald-400 font-medium">Contact: {order.shippingAddress?.phone || order.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-emerald-400" /> Payment Receipt Summary
                </h4>
                <div className="text-xs text-gray-300 space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <strong className="text-white uppercase">{order.paymentMethod}</strong>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <strong className="text-emerald-400 font-mono">{order.transactionId}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <strong className="text-white uppercase">{order.paymentStatus}</strong>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                    <span>Total Paid:</span>
                    <span className="text-emerald-400">৳{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Contents */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-400" /> Parcel Contents ({order.items?.length || 1} items)
              </h4>
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100"} alt="" className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="outline" size="sm">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="outline" size="sm">
                  My Orders History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-gray-400">Loading live tracking procedure...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}

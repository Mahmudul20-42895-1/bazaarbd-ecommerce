"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { User, Package, MapPin, Heart, LogOut, Save, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react"
import api from "@/lib/api"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])

  const [user, setUser] = useState({
    name: "Rahim Uddin",
    email: "rahim@gmail.com",
    phone: "01711223344",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Gulshan",
    address: "House 42, Road 11, Block D, Banani"
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        setUser(prev => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          division: u.division || prev.division,
          district: u.district || prev.district,
          upazila: u.upazila || prev.upazila,
          address: u.address || prev.address
        }))
        fetchUserOrders(u.email)
      } else {
        fetchUserOrders('rahim@gmail.com')
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const fetchUserOrders = async (email: string) => {
    try {
      const res = await api.get(`/orders?email=${encodeURIComponent(email)}`)
      if (res.data?.success && Array.isArray(res.data.data)) {
        setOrders(res.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', user)
      if (res.data?.success) {
        localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }))
        alert("Account details saved to database successfully!")
      }
    } catch (err) {
      alert("Error updating profile.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <User className="h-8 w-8" />
              </div>
              <h2 className="font-bold text-white text-lg">{user.name}</h2>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <span className="inline-block mt-2 text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Verified Customer
              </span>
            </div>
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  activeTab === "profile" ? "bg-emerald-500 text-white shadow-glow" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" /> My Profile
              </button>
              <Link
                href="/account/orders"
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors text-gray-400 hover:bg-white/5 hover:text-white`}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" /> My Orders
                </div>
                <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              </Link>
              <button
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  activeTab === "address" ? "bg-emerald-500 text-white shadow-glow" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <MapPin className="h-4 w-4" /> Delivery Address
              </button>
              <Link
                href="/orders/track"
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors text-gray-400 hover:bg-white/5 hover:text-white`}
              >
                <ShieldCheck className="h-4 w-4" /> Track Any Order
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left text-red-400 hover:bg-red-500/10 transition-colors mt-4"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <div className="glass rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold text-white">Profile Information</h3>
                <p className="text-xs text-gray-400 mt-1">Manage your account details and contact preferences</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={e => setUser({ ...user, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-bg-primary border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-bg-primary/50 border border-white/10 rounded-lg text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={e => setUser({ ...user, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Saving to DB..." : "Save Changes"}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "address" && (
            <div className="glass rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold text-white">Default Shipping Address</h3>
                <p className="text-xs text-gray-400 mt-1">Pre-filled automatically on checkout</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300">Division</label>
                    <select
                      value={user.division}
                      onChange={e => setUser({ ...user, division: e.target.value })}
                      className="w-full px-3 py-2 bg-bg-primary border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"].map(d => (
                        <option key={d} value={d} className="bg-bg-card">{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300">District</label>
                    <input
                      value={user.district}
                      onChange={e => setUser({ ...user, district: e.target.value })}
                      placeholder="e.g. Dhaka"
                      className="w-full px-3 py-2 bg-bg-primary border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300">Thana / Upazila</label>
                    <input
                      value={user.upazila}
                      onChange={e => setUser({ ...user, upazila: e.target.value })}
                      placeholder="e.g. Gulshan"
                      className="w-full px-3 py-2 bg-bg-primary border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Street Address</label>
                  <textarea
                    rows={3}
                    value={user.address}
                    onChange={e => setUser({ ...user, address: e.target.value })}
                    placeholder="House / Flat / Road number..."
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Delivery Address"}
                </Button>
              </form>
            </div>
          )}

          {/* Quick Summary of Recent Orders */}
          <div className="glass rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white text-base">Recent Orders ({orders.length})</h4>
              <Link href="/account/orders" className="text-xs text-emerald-400 hover:underline">
                View All Orders →
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-gray-400">No orders placed yet. Explore our catalog to make your first purchase!</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div>
                      <p className="font-mono font-bold text-white">{ord.orderNumber}</p>
                      <p className="text-gray-400 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} items</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-bold text-white">৳{ord.total?.toLocaleString()}</span>
                      <Link href={`/orders/track?order=${ord.orderNumber}`}>
                        <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                          Track
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

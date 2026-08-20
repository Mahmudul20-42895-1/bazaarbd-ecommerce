"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart.store"
import { Button } from "@/components/ui/Button"
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  Banknote, 
  Wallet,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  X
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, addItem, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("bkash")
  const [couponCode, setCouponCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)

  // Interactive Payment Gateway Modal State
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"account" | "otp" | "pin" | "success">("account")
  const [mfsNumber, setMfsNumber] = useState("01711223344")
  const [mfsPin, setMfsPin] = useState("12345")
  const [processingPayment, setProcessingPayment] = useState(false)

  // Card fields for SSLCommerz
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444")
  const [cardExpiry, setCardExpiry] = useState("12/28")
  const [cardCvv, setCardCvv] = useState("789")

  const [formData, setFormData] = useState({
    name: "Rahim Uddin",
    phone: "01711223344",
    email: "rahim@gmail.com",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Gulshan",
    address: "House 42, Road 11, Block D, Banani",
    notes: ""
  })

  // Pre-fill from localStorage if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        setFormData(prev => ({
          ...prev,
          name: u.name || prev.name,
          phone: u.phone || prev.phone,
          email: u.email || prev.email,
          division: u.division || prev.division,
          district: u.district || prev.district,
          upazila: u.upazila || prev.upazila,
          address: u.address || prev.address
        }))
        if (u.phone) setMfsNumber(u.phone)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCharge = subtotal > 1000 ? 0 : (formData.division === "Dhaka" ? 60 : 120)
  const total = Math.max(0, subtotal + shippingCharge - discountAmount)

  // Add demo sample item if cart is empty
  const handleAddSampleItem = () => {
    addItem({
      id: "1",
      name: "Sonar Bangla Handloom Khadi Shirt",
      price: 1990,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600",
      category: "Clothing & Apparel"
    }, 1)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {
      const res = await api.post('/cart/coupon/validate', { code: couponCode, subtotal })
      if (res.data?.success) {
        setDiscountAmount(res.data.discount || 0)
        setCouponApplied(true)
        alert(`Coupon ${couponCode.toUpperCase()} applied! You saved ৳${res.data.discount}`)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid coupon code.")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      alert("Please add at least one product to your cart.")
      return
    }

    if (paymentMethod === "cod") {
      // Direct Cash on Delivery placement
      executeOrderPlacement("cod", undefined)
    } else {
      // Open Interactive Gateway Modal
      setPaymentStep("account")
      setGatewayModalOpen(true)
    }
  }

  const executeOrderPlacement = async (method: string, customTrxId?: string) => {
    setLoading(true)
    setProcessingPayment(true)
    try {
      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || "customer@bazaarbd.com",
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
          address: formData.address,
        },
        items: items.map(it => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.images?.[0] || (it as any).image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200"
        })),
        subtotal,
        shippingCharge,
        discountAmount,
        paymentMethod: method,
        trxId: customTrxId || `TRX-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      }

      const res = await api.post('/checkout', payload)
      if (res.data?.success && res.data.orderNumber) {
        clearCart()
        setGatewayModalOpen(false)
        router.push(`/orders/track?order=${res.data.orderNumber}`)
      }
    } catch (err) {
      console.error("Order placement error:", err)
      alert("Error finalizing checkout. Please try again.")
    } finally {
      setLoading(false)
      setProcessingPayment(false)
    }
  }

  // Handle gateway modal payment confirmation
  const handleGatewayPaymentConfirm = () => {
    const generatedTrx = `TRX-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
    executeOrderPlacement(paymentMethod, generatedTrx)
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Checkout & Payment Gateway</h1>
        <p className="text-gray-400 text-sm">Real-time payment processing & fast nationwide courier dispatch</p>
      </div>

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 border border-white/10 text-center max-w-lg mx-auto space-y-6 shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <PlusCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Cart is Currently Empty</h2>
            <p className="text-gray-400 text-xs mt-2">
              Add products from our catalog or click below to quickly load a sample product and test the full payment and tracking workflow!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleAddSampleItem} size="lg" className="w-full sm:w-auto font-bold shadow-glow">
              + Load Sample Product & Continue
            </Button>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <Truck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">1. Delivery Address in Bangladesh</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Recipient Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Rahim Uddin"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Mobile Phone Number (01XXXXXXXXX) *</label>
                  <input
                    required
                    placeholder="01711223344"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Email Address (for invoice & tracking updates)</label>
                <input
                  type="email"
                  placeholder="rahim@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Division *</label>
                  <select
                    value={formData.division}
                    onChange={e => setFormData({ ...formData, division: e.target.value })}
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"].map(d => (
                      <option key={d} value={d} className="bg-bg-card">{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">District / City *</label>
                  <input
                    required
                    placeholder="e.g. Dhaka"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Thana / Upazila *</label>
                  <input
                    required
                    placeholder="e.g. Gulshan"
                    value={formData.upazila}
                    onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Full Street Address / House / Flat *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House 42, Road 11, Block D, Banani..."
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">2. Select Payment Option</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {/* bKash */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === "bkash"
                    ? "border-pink-500 bg-pink-500/10 ring-2 ring-pink-500/50"
                    : "border-white/10 bg-bg-primary/50 hover:border-white/20"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="mt-1 accent-pink-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400 text-sm">bKash (বিকাশ)</span>
                      <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-semibold">Instant Pay</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Official bKash Payment Gateway / Direct Wallet</p>
                  </div>
                </label>

                {/* Nagad */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === "nagad"
                    ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/50"
                    : "border-white/10 bg-bg-primary/50 hover:border-white/20"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400 text-sm">Nagad (নগদ)</span>
                      <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-semibold">Instant Pay</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Bangladesh Post Office Digital Financial Service</p>
                  </div>
                </label>

                {/* Rocket / Upay */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === "rocket"
                    ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50"
                    : "border-white/10 bg-bg-primary/50 hover:border-white/20"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "rocket"}
                    onChange={() => setPaymentMethod("rocket")}
                    className="mt-1 accent-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-400 text-sm">Rocket / Upay</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-semibold">DBBL</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Dutch-Bangla Bank Rocket & UCB Upay Banking</p>
                  </div>
                </label>

                {/* SSLCOMMERZ Cards */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === "sslcommerz"
                    ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50"
                    : "border-white/10 bg-bg-primary/50 hover:border-white/20"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "sslcommerz"}
                    onChange={() => setPaymentMethod("sslcommerz")}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 text-sm">Cards & Net Banking</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold">SSLCommerz</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Visa, Mastercard, AMEX, Islami Bank, City Bank</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`sm:col-span-2 p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === "cod"
                    ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/50"
                    : "border-white/10 bg-bg-primary/50 hover:border-white/20"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-sm">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">Doorstep Pay</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Pay with cash when package arrives at your home or office</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
              <h3 className="font-semibold text-white text-lg pb-3 border-b border-white/10">
                Order Summary ({items.length} items)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img src={item.images?.[0] || (item as any).image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100"} alt="" className="h-12 w-12 rounded object-cover border border-white/10" />
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="text-xs font-medium text-gray-400">Have a promo code?</label>
                <div className="flex gap-2">
                  <input
                    placeholder="e.g. EID2026"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-bg-primary border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none uppercase"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              </div>

              {/* Calculations */}
              <div className="space-y-2 pt-4 border-t border-white/10 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Charge</span>
                  <span>{shippingCharge === 0 ? <strong className="text-emerald-400 font-semibold">FREE</strong> : `৳${shippingCharge}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-3">
                  <span>Total Due</span>
                  <span className="text-emerald-400">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold shadow-glow flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                {paymentMethod === 'cod' ? `Confirm Order (৳${total.toLocaleString()})` : `Proceed to ${paymentMethod.toUpperCase()} Payment →`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>SSLCOMMERZ & Bangladesh Bank Certified Security</span>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Interactive Payment Gateway Simulation Modal */}
      {gatewayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn">
            {/* Header branding */}
            <div className={`p-6 text-white text-center relative ${
              paymentMethod === 'bkash' ? 'bg-pink-600' :
              paymentMethod === 'nagad' ? 'bg-orange-600' :
              paymentMethod === 'rocket' ? 'bg-purple-700' : 'bg-blue-600'
            }`}>
              <button 
                onClick={() => setGatewayModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/20"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-2xl font-bold tracking-tight uppercase">{paymentMethod} Payment Gateway</h3>
              <p className="text-xs text-white/90 mt-1">Merchant: <strong>BazaarBD Retail Ltd. (01700-112233)</strong></p>
              <div className="mt-4 bg-white/20 rounded-xl py-2 px-4 inline-block">
                <span className="text-xs text-white/80">Payable Amount: </span>
                <span className="text-lg font-black text-white">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {paymentMethod === 'sslcommerz' ? (
                // Card Details Form
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Card Number</label>
                    <input
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300">Expiry (MM/YY)</label>
                      <input
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="789"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // MFS Number & PIN Form
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Your {paymentMethod.toUpperCase()} Account Number</label>
                    <input
                      type="tel"
                      value={mfsNumber}
                      onChange={e => setMfsNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Account PIN / Sandbox PIN</label>
                    <input
                      type="password"
                      maxLength={5}
                      value={mfsPin}
                      onChange={e => setMfsPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-white font-mono text-sm tracking-widest"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  type="button"
                  onClick={handleGatewayPaymentConfirm}
                  disabled={processingPayment}
                  className={`w-full h-11 font-bold text-base shadow-lg ${
                    paymentMethod === 'bkash' ? 'bg-pink-600 hover:bg-pink-500' :
                    paymentMethod === 'nagad' ? 'bg-orange-600 hover:bg-orange-500' :
                    paymentMethod === 'rocket' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {processingPayment ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Payment...
                    </span>
                  ) : (
                    `Confirm & Pay ৳${total.toLocaleString()}`
                  )}
                </Button>
              </div>

              <p className="text-[10px] text-center text-gray-400 pt-1">
                Demo sandbox: Click confirm to instantly authorize payment and receive your live tracking ID.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

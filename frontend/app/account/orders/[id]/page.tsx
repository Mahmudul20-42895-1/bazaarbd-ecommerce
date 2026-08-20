import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    date: "Nov 05, 2023",
    status: "processing",
    total: 4500,
    shippingCost: 60,
    subtotal: 4440,
    items: [
      { id: 1, name: "Wireless Earbuds", quantity: 1, price: 4440, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80" }
    ],
    address: {
      name: "John Doe",
      phone: "01712345678",
      line1: "123 Dhanmondi, Road 4",
      city: "Dhaka",
      zip: "1205"
    },
    paymentMethod: "Cash on Delivery"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account/orders" className="text-gray-400 hover:text-emerald-500 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-100">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-bg-card rounded-xl border border-white/10 p-6 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Order ID</p>
              <p className="font-semibold text-slate-100">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Date Placed</p>
              <p className="font-semibold text-slate-100">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Amount</p>
              <p className="font-semibold text-emerald-500">৳{order.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <Badge variant="info">Processing</Badge>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-bg-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">Order Status</h3>
            <div className="relative border-l-2 border-white/10 ml-3 space-y-8">
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 bg-emerald-500 rounded-full p-1 text-white border-4 border-bg-card">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-slate-100">Order Placed</h4>
                <p className="text-sm text-gray-400">Nov 05, 2023 - 10:30 AM</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 bg-blue-500 rounded-full p-1 text-white border-4 border-bg-card">
                  <Package className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-slate-100">Processing</h4>
                <p className="text-sm text-gray-400">We are preparing your order.</p>
              </div>
              <div className="relative pl-8 opacity-50">
                <div className="absolute -left-[11px] top-1 bg-gray-600 rounded-full p-1 text-white border-4 border-bg-card">
                  <Truck className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-slate-100">Shipped</h4>
                <p className="text-sm text-gray-400">Waiting to be handed over to courier.</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-bg-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-bg-primary" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100">{item.name}</h4>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-slate-100">৳{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-bg-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-slate-100">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-slate-100">৳{order.shippingCost}</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-bold text-lg">
                <span className="text-slate-100">Total</span>
                <span className="text-emerald-500">৳{order.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Shipping Information</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p className="font-semibold text-slate-100">{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.zip}</p>
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Payment Method</h3>
            <p className="text-sm text-gray-300">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

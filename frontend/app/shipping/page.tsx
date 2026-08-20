import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-4xl">
      <div className="mb-12">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
          DELIVERY INFORMATION
        </span>
        <h1 className="text-4xl font-bold text-white mb-4">Shipping & Delivery Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: August 2026</p>
      </div>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <div className="glass p-6 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Delivery Zones & Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-gray-400">
                <tr>
                  <th className="py-3 pr-4">Delivery Zone</th>
                  <th className="py-3 px-4">Estimated Time</th>
                  <th className="py-3 px-4">Standard Rate</th>
                  <th className="py-3 pl-4">Express Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 pr-4 font-medium text-white">Inside Dhaka Metro</td>
                  <td className="py-3 px-4">24 - 48 Hours</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">৳60</td>
                  <td className="py-3 pl-4">৳120</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-white">Dhaka Suburbs (Gazipur, Savar, Narayanganj)</td>
                  <td className="py-3 px-4">2 - 3 Business Days</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">৳100</td>
                  <td className="py-3 pl-4">৳180</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-white">Chittagong & Sylhet Divisions</td>
                  <td className="py-3 px-4">3 - 4 Business Days</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">৳120</td>
                  <td className="py-3 pl-4">৳220</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-white">All Other Divisions (Rajshahi, Khulna, etc.)</td>
                  <td className="py-3 px-4">3 - 5 Business Days</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">৳130</td>
                  <td className="py-3 pl-4">৳250</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Free Shipping Promotion</h2>
          <p>
            Orders with a subtotal of <strong className="text-white">৳1,000 or higher</strong> qualify for free standard shipping anywhere across Bangladesh. The discount is automatically calculated and deducted at checkout.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Courier Partners & Tracking</h2>
          <p>
            We partner with Bangladesh’s leading logistics providers including Steadfast Courier, Pathao Express, and RedX. Once your package leaves our fulfillment center, you will receive an SMS and email containing your tracking link.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">4. Cash on Delivery (COD)</h2>
          <p>
            Cash on Delivery is available nationwide. Please inspect the parcel packaging at the time of delivery before handing the payment to the delivery agent.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/orders/track">
          <Button variant="outline">Track an Existing Order</Button>
        </Link>
      </div>
    </div>
  )
}

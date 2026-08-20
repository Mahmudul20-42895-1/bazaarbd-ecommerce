import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-4xl">
      <div className="mb-12">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
          BUYER PROTECTION
        </span>
        <h1 className="text-4xl font-bold text-white mb-4">Returns & Refund Policy</h1>
        <p className="text-gray-400 text-sm">7-day hassle-free returns across Bangladesh</p>
      </div>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">1. 7-Day Return Window</h2>
          <p>
            You may request a return or size exchange within <strong className="text-white">7 calendar days</strong> from the date of package delivery. Items must be unworn, unwashed, with all original tags and packaging intact.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Eligible Conditions for Returns</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>Item received is defective, broken, or physically damaged.</li>
            <li>Incorrect product, color, or size delivered compared to order specification.</li>
            <li>Item is significantly different from description or photos on BazaarBD.</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Refund Processing & MFS Reversals</h2>
          <p>
            Upon receipt and inspection of the returned parcel at our Dhaka hub:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400">
            <li><strong>bKash / Nagad / Rocket:</strong> Refund credited directly to your mobile wallet within 24 to 48 hours.</li>
            <li><strong>Credit/Debit Cards:</strong> Refund processed via SSLCOMMERZ within 5 to 7 working bank days.</li>
            <li><strong>Cash on Delivery:</strong> Refund disbursed to your designated bKash or bank account.</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">4. How to Initiate a Return</h2>
          <p>
            Log in to your BazaarBD account, navigate to <Link href="/account/orders" className="text-emerald-400 hover:underline">My Orders</Link>, click on the specific order, and select <em>"Request Return / Exchange"</em>. Alternatively, call our hotline at <strong className="text-white">+880 1700-000000</strong>.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/contact">
          <Button>Contact Customer Care</Button>
        </Link>
      </div>
    </div>
  )
}

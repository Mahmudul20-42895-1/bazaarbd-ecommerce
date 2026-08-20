import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Effective as of: August 18, 2026</p>
      </div>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using BazaarBD, you agree to be bound by these Terms of Service and all applicable laws and regulations of the People’s Republic of Bangladesh.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Product Pricing & Availability</h2>
          <p>
            All prices listed on BazaarBD are denominated in Bangladeshi Taka (৳ BDT) inclusive of applicable VAT unless stated otherwise. In the event an item is listed with an erroneous price due to system error, BazaarBD reserves the right to cancel the order and provide a full refund.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">3. User Accounts & Verification</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and OTP codes. You agree to provide accurate, current, and complete information during checkout and registration.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">4. Governing Law & Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with the laws of the People’s Republic of Bangladesh. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
          </p>
        </div>
      </div>
    </div>
  )
}

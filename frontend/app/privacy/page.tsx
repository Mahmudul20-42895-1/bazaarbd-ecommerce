import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last revised: August 18, 2026</p>
      </div>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            When you browse BazaarBD, register an account, or place an order, we collect essential information required to fulfill your order and provide support, including your name, email address, phone number (used for SMS OTP and delivery updates), delivery address, and device logs.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Payment Data & Security</h2>
          <p>
            BazaarBD does <strong className="text-white">NOT</strong> store your sensitive credit/debit card numbers or bKash/Nagad PINs. All payment transactions are encrypted and processed through SSLCOMMERZ, a licensed Bangladesh Bank payment gateway certified under PCI-DSS Level 1.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Third-Party Sharing</h2>
          <p>
            We only share delivery details (recipient name, phone number, and address) with verified Bangladesh logistics partners (Steadfast, Pathao, RedX) solely for delivering your purchases. We do not sell or monetize customer data.
          </p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
          <h2 className="text-xl font-semibold text-white">4. Your Rights & Data Deletion</h2>
          <p>
            You can request access to your personal data or request deletion of your account and order history at any time by contacting our Data Protection Officer at <span className="text-emerald-400">privacy@bazaarbd.com</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

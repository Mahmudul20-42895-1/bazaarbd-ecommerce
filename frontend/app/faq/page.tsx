"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: "What payment methods are supported on BazaarBD?",
      a: "We support instant online payments via bKash, Nagad, Rocket, Upay, Visa, Mastercard, and American Express processed securely via SSLCOMMERZ. We also offer Cash on Delivery (COD) across all 64 districts in Bangladesh."
    },
    {
      q: "How long does delivery take inside and outside Dhaka?",
      a: "Deliveries inside Dhaka Metro usually arrive within 24 to 48 hours. For Dhaka Suburbs and all other divisions (Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh), delivery typically takes 2 to 4 business days via our courier partners."
    },
    {
      q: "What are the shipping charges?",
      a: "Standard shipping is ৳60 inside Dhaka Metro, ৳100 for Dhaka Suburbs, and ৳120-130 for all other divisions. Orders with subtotal exceeding ৳1,000 qualify for FREE standard delivery!"
    },
    {
      q: "What is your return & exchange policy?",
      a: "We provide a 7-day hassle-free return and exchange policy. If an item is damaged, defective, or incorrect size, you can initiate a return directly from your Account Dashboard or by contacting customer support."
    },
    {
      q: "How can I track my order status?",
      a: "You can track your order in real time by visiting our 'Track Order' page and entering your unique Order Number (e.g. ORD-20240818-XXXXX), or through the 'My Orders' section in your account."
    },
    {
      q: "Are the traditional handicraft and clothing products authentic?",
      a: "Yes! All Jamdani sarees, Nakshi Kantha wall hangings, Panjabis, and leather items are sourced directly from registered artisans and reputable Bangladeshi heritage brands."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-400">Everything you need to know about shopping, shipping, and payments on BazaarBD</p>
      </div>

      <div className="space-y-4 mb-16">
        {faqs.map((faq, i) => (
          <div key={i} className="glass rounded-xl border border-white/10 overflow-hidden transition-all">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-6 font-semibold text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <span>{faq.q}</span>
              <span className="text-emerald-400 text-xl font-bold">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="p-6 pt-0 text-sm text-gray-300 leading-relaxed border-t border-white/5">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-2xl border border-white/10 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
        <p className="text-gray-400 text-sm mb-6">Our 24/7 customer support team in Dhaka is ready to assist you.</p>
        <Link href="/contact">
          <Button>Contact Support</Button>
        </Link>
      </div>
    </div>
  )
}

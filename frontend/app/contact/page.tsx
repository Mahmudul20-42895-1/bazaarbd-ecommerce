"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Our Team</h1>
        <p className="text-gray-400">
          Have a question about an order, shipping rates, or partnership? We are here to help you 24/7.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass p-6 rounded-xl border border-white/10 space-y-4">
            <h2 className="text-xl font-semibold text-white">Dhaka Headquarters</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <span>Level 7, Concord Tower, 123 Gulshan Avenue, Dhaka 1212, Bangladesh</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <span>+880 1700-000000 / +880 1800-000000</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <span>support@bazaarbd.com</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-lg">🕒</span>
                <span>Customer Support: 24 Hours / 7 Days a Week</span>
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-white/10 space-y-3">
            <h3 className="font-semibold text-white">Merchant & Corporate Queries</h3>
            <p className="text-sm text-gray-400">
              Interested in selling your crafts or products on BazaarBD? Reach our merchant onboarding team at <span className="text-emerald-400">merchants@bazaarbd.com</span>.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass p-8 rounded-2xl border border-white/10">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-400 text-sm">
                Thank you for reaching out. One of our support executives will reply within 2 to 4 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Name</label>
                <input required placeholder="Rahim Uddin" className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input type="email" required placeholder="rahim@gmail.com" className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone (Optional)</label>
                  <input placeholder="017XXXXXXXX" className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Subject / Order ID</label>
                <input placeholder="e.g. Question regarding Order #ORD-2024..." className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Message</label>
                <textarea rows={4} required placeholder="How can we help you today?" className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? "Sending..." : "Submit Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

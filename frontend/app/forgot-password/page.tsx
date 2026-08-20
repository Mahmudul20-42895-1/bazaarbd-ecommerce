"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 md:p-10 border border-white/10">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white tracking-tighter">
              Bazaar<span className="text-emerald-500">BD</span>
            </Link>
            <h1 className="text-xl font-semibold text-white mt-4">Reset Your Password</h1>
            <p className="text-gray-400 text-sm mt-1">
              Enter your registered email address and we will send you password reset instructions.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <h3 className="font-semibold text-white">Reset Link Sent</h3>
              <p className="text-sm text-gray-400">
                Check your inbox at <span className="text-white font-medium">{email}</span> for instructions to reset your password.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="outline" className="w-full">Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-emerald-500 hover:underline">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

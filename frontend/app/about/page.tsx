import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex-1 max-w-5xl">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
          OUR STORY
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Empowering Bangladesh's Finest Artisans & Modern E-Commerce
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          BazaarBD was founded with a mission to bring authentic, high-quality Bangladeshi products—from traditional handloom Jamdani sarees and embroidered Panjabis to cutting-edge electronics—directly to your doorstep with modern convenience and secure payments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { label: "Active Customers", value: "50,000+" },
          { label: "Districts Covered", value: "64 Districts" },
          { label: "Local Artisans Supported", value: "300+" },
          { label: "Customer Satisfaction", value: "99.4%" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-xl text-center border border-white/10">
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="space-y-12 mb-20">
        <h2 className="text-3xl font-bold text-white text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-xl border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              🇧🇩
            </div>
            <h3 className="text-xl font-semibold text-white">Pride in Heritage</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We preserve and champion traditional Bangladeshi craftsmanship by connecting weavers and artisans directly with conscious consumers.
            </p>
          </div>

          <div className="glass p-8 rounded-xl border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-white">Speed & Reliability</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              With 24-48h delivery inside Dhaka and fast nationwide courier partnerships (Pathao, Steadfast, RedX), we ensure prompt doorstep delivery.
            </p>
          </div>

          <div className="glass p-8 rounded-xl border border-white/10 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              🔒
            </div>
            <h3 className="text-xl font-semibold text-white">Trust & Security</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full payment protection with SSLCOMMERZ supporting bKash, Nagad, Rocket, cards, and flexible Cash on Delivery options.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="glass p-12 rounded-2xl border border-emerald-500/20 text-center bg-gradient-to-r from-emerald-950/40 via-bg-card to-emerald-950/40">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience BazaarBD?</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Explore thousands of curated clothing, handicrafts, electronics, and accessories with nationwide fast delivery.
        </p>
        <Link href="/shop">
          <Button size="lg" className="px-8">Browse Catalog</Button>
        </Link>
      </div>
    </div>
  )
}

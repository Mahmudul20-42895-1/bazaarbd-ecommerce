"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Ticket } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function NewCouponPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "500",
    perUserLimit: "1",
    expiresAt: "2026-12-31",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount || 0),
        maxDiscount: Number(formData.maxDiscount || 0),
        usageLimit: Number(formData.usageLimit || 100),
        expiresAt: formData.expiresAt
      }
      const res = await api.post('/admin/coupons', payload)
      if (res.data && res.data.success) {
        alert(`Coupon ${formData.code.toUpperCase()} created in database!`)
        router.push("/coupons")
      }
    } catch (err) {
      alert("Failed to save coupon to database.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/coupons">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Discount Coupon</h1>
          <p className="text-sm text-muted-foreground">Setup promotional discount campaigns for BazaarBD shoppers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coupon Details</CardTitle>
            <CardDescription>Promo code identifier, discount type and value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code (Uppercase)</Label>
                <Input 
                  id="code" 
                  placeholder="e.g. EID2026, BAZAAR10" 
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select defaultValue={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Discount Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">{formData.type === "percentage" ? "Discount (%)" : "Discount (৳)"}</Label>
                <Input 
                  id="value" 
                  type="number" 
                  placeholder={formData.type === "percentage" ? "15" : "300"} 
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min Order Value (৳)</Label>
                <Input 
                  id="minOrder" 
                  type="number" 
                  placeholder="1000" 
                  value={formData.minOrderAmount}
                  onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Cap Discount (৳)</Label>
                <Input 
                  id="maxDiscount" 
                  type="number" 
                  placeholder="500" 
                  value={formData.maxDiscount}
                  onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Limits & Expiry</CardTitle>
            <CardDescription>Control redemption limits and campaign end date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Total Usages Allowed</Label>
                <Input 
                  id="usageLimit" 
                  type="number" 
                  value={formData.usageLimit}
                  onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perUserLimit">Per User Limit</Label>
                <Input 
                  id="perUserLimit" 
                  type="number" 
                  value={formData.perUserLimit}
                  onChange={e => setFormData({ ...formData, perUserLimit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date</Label>
                <Input 
                  id="expiresAt" 
                  type="date" 
                  value={formData.expiresAt}
                  onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/coupons">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            {loading ? "Saving to DB..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  )
}
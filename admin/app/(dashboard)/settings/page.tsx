"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [settings, setSettings] = useState({
    storeName: "BazaarBD",
    storeEmail: "support@bazaarbd.com",
    storePhone: "+880 1700-000000",
    currency: "BDT (৳)",
    vatPercentage: 5,
    sslcommerzSandbox: true,
    freeShippingMinAmount: 1000
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setFetching(true)
        const res = await api.get('/admin/settings')
        if (res.data && res.data.success) {
          setSettings(res.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/admin/settings', settings)
      if (res.data && res.data.success) {
        alert("Store settings saved to database successfully!")
      }
    } catch (err) {
      alert("Error saving settings.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <p>Loading store configurations from database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-sm text-muted-foreground">Configure payment gateways, Bangladesh VAT, and store identity</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Store Details</CardTitle>
            <CardDescription>Brand name, customer support phone, and currency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input 
                  id="storeName" 
                  value={settings.storeName} 
                  onChange={e => setSettings({ ...settings, storeName: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency Code</Label>
                <Input 
                  id="currency" 
                  value={settings.currency} 
                  onChange={e => setSettings({ ...settings, currency: e.target.value })} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Customer Support Email</Label>
                <Input 
                  id="storeEmail" 
                  value={settings.storeEmail} 
                  onChange={e => setSettings({ ...settings, storeEmail: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Hotline Number</Label>
                <Input 
                  id="storePhone" 
                  value={settings.storePhone} 
                  onChange={e => setSettings({ ...settings, storePhone: e.target.value })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Shipping Thresholds</CardTitle>
            <CardDescription>SSLCOMMERZ gateway and free delivery threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeShip">Free Delivery Threshold (৳)</Label>
                <Input 
                  id="freeShip" 
                  type="number"
                  value={settings.freeShippingMinAmount} 
                  onChange={e => setSettings({ ...settings, freeShippingMinAmount: Number(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT / Sales Tax (%)</Label>
                <Input 
                  id="vat" 
                  type="number"
                  value={settings.vatPercentage} 
                  onChange={e => setSettings({ ...settings, vatPercentage: Number(e.target.value) })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
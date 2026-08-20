"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Truck, Plus, Check, MapPin } from "lucide-react"

export default function ShippingPage() {
  const [zones, setZones] = useState([
    {
      id: "1",
      name: "Inside Dhaka City",
      divisions: ["Dhaka Metro", "Uttara", "Mirpur", "Gulshan", "Dhanmondi", "Old Dhaka"],
      standardRate: 60,
      expressRate: 120,
      estimatedDelivery: "24-48 Hours",
      status: "active"
    },
    {
      id: "2",
      name: "Dhaka Suburbs & Greater Dhaka",
      divisions: ["Gazipur", "Narayanganj", "Savar", "Keraniganj", "Narsingdi"],
      standardRate: 100,
      expressRate: 180,
      estimatedDelivery: "2-3 Business Days",
      status: "active"
    },
    {
      id: "3",
      name: "Chittagong & Sylhet Divisions",
      divisions: ["Chittagong", "Cox's Bazar", "Sylhet", "Moulvibazar", "Comilla", "Noakhali"],
      standardRate: 120,
      expressRate: 220,
      estimatedDelivery: "3-4 Business Days",
      status: "active"
    },
    {
      id: "4",
      name: "Rest of Bangladesh (All Divisions)",
      divisions: ["Rajshahi", "Rangpur", "Khulna", "Barisal", "Mymensingh"],
      standardRate: 130,
      expressRate: 250,
      estimatedDelivery: "3-5 Business Days",
      status: "active"
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipping & Delivery Zones</h1>
          <p className="text-sm text-muted-foreground">Configure Bangladesh courier rates (Pathao, Steadfast, RedX) and delivery zones</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Shipping Zone
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {zones.map((zone) => (
          <Card key={zone.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {zone.name}
                </CardTitle>
                <Badge variant="success">Active</Badge>
              </div>
              <CardDescription>Estimated Time: {zone.estimatedDelivery}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
                <div>
                  <span className="text-xs text-muted-foreground">Standard Delivery</span>
                  <p className="text-lg font-bold text-primary">৳{zone.standardRate}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Express Delivery</span>
                  <p className="text-lg font-bold text-primary">৳{zone.expressRate}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Coverage Areas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {zone.divisions.map((area) => (
                    <span key={area} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm">Edit Rates</Button>
                <Button variant="secondary" size="sm">Manage Areas</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
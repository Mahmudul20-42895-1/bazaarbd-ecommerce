"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ListTree, 
  Tag, 
  ShoppingCart, 
  Users, 
  Ticket, 
  Image as ImageIcon, 
  Boxes, 
  Star, 
  Truck, 
  Settings 
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Products", href: "/products", icon: Package },
  { title: "Categories", href: "/categories", icon: ListTree },
  { title: "Brands", href: "/brands", icon: Tag },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Coupons", href: "/coupons", icon: Ticket },
  { title: "Banners", href: "/banners", icon: ImageIcon },
  { title: "Inventory", href: "/inventory", icon: Boxes },
  { title: "Reviews", href: "/reviews", icon: Star },
  { title: "Shipping", href: "/shipping", icon: Truck },
  { title: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-300">
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <span className="text-lg font-bold text-white tracking-tight">BazaarBD Admin</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-slate-800 hover:text-white",
                  pathname === item.href ? "bg-slate-800 text-white" : ""
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}